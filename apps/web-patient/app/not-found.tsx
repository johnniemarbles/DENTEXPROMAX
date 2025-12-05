
import React from 'react';
import { Button } from '../../../../packages/ui/src';
import { LucideSearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <LucideSearchX className="w-20 h-20 text-slate-300 mb-6" />
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Clinic Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We couldn't locate the dentist or clinic you are looking for. They may have been delisted or the URL is incorrect.
      </p>
      <Button onClick={() => window.location.hash = 'patient'} variant="primary">
        Browse Directory
      </Button>
    </div>
  );
}
