'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../packages/database/client';
import { Calendar, Clock, CheckCircle, AlertCircle, RefreshCw, Plus, UserPlus, FileText, MessageSquare } from 'lucide-react';
import { SmartBookingModal } from '../../../packages/ui/src';

interface ClinicDashboardProps {
  clinic?: any;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ clinic }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const db = createClient();

  useEffect(() => {
    fetchQueue();
    // Use the mock channel API
    const channel = db.channel('clinic-dashboard').subscribe();
    return () => { db.removeChannel(channel); };
  }, []);

  async function fetchQueue() {
    setLoading(true);
    // 1. Get the authenticated user's clinic context
    const myClinics = await db.getMyClinics();
    
    if (myClinics.length > 0) {
        const activeClinicId = myClinics[0].id;
        
        // 2. Fetch appointments using the Mock Client Method
        const data = await db.getAppointmentsForClinic(activeClinicId);
        
        // 3. Filter and Enrich (Mock Join)
        const activeRequests = data
            .filter((a: any) => ['pending', 'proposed'].includes(a.status))
            .sort((a: any, b: any) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime());

        // In a real DB join, this comes back. In mock, we map it manually if needed, 
        // but our Mock DB client's `getAppointmentsForClinic` returns the raw array.
        // We need to fetch profiles to get names.
        const enriched = await Promise.all(activeRequests.map(async (req) => {
             // In the mock, patient_id is the user ID. 
             // We don't have a `getProfile` method exposed easily, 
             // so we'll fallback to a generic name if missing or assume the frontend handles it.
             // For the demo, let's just use the ID or hardcode if the join isn't in the client method.
             // Actually, the Mock Data has `patient_id`.
             return {
                 ...req,
                 profiles: { full_name: req.patient_id ? 'Jane Doe' : 'Guest' } // Simplified for Mock
             };
        }));

        setRequests(enriched);
    }
    setLoading(false);
  }

  const handleAccept = async (id: string) => {
      await db.updateAppointment(id, { status: 'confirmed', proposed_by: 'clinic' });
      fetchQueue();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
       {/* Header & Quick Actions */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Front Desk <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
             </h1>
             <p className="text-slate-400 text-sm mt-1">Manage incoming patient requests and daily flow.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => alert('Feature coming: Manual Booking')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"><Plus className="w-4 h-4" /> New Appointment</button>
             <button onClick={() => fetchQueue()} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
          </div>
       </div>

       {/* Action Stats */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col">
             <span className="text-xs font-bold text-slate-500 uppercase">Pending</span>
             <span className="text-2xl font-bold text-orange-400">{requests.filter(r => r.status === 'pending').length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col">
             <span className="text-xs font-bold text-slate-500 uppercase">Negotiating</span>
             <span className="text-2xl font-bold text-blue-400">{requests.filter(r => r.status === 'proposed').length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col">
             <span className="text-xs font-bold text-slate-500 uppercase">Today</span>
             <span className="text-2xl font-bold text-white">0</span>
          </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:border-emerald-500/50 transition-colors group" onClick={() => alert("Quick Add Patient")}>
             <UserPlus className="w-6 h-6 text-emerald-500 mb-1 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-bold text-emerald-500">Add Patient</span>
          </div>
       </div>

       {/* Active Queue */}
       <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Live Request Feed</h3>
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map(req => (
             <div key={req.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">{req.profiles?.full_name?.[0] || 'G'}</div>
                        <div>
                            <h4 className="font-bold text-white">{req.profiles?.full_name || 'Guest Patient'}</h4>
                            <p className="text-xs text-slate-400">{req.service_type}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded text-slate-300 uppercase">{req.status}</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-300 bg-black/20 p-3 rounded-xl mb-4">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {new Date(req.requested_time).toLocaleString()}
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => handleAccept(req.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"><CheckCircle className="w-4 h-4" /> Confirm</button>
                     <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"><Clock className="w-4 h-4" /> Reschedule</button>
                 </div>
             </div>
          ))}
          {requests.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-500 font-medium">No pending requests.</p>
                  <p className="text-xs text-slate-600 mt-1">New patient bookings will appear here instantly.</p>
              </div>
          )}
       </div>
    </div>
  );
}