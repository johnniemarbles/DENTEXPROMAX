'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, User, MoreHorizontal } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'blocked';
  status?: string;
  patientName?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick, onSlotClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startDate = getStartDate(currentDate);
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
  });

  const nextWeek = () => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
  };

  const prevWeek = () => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
  };

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[800px]">
       <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-bold text-white">
                {startDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
             </h2>
             <div className="flex bg-slate-800 rounded-lg p-1">
                <button onClick={prevWeek} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 text-xs font-bold text-slate-300 hover:text-white">Today</button>
                <button onClick={nextWeek} className="p-2 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
             </div>
          </div>
          <div className="flex gap-2">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-bold text-blue-400">Appointments</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full">
                <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-400">Blocked</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-8 border-b border-slate-800 bg-slate-950/50">
          <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-800 text-center pt-6">Time</div>
          {weekDates.map((date, i) => (
             <div key={i} className={`p-4 text-center border-r border-slate-800 last:border-r-0 ${isSameDay(date, new Date()) ? 'bg-blue-900/10' : ''}`}>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">{DAYS[i]}</p>
                <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full font-bold text-sm ${isSameDay(date, new Date()) ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-white'}`}>
                   {date.getDate()}
                </div>
             </div>
          ))}
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/30 relative">
          {HOURS.map(hour => (
             <div key={hour} className="grid grid-cols-8 min-h-[100px] border-b border-slate-800/50 group">
                <div className="p-3 text-xs font-bold text-slate-500 text-right border-r border-slate-800 bg-slate-900/20 sticky left-0">
                   {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                </div>
                {weekDates.map((date, dayIdx) => {
                   const slotEvents = events.filter(ev => 
                      isSameDay(ev.start, date) && ev.start.getHours() === hour
                   );
                   const handleSlotClick = () => {
                      const clickedDate = new Date(date);
                      clickedDate.setHours(hour);
                      onSlotClick(clickedDate);
                   };
                   return (
                      <div 
                        key={dayIdx} 
                        onClick={handleSlotClick}
                        className={`relative border-r border-slate-800/50 last:border-r-0 hover:bg-slate-800/20 transition-colors cursor-pointer ${isSameDay(date, new Date()) ? 'bg-blue-900/5' : ''}`}
                      >
                         {slotEvents.map(ev => (
                            <div 
                               key={ev.id}
                               onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                               className={`absolute inset-x-1 top-1 bottom-1 rounded-lg p-2 text-xs border shadow-lg hover:scale-[1.02] transition-transform cursor-pointer z-10 flex flex-col justify-between overflow-hidden
                                  ${ev.type === 'blocked' 
                                     ? 'bg-slate-800 border-slate-700 text-slate-400 opacity-80' 
                                     : 'bg-blue-600 border-blue-500 text-white shadow-blue-900/20'
                                  }
                               `}
                            >
                               <div className="flex justify-between items-start">
                                  <span className="font-bold truncate">{ev.title}</span>
                                  {ev.type === 'appointment' && <MoreHorizontal className="w-3 h-3 opacity-50" />}
                               </div>
                               {ev.patientName && (
                                  <div className="flex items-center gap-1 text-[10px] opacity-90">
                                     <User className="w-3 h-3" /> {ev.patientName}
                                  </div>
                               )}
                               <div className="flex items-center gap-1 text-[10px] opacity-75 font-mono mt-auto">
                                  <Clock className="w-3 h-3" /> 
                                  {ev.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </div>
                            </div>
                         ))}
                      </div>
                   );
                })}
             </div>
          ))}
       </div>
    </div>
  );
};