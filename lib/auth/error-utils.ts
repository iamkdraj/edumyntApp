// Centralized error formatting for authentication
export function formatAuthError(error: any) {
  // Supabase error object
  if (error && typeof error === 'object' && (error.message || error.error_description)) {
    const message = error.message || error.error_description || 'An unknown authentication error occurred.';
    const code = error.code || error.status || 'AUTH_ERROR';
    return Object.assign(new Error(message), { code });
  }
  // Custom error with message/code
  if (error && typeof error === 'object' && error.code && error.message) {
    return Object.assign(new Error(error.message), { code: error.code });
  }
  // String error
  if (typeof error === 'string') {
    return Object.assign(new Error(error), { code: 'AUTH_ERROR' });
  }
  // Fallback
  return Object.assign(new Error('An unknown authentication error occurred.'), { code: 'AUTH_ERROR' });
} 