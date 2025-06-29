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

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  console.log('Attempting sign in with:', { email, password: '***' });
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Supabase response:', { 
      user: data?.user ? 'User found' : 'No user', 
      session: data?.session ? 'Session created' : 'No session',
      error: error?.message || 'No error'
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user returned from authentication');
    }

    return data;
  } catch (err: any) {
    console.error('Auth helper error:', err);
    throw err;
  }
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error);
      return null; // Return null instead of throwing for better UX
    }
    
    console.log('Current user check:', user ? 'User found' : 'No user');
    return user;
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return null;
  }
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