
import React from 'react';
import { Button } from '../../../../packages/ui/src';
import { LucideFileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
         <LucideFileQuestion className="w-10 h-10 text-emerald-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Resource Missing</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The patient record or schedule entry you are trying to access does not exist in this tenant's context.
      </p>
      <Button onClick={() => window.location.hash = 'clinic'} variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
        Return to Dashboard
      </Button>
    </div>
  );
}
