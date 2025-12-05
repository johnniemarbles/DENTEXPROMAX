
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { MapPin, RefreshCw, Calendar, Clock, Activity, ChevronRight } from 'lucide-react';

interface PatientDashboardProps {
    onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const db = createClient();

  useEffect(() => {
    async function init() {
      try {
        const u = db.getCurrentUser();
        setUser(u);
        if (u) {
            await fetchBookings(u.id);
        } else {
            setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    init();
  }, []);

  async function fetchBookings(userId: string) {
    setLoading(true);
    // Mock DB Call
    const data = await db.getAppointmentsForPatient(userId);
    
    if (data) {
        // Manual Join for Clinic Names (Mock Limitation)
        const allClinics = await db.getClinics('all');
        const enriched = data.map((appt: any) => {
            const clinic = allClinics.find((c: any) => c.id === appt.clinic_id);
            return {
                ...appt,
                clinics: clinic || { name: 'Unknown Clinic', address: 'Unknown Address' }
            };
        });
        
        setBookings(enriched.sort((a: any, b: any) => 
            new Date(b.requested_time).getTime() - new Date(a.requested_time).getTime()
        ));
    }
    setLoading(false);
  }

  // RENDER
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 p-6 text-white">
        
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
               Negotiation Center
               <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
            </h1>
            <p className="text-slate-400 mt-2">Manage your appointments and requests.</p>
          </div>
          <button 
            onClick={() => user && fetchBookings(user.id)} 
            className="p-2 bg-slate-900 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Content State Switcher */}
        {loading && bookings.length === 0 ? (
            <div className="py-20 text-center">
                <p className="text-slate-500 animate-pulse">Loading your data...</p>
            </div>
        ) : bookings.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No active appointments</h3>
                <p className="text-slate-500 mb-6">You haven't booked any visits yet.</p>
                <button 
                    onClick={() => onNavigate('/')} 
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                    Find a Dentist <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        ) : (
            <div className="space-y-4">
               {bookings.map(booking => {
                  const isMyTurn = booking.status === 'proposed' && booking.proposed_by === 'clinic';
                  
                  return (
                     <div key={booking.id} className={`rounded-2xl border p-6 transition-all ${
                        isMyTurn 
                            ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-900/20' 
                            : 'bg-slate-900 border-slate-800'
                     }`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                        isMyTurn ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                                    }`}>
                                        {isMyTurn ? 'Action Required' : booking.status}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(booking.requested_time).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white">{booking.clinics?.name || 'Clinic'}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                   <MapPin className="w-3 h-3" /> {booking.clinics?.address}
                                </div>
                            </div>
                            
                            {isMyTurn && (
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all">
                                    Review
                                </button>
                            )}
                        </div>
                     </div>
                  );
               })}
            </div>
        )}
    </div>
  );
}
