
import React, { useEffect, useState } from 'react';
import { createClient } from '../../packages/database/client';
import { Clinic, Profile } from '../../packages/database/types';
import { LucideLoader2, LucideShieldBan, LucideArrowRight } from 'lucide-react';
import { Button } from '../../packages/ui/src';

interface ClinicMiddlewareProps {
  user: Profile | null;
  children: (clinic: Clinic) => React.ReactNode;
}

export const ClinicMiddleware: React.FC<ClinicMiddlewareProps> = ({ user, children }) => {
  const [loading, setLoading] = useState(true);
  const [activeClinic, setActiveClinic] = useState<Clinic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirectPro, setRedirectPro] = useState(false);
  const db = createClient();

  useEffect(() => {
    const resolveContext = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Verify Global Role
      if (user.global_role !== 'clinic_user' && user.global_role !== 'admin') {
        // If they are a pro candidate, suggest redirection
        if (user.global_role === 'pro_candidate') {
           setRedirectPro(true);
        } else {
           setError('Global Role Authorization Failed. This portal is for Clinic Staff only.');
        }
        setLoading(false);
        return;
      }

      // 2. Fetch Memberships (Context Switching)
      const myClinics = await db.getMyClinics();
      
      if (myClinics.length === 0) {
        setError('No Clinic Memberships Found. You are not linked to any specific practice.');
      } else {
        // Auto-select first clinic for this phase (Multi-tenant selector coming later)
        setActiveClinic(myClinics[0]);
      }
      setLoading(false);
    };

    resolveContext();
  }, [user]);

  if (loading) {
    return React.createElement('div', { className: "h-screen w-full flex items-center justify-center bg-slate-950 text-emerald-500" },
      React.createElement(LucideLoader2, { className: "animate-spin w-8 h-8" }),
      React.createElement('span', { className: "ml-3 font-mono text-sm" }, "SECURING CONTEXT...")
    );
  }

  // Redirect Logic for Pros
  if (redirectPro) {
      return React.createElement('div', { className: "h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center" },
      React.createElement('h1', { className: "text-2xl font-bold mb-2" }, "Wrong Portal"),
      React.createElement('p', { className: "text-slate-400 max-w-md mb-8" },
        "It looks like you are a Dental Professional. Please use the Pro Hub."
      ),
      React.createElement(Button, { onClick: () => window.location.hash = 'pro' }, "Go to Pro Hub")
    );
  }

  if (error || !user || !activeClinic) {
    return React.createElement('div', { className: "h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center" },
      React.createElement(LucideShieldBan, { size: 48, className: "text-red-500 mb-6" }),
      React.createElement('h1', { className: "text-2xl font-bold mb-2" }, "Access Denied"),
      React.createElement('p', { className: "text-slate-400 max-w-md mb-8" },
        error || 'You must be logged in as a Clinic Staff member to access this Operating System.'
      ),
      React.createElement(Button, { onClick: () => window.location.hash = 'auth' }, "Return to Login")
    );
  }

  // Render the App Context with the resolved Active Clinic
  return React.createElement(React.Fragment, null, children(activeClinic));
};
