
import React, { useEffect, useState } from 'react';
import { createClient } from '../../packages/database/client';
import { Profile } from '../../packages/database/types';
import { LucideVideo, LucideShieldAlert } from 'lucide-react';
import { Button } from '../../packages/ui/src';

interface RecruitMiddlewareProps {
  user: Profile | null;
  children: React.ReactNode;
}

export const RecruitMiddleware: React.FC<RecruitMiddlewareProps> = ({ user, children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    // Allow Clinic Users (Hiring Managers) and Admins
    if (user.global_role === 'clinic_user' || user.global_role === 'admin') {
        setAuthorized(true);
    }
    setLoading(false);
  }, [user]);

  if (loading) return null;

  if (!authorized) {
     return React.createElement('div', { className: "h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center" },
        React.createElement(LucideShieldAlert, { size: 64, className: "text-cyan-500 mb-6" }),
        React.createElement('h1', { className: "text-3xl font-bold mb-2" }, "Talent Portal Access"),
        React.createElement('p', { className: "text-slate-400 max-w-md mb-8 font-mono text-sm" },
           "Only Hiring Managers (Clinic Staff) can access this portal."
        ),
        React.createElement(Button, { onClick: () => window.location.hash = 'public', className: "bg-cyan-600 hover:bg-cyan-700" }, "Back to Home")
     );
  }
  
  return React.createElement(React.Fragment, null, children);
};
