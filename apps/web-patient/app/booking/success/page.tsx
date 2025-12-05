
import React from 'react';
import { Button } from '../../../../../packages/ui/src';
import { LucideCheckCircle } from 'lucide-react';

interface BookingSuccessProps {
    onNavigate: (path: string) => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <LucideCheckCircle size={40} className="text-green-600" />
       </div>
       <h1 className="text-3xl font-bold text-slate-900 mb-2">Request Sent!</h1>
       <p className="text-slate-600 max-w-md mb-8">
         Your appointment request has been securely transmitted to the clinic. They will review it and confirm shortly via email.
       </p>
       <div className="flex gap-4">
          <Button onClick={() => onNavigate('/')} variant="outline">Back to Directory</Button>
          <Button onClick={() => onNavigate('/dashboard')}>View My Dashboard</Button>
       </div>
    </div>
  );
};
