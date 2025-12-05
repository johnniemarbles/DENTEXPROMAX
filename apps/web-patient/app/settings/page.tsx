
'use client';

import React from 'react';
import { LucideSettings, LucideBell, LucideLock, LucideCreditCard } from 'lucide-react';

export const PatientSettings: React.FC = () => {
  return (
    <div className="text-white max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <LucideSettings className="w-8 h-8 text-slate-400" /> Account Settings
        </h1>

        <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold">
                    <LucideBell size={20} /> Notifications
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-medium">Appointment Reminders</p>
                            <p className="text-xs text-slate-500">Get text messages 24h before visits.</p>
                        </div>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-50">
                <div className="flex items-center gap-3 mb-4 text-slate-400 font-bold">
                    <LucideCreditCard size={20} /> Payment Methods
                </div>
                <p className="text-sm text-slate-500">No cards on file. Add a card to speed up booking.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-50">
                <div className="flex items-center gap-3 mb-4 text-slate-400 font-bold">
                    <LucideLock size={20} /> Privacy & Security
                </div>
                <p className="text-sm text-slate-500">Change password and manage 2FA.</p>
            </div>
        </div>
    </div>
  );
};