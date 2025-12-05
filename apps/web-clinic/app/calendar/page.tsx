'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { CalendarView, CalendarEvent } from '../../../../packages/ui/src';
import { LucideLoader2, LucideCalendarCheck } from 'lucide-react';

export const ClinicCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const db = createClient();

  useEffect(() => {
    fetchAppointments();
    const channel = db.channel('clinic-calendar').subscribe();
    return () => db.removeChannel(channel);
  }, []);

  async function fetchAppointments() {
    const user = db.getCurrentUser();
    if (!user) return;

    // Simulate getting the clinic ID from session
    const clinics = await db.getMyClinics();
    if (clinics.length === 0) return;
    const clinicId = clinics[0].id;

    const data = await db.getAppointmentsForClinic(clinicId);

    if (data) {
        const formattedEvents: CalendarEvent[] = data
            .filter((a: any) => a.status === 'confirmed' || a.status === 'checked_in')
            .map((appt: any) => {
                const start = new Date(appt.requested_time);
                const end = new Date(start.getTime() + 60 * 60 * 1000); // Assume 1 hour
                return {
                    id: appt.id,
                    title: appt.service_type,
                    start,
                    end,
                    type: 'appointment',
                    status: appt.status,
                    patientName: appt.patient_id ? `Patient ${appt.patient_id.split('-')[1]}` : 'Guest'
                };
        });
        setEvents(formattedEvents);
    }
    setLoading(false);
  }

  const handleEventClick = (event: CalendarEvent) => {
      alert(`Managing booking: ${event.title}\nPatient: ${event.patientName}`);
  };

  const handleSlotClick = (date: Date) => {
      if(confirm(`Block this slot? ${date.toLocaleString()}`)) {
         // In real app, call db.createBlock()
         alert("Slot blocked (Mock)");
      }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LucideLoader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <LucideCalendarCheck className="text-emerald-500" /> Schedule
             </h1>
             <p className="text-slate-400">Manage chair time and patient flow.</p>
          </div>
       </div>
       <div className="flex-1">
          <CalendarView 
             events={events} 
             onEventClick={handleEventClick} 
             onSlotClick={handleSlotClick}
          />
       </div>
    </div>
  );
}