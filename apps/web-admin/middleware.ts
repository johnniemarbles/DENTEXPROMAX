
import React, { useEffect } from 'react';
import { Profile } from '../../packages/database/types';

interface AdminMiddlewareProps {
  user: Profile | null;
  children: React.ReactNode;
}

export const AdminMiddleware: React.FC<AdminMiddlewareProps> = ({ user, children }) => {
  
  // Logic adapted from Next.js Middleware to Client Component
  // We check against the authenticated user prop passed from the main gateway.
  
  // 1. Strict Admin Check: Matches the server-side logic provided
  const isAdmin = user && (user.email === 'admin@dentistry.exchange' || user.global_role === 'admin');

  useEffect(() => {
    if (!isAdmin) {
       // Redirect to Public Home to hide the admin panel's existence.
       // Equivalent to NextResponse.redirect('https://www.dentistry.exchange');
       // We use 'replace' logic by checking current hash to avoid history loops if possible,
       // though window.location.hash assignment pushes to history.
       if (window.location.hash !== '#public' && window.location.hash !== '') {
           window.location.hash = 'public';
       }
    }
  }, [isAdmin]);

  if (!isAdmin) {
      // Render nothing while redirecting to prevent flash of restricted content
      return null;
  }
  
  return React.createElement(React.Fragment, null, children);
};
