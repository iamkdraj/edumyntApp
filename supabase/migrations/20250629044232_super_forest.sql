/*
  # Fix Profile RLS Policy for Signup

  The current RLS policy prevents profile creation during signup because
  the user session isn't fully established yet. This migration updates
  the policy to allow profile creation during the signup process.
*/

-- Drop the existing insert policy for profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new insert policy that allows profile creation during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    -- Allow if the user is authenticated and the profile ID matches their auth ID
    (auth.uid() = id) OR
    -- Allow if this is during signup (no existing profile yet)
    (
      auth.uid() = id AND 
      NOT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Also ensure the profiles table has proper triggers for automatic profile creation
-- This function will be called when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();