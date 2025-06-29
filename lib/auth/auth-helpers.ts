import { createClient } from '@/lib/supabase/client'

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw error

  // Profile creation is handled by database trigger (handle_new_user)
  // No need to manually create profile here

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  console.log('Attempting sign in with:', { email, password: '***' });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  console.log('Sign in result:', { data: data?.user ? 'User found' : 'No user', error });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }
  
  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Get user error:', error);
    throw error;
  }
  
  console.log('Current user:', user ? 'Found' : 'Not found');
  return user
}

export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  if (!user) return null
  
  // For now, just return the user data since we're having issues with the database
  return {
    id: user.id,
    full_name: user.user_metadata?.full_name || null,
    username: user.email?.split('@')[0] || null,
    email: user.email
  }
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) throw error
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) throw error
}