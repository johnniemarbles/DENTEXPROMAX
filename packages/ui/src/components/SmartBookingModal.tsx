
'use client'; 

import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, CheckCircle, ChevronRight, ChevronLeft, MapPin, User, Info, Send, Trash2, ShieldAlert, Sparkles, AlertCircle, Plus, Users } from 'lucide-react';
import { createClient } from '../../../database/client';
import { FamilyMember } from '../../../database/types';

export type BookingMode = 'new' | 'reschedule' | 'proposal';

export interface Slot {
  day: number;
  time: string;
  month: string;
}

interface SmartBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: {
    id: string;
    name: string;
    address?: string;
    image_url?: string;
    rating?: number;
  } | null;
  onConfirm: (bookingData: any) => void;
  user?: any;
  mode?: BookingMode;
  initialDate?: string;
  isIntervention?: boolean;
  initialFamilyMemberId?: string;
}

const TIME_SLOTS = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM'],
  Afternoon: ['01:00 PM', '01:30 PM', '02:30 PM', '04:00 PM'],
  Evening: ['05:30 PM', '06:30 PM']
};

const MOCK_PROVIDERS = [
  { id: 'p1', name: 'Dr. Sarah Smith', role: 'Lead Dentist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', name: 'James Wilson', role: 'Hygienist', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', name: 'Dr. Emily Chen', role: 'Orthodontist', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
];

export const SmartBookingModal: React.FC<SmartBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  clinic, 
  onConfirm, 
  user,
  mode = 'new',
  initialDate,
  isIntervention = false,
  initialFamilyMemberId
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); 
  const [currentMonth, setCurrentMonth] = useState('November 2024');
  const [viewingDay, setViewingDay] = useState<number | null>(null);
  const [pickedSlots, setPickedSlots] = useState<Slot[]>([]);
  
  // Patient & Family State
  const [patientMode, setPatientMode] = useState<'self' | 'dependent'>('self');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ first_name: '', last_name: '', relationship: 'Child' as any, date_of_birth: '' });
  
  const [details, setDetails] = useState({ name: user?.full_name || 'Jane Doe', phone: '555-0123' });
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [flowType, setFlowType] = useState<'provider_first' | 'date_first'>('provider_first');
  const [showBackupHint, setShowBackupHint] = useState(false);

  const db = createClient();
  const MAX_SLOTS = mode === 'proposal' ? 3 : 2; 

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setViewingDay(null);
      setPickedSlots([]);
      setSelectedProvider(null);
      setShowBackupHint(false);
      
      // Initialize Context from Widget
      if (initialFamilyMemberId && initialFamilyMemberId !== 'ME') {
          setPatientMode('dependent');
          setSelectedMemberId(initialFamilyMemberId);
      } else {
          setPatientMode('self');
          setSelectedMemberId('');
      }

      if (user) {
          db.getFamilyMembers(user.id).then(setFamilyMembers);
      }
    }
  }, [isOpen, user, mode, initialFamilyMemberId]);

  if (!isOpen || !clinic) return null;

  const handleProviderSelect = (provider: any) => { setSelectedProvider(provider); setStep(2); };
  const handleDateClick = (day: number) => { setViewingDay(day); setStep(3); };

  const toggleSlot = (time: string) => {
    if (!viewingDay) return;
    const existingIndex = pickedSlots.findIndex(s => s.day === viewingDay && s.time === time);
    
    if (existingIndex >= 0) {
      setPickedSlots(prev => prev.filter((_, i) => i !== existingIndex));
      setShowBackupHint(false); 
    } else if (pickedSlots.length < MAX_SLOTS) {
      const newSlots = [...pickedSlots, { day: viewingDay, time, month: currentMonth }];
      setPickedSlots(newSlots);
      if (newSlots.length === 1 && mode !== 'proposal') {
         setShowBackupHint(true);
         setTimeout(() => setShowBackupHint(false), 4000);
      } else {
         setShowBackupHint(false); 
      }
    }
  };

  const handleConfirm = async () => {
    let finalPatientName = details.name;
    let finalMemberId = null;

    if (patientMode === 'dependent') {
        if (isAddingMember) {
            const created = await db.createFamilyMember({
                guardian_id: user.id,
                first_name: newMember.first_name,
                last_name: newMember.last_name || user.full_name.split(' ').pop(),
                date_of_birth: newMember.date_of_birth || '2020-01-01',
                relationship: newMember.relationship,
                gender: 'Unknown'
            });
            finalMemberId = created.id;
            finalPatientName = `${created.first_name} ${created.last_name}`;
        } else if (selectedMemberId) {
            const member = familyMembers.find(m => m.id === selectedMemberId);
            if (member) {
                finalMemberId = member.id;
                finalPatientName = `${member.first_name} ${member.last_name}`;
            }
        }
    }

    const sorted = [...pickedSlots].sort((a, b) => a.day - b.day);
    const formattedSlots = sorted.map(s => ({
        date: `2024-11-${s.day.toString().padStart(2, '0')}`,
        time: s.time
    }));

    onConfirm({
      slots: formattedSlots,
      primarySlot: formattedSlots[0],
      provider_id: selectedProvider?.id,
      provider_name: selectedProvider ? selectedProvider.name : 'First Available',
      patient: { ...details, name: finalPatientName },
      family_member_id: finalMemberId,
      mode
    });
    
    setTimeout(() => {
        onClose();
        setStep(1);
        setPickedSlots([]);
        setIsAddingMember(false);
    }, 300);
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl border overflow-hidden flex flex-col md:flex-row h-[650px] max-h-[90vh] transition-all
        ${isIntervention ? 'border-orange-500/30 bg-slate-900/90' : 'border-white/10 bg-slate-900/80 backdrop-blur-xl'}`}>
        
        {/* LEFT SIDE: Context Panel */}
        <div className="hidden md:flex w-80 p-6 flex-col relative border-r border-white/5 bg-white/5 backdrop-blur-sm">
           <div className="mb-6">
             <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{clinic.name}</h2>
             {isIntervention && <span className="bg-orange-500 text-black px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">Admin Override</span>}
             {clinic.address && <div className="flex items-center gap-2 text-slate-400 text-xs"><MapPin className="w-3 h-3" /> <span className="truncate">{clinic.address}</span></div>}
           </div>

           <div className="space-y-4">
              <div className={`p-4 rounded-xl border transition-all ${selectedProvider ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-800/50 border-white/5'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Provider</span>
                    {step > 1 && <button onClick={() => setStep(1)} className="text-[10px] text-blue-400 hover:text-white">Change</button>}
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                       {selectedProvider?.avatar ? <img src={selectedProvider.avatar} className="w-full h-full object-cover"/> : <User className="w-4 h-4 text-slate-400"/>}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">{selectedProvider ? selectedProvider.name : "Any Available"}</p>
                       <p className="text-[10px] text-slate-400">{selectedProvider ? selectedProvider.role : "Fastest Service"}</p>
                    </div>
                 </div>
              </div>

              {/* Enhanced Slots Basket */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex-1 flex flex-col">
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Selection</span>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-white">{pickedSlots.length}/{MAX_SLOTS}</span>
                 </div>
                 
                 {pickedSlots.length === 0 ? (
                    <div className="text-center py-4 border-2 border-dashed border-slate-700/50 rounded-lg mb-2">
                       <Clock className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                       <span className="text-[10px] text-slate-500">Pick {mode === 'proposal' ? '3 options' : 'a time'}</span>
                    </div>
                 ) : (
                    <div className="space-y-2 mb-2">
                       {pickedSlots.map((slot, i) => (
                          <div key={i} className={`flex items-center justify-between border p-2 rounded-lg group animate-in slide-in-from-left-2 ${i === 0 ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-blue-500/20 border-blue-500/50'}`}>
                             <div className="flex items-center gap-2">
                                <div className={`rounded p-1 ${i === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}><CalendarIcon className="w-3 h-3 text-white" /></div>
                                <div>
                                   <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-white">{slot.month} {slot.day}</p>
                                      {i === 0 && <span className="text-[8px] font-bold bg-emerald-500 text-black px-1 rounded uppercase">Primary</span>}
                                      {i > 0 && <span className="text-[8px] font-bold bg-blue-500 text-white px-1 rounded uppercase">Backup</span>}
                                   </div>
                                   <p className="text-[10px] text-slate-300">{slot.time}</p>
                                </div>
                             </div>
                             <button onClick={() => setPickedSlots(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-400 p-1"><X className="w-3 h-3" /></button>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* RIGHT SIDE: Interactive Wizard */}
        <div className="flex-1 flex flex-col h-full relative bg-slate-950/50">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
             <div className="flex gap-4">
                <button onClick={() => setFlowType('provider_first')} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${flowType === 'provider_first' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>By Provider</button>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
             
             {/* STEP 1: CHOOSE PROVIDER */}
             {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h3 className="text-2xl font-bold text-white mb-2">Who would you like to see?</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <button onClick={() => handleProviderSelect(null)} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all group text-left">
                         <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Clock className="w-6 h-6 text-blue-400" /></div>
                         <div><h4 className="font-bold text-white text-lg">First Available</h4><p className="text-xs text-slate-400">Earliest slot.</p></div>
                      </button>
                      {MOCK_PROVIDERS.map(prov => (
                         <button key={prov.id} onClick={() => handleProviderSelect(prov)} className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-slate-800 hover:border-white/20 transition-all group text-left">
                            <img src={prov.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-white transition-colors" />
                            <div><h4 className="font-bold text-white text-lg">{prov.name}</h4><p className="text-xs text-slate-400">{prov.role}</p></div>
                         </button>
                      ))}
                   </div>
                </div>
             )}

             {/* STEP 2: DATE SELECTOR */}
             {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center justify-between mb-6">
                      <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
                      <div className="flex items-center gap-4 bg-black/20 p-1 rounded-lg">
                         <button className="p-2 hover:bg-white/10 rounded-md text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4"/></button>
                         <span className="font-bold text-white w-32 text-center">{currentMonth}</span>
                         <button className="p-2 hover:bg-white/10 rounded-md text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4"/></button>
                      </div>
                   </div>
                   <div className="grid grid-cols-7 gap-3">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="text-center text-xs font-bold text-slate-500 uppercase py-2">{d}</div>)}
                      <div className="col-span-2"></div>
                      {days.map(day => (
                         <button key={day} onClick={() => handleDateClick(day)} disabled={day < 12} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all relative group ${day === viewingDay ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' : day < 12 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5'}`}>{day}</button>
                      ))}
                   </div>
                </div>
             )}

             {/* STEP 3: TIME SLOTS */}
             {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-2 mb-4">
                      <button onClick={() => setStep(2)} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
                      <h3 className="text-xl font-bold text-white ml-auto">Availability for {viewingDay}th</h3>
                   </div>
                   
                   <div className="space-y-6">
                      {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                         <div key={period}>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Clock className="w-3 h-3" /> {period}</h4>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                               {slots.map(time => {
                                  const isSelected = pickedSlots.some(s => s.day === viewingDay && s.time === time);
                                  return (<button key={time} onClick={() => toggleSlot(time)} className={`py-3 rounded-xl text-sm font-bold border transition-all ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'}`}>{time}</button>)
                               })}
                            </div>
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-8 flex justify-end">
                      <button onClick={() => setStep(4)} disabled={pickedSlots.length === 0} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                         Continue ({pickedSlots.length})
                      </button>
                   </div>
                </div>
             )}

             {/* STEP 4: CONFIRMATION & FAMILY SELECTOR */}
             {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-md mx-auto">
                   <h3 className="text-2xl font-bold text-white mb-6">{isIntervention ? 'Send Proposal' : 'Finalize Booking'}</h3>
                   
                   {/* PATIENT SELECTOR */}
                   <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                         <label className="text-xs font-bold text-slate-400 uppercase">Who is this for?</label>
                         {patientMode === 'dependent' && !isAddingMember && (
                             <button onClick={() => setIsAddingMember(true)} className="text-xs text-blue-400 hover:text-white flex items-center gap-1">
                                <Plus size={12} /> Add New
                             </button>
                         )}
                      </div>
                      
                      {isAddingMember ? (
                          <div className="space-y-3 bg-black/20 p-3 rounded-lg border border-white/10 animate-in slide-in-from-top-2">
                              <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-white">New Family Member</span>
                                  <button onClick={() => setIsAddingMember(false)} className="text-slate-500 hover:text-white"><X size={12}/></button>
                              </div>
                              <input placeholder="First Name" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" value={newMember.first_name} onChange={e => setNewMember({...newMember, first_name: e.target.value})} />
                              <select className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white" value={newMember.relationship} onChange={e => setNewMember({...newMember, relationship: e.target.value as any})}>
                                  <option value="Child">Child</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Parent">Parent</option>
                              </select>
                          </div>
                      ) : (
                          <div className="space-y-2">
                              <button 
                                onClick={() => { setPatientMode('self'); setSelectedMemberId(''); }}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${patientMode === 'self' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                              >
                                  <User size={16} />
                                  <span className="text-sm font-medium">Myself ({details.name})</span>
                                  {patientMode === 'self' && <CheckCircle size={16} className="ml-auto text-blue-500" />}
                              </button>
                              
                              {familyMembers.map(member => (
                                  <button 
                                    key={member.id}
                                    onClick={() => { setPatientMode('dependent'); setSelectedMemberId(member.id); }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedMemberId === member.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                                  >
                                      <Users size={16} />
                                      <div className="text-left">
                                          <div className="text-sm font-medium">{member.first_name} {member.last_name}</div>
                                          <div className="text-left text-[10px] text-slate-500 uppercase">{member.relationship}</div>
                                      </div>
                                      {selectedMemberId === member.id && <CheckCircle size={16} className="ml-auto text-blue-500" />}
                                  </button>
                              ))}

                              {familyMembers.length === 0 && (
                                  <button onClick={() => { setPatientMode('dependent'); setIsAddingMember(true); }} className="w-full py-2 text-xs text-slate-500 hover:text-white border border-dashed border-slate-700 rounded-lg hover:border-slate-500">
                                      + Add Child or Dependent
                                  </button>
                              )}
                          </div>
                      )}
                   </div>

                   <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 mb-6">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Phone</label>
                          <input type="text" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                      </div>
                   </div>
                   
                   <button onClick={handleConfirm} disabled={patientMode === 'dependent' && !selectedMemberId && !isAddingMember} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                     <CheckCircle className="w-5 h-5" />
                     {isIntervention ? 'Send Proposal' : (isAddingMember ? 'Save & Confirm' : 'Confirm Appointment')}
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};