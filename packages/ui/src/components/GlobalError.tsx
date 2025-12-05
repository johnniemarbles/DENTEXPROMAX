
import React from 'react';
import { Button } from './Button';
import { LucideAlertTriangle } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 m-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
        <LucideAlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">System Malfunction</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We encountered an unexpected error while processing your request. 
        <br/>
        <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded mt-2 inline-block">
            {error.message || 'Unknown Error'}
        </span>
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="primary">Try Again</Button>
        <Button onClick={() => window.location.reload()} variant="outline">Reload Page</Button>
      </div>
    </div>
  );
};
