
import React, { useEffect, useState } from 'react';
import { createClient } from '../../packages/database/client';
import { Profile } from '../../packages/database/types';
import { LucideShieldAlert } from 'lucide-react';
import { Button } from '../../packages/ui/src';

interface CrmMiddlewareProps {
  user: Profile | null;
  children: React.ReactNode;
}

export const CrmMiddleware: React.FC<CrmMiddlewareProps> = ({ user, children }) => {
  if (!user || user.global_role !== 'admin') {
     return React.createElement('div', { className: "h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center border-t-4 border-red-600" },
        React.createElement(LucideShieldAlert, { size: 64, className: "text-red-500 mb-6" }),
        React.createElement('h1', { className: "text-3xl font-bold mb-2" }, "RESTRICTED AREA"),
        React.createElement('p', { className: "text-slate-400 max-w-md mb-8 font-mono text-sm" },
           "ACCESS DENIED: LEVEL 5 CLEARANCE REQUIRED.",
           React.createElement('br'),
           "This incident has been logged."
        ),
        React.createElement(Button, { onClick: () => window.location.hash = 'patient', className: "bg-red-600 hover:bg-red-700" }, "Return to Public Site")
     );
  }
  
  return React.createElement(React.Fragment, null, children);
};
