
import React from 'react';
import { Clinic } from '../../../packages/database/types';
import { Button } from '../../../packages/ui/src';
import { LucideShieldAlert, LucideLock } from 'lucide-react';

interface VerificationGateProps {
  clinic: Clinic;
  children: React.ReactNode;
}

export const VerificationGate: React.FC<VerificationGateProps> = ({ clinic, children }) => {
  // PASS: Verified
  if (clinic.claim_status === 'verified') {
    return <>{children}</>;
  }

  // FAIL: Unclaimed or Pending
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 m-6 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-amber-500/30">
        <LucideShieldAlert className="text-amber-500" size={40} />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3">Verification Required</h2>
      <p className="text-slate-400 max-w-lg mb-8 leading-relaxed">
        The clinic <span className="font-bold text-white">"{clinic.name}"</span> is currently in 
        <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wide">
          {clinic.claim_status.replace('_', ' ')}
        </span>
        <br/> mode. To unlock the full Operating System, you must verify ownership.
      </p>

      <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 max-w-lg w-full text-left mb-8 shadow-inner">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <LucideLock size={12} /> Features Locked
        </h3>
        <ul className="space-y-4 text-sm text-slate-400">
          <li className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-red-500">✕</div> 
            <span>Patient Appointment Management</span>
          </li>
          <li className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-red-500">✕</div> 
             <span>Revenue & Analytics Dashboard</span>
          </li>
          <li className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-red-500">✕</div> 
             <span>Staff Roles & Permissions</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="primary" size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">Begin Verification</Button>
        <Button variant="outline" size="lg">Contact Support</Button>
      </div>
    </div>
  );
};
