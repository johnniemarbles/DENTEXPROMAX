'use client';

import React, { useState, useEffect } from 'react';
import { LucideCalendar, LucideLock, LucideChevronDown, LucideSparkles, LucideCheckCircle, LucideUsers, LucideLogIn } from 'lucide-react';
import { SmartBookingModal } from './SmartBookingModal';
import { createClient } from '../../../database/client';
import { Clinic, Profile, FamilyMember } from '../../../database/types';

// Static Data
const POPULAR_SERVICES = [
    { id: 'checkup', label: 'Checkup & Clean', icon: '✨' },
    { id: 'emergency', label: 'Emergency / Pain', icon: '🚨' },
    { id: 'whitening', label: 'Whitening', icon: '💎' },
    { id: 'consult', label: 'Free Consult', icon: '📋' },
];

const SPECIALIST_SERVICES = [
    'Root Canal Therapy', 'Wisdom Tooth Extraction', 'Dental Implants',
    'Invisalign Assessment', 'Veneers / Cosmetic', 'Child Dentistry (Pediatric)', 'Denture Repair'
];

const AI_SUGGESTIONS = [
    "I have severe tooth pain.", "My gums are bleeding.", "I chipped a tooth.", "I need a second opinion."
];

// KEY INNOVATION: Persistence Key
const STORAGE_KEY = 'dentex_pending_service';

interface BookingWidgetProps {
    clinic: Clinic;
    user: Profile | null;
    currentPath?: string;
    initialOpen?: boolean;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ clinic, user, currentPath = '', initialOpen = false }) => {
    const [selectedService, setSelectedService] = useState<string>('');
    const [message, setMessage] = useState('');
    const [isAiActive, setIsAiActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true);
    
    // Family Booking State
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string>('ME');
    
    const db = createClient();

    // 1. MEMORY RESTORE: Check for pending service selection on mount
    useEffect(() => {
        const savedService = sessionStorage.getItem(STORAGE_KEY);
        if (savedService) {
            console.log("[BookingWidget] Restoring pending service:", savedService);
            setSelectedService(savedService);
        }
        setIsRestoring(false);
    }, []);

    // Fetch Family Members and handle Initial Open
    useEffect(() => {
        if (user) {
            db.getFamilyMembers(user.id).then((members: FamilyMember[]) => {
                setFamilyMembers(members);
            });
        }
        
        // If initialOpen is true (e.g. from redirect), and we have a user, open the modal
        // Also check if we just restored a service, if so, we might want to open modal?
        // Actually, initialOpen is passed from the parent based on URL param.
        if (initialOpen && user) {
            setIsModalOpen(true);
        }
    }, [user, initialOpen]);

    const handleBookingAction = () => {
        // STRICT VALIDATION
        if (!selectedService) return;

        if (!user) {
            // GUEST FLOW: 
            // 1. Save State to Memory (Survives Redirect)
            sessionStorage.setItem(STORAGE_KEY, selectedService);

            // 2. Redirect to Login with Callback AND openBooking param
            // currentPath is e.g. "/clinic/yorkville"
            const cleanPath = currentPath.startsWith('/') ? currentPath.substring(1) : currentPath;
            
            // Construct the full hash path for the Patient App, including the query param
            const destination = `patient/${cleanPath}?openBooking=true`;
            
            const callbackUrl = encodeURIComponent(destination);
            window.location.hash = `auth?callbackUrl=${callbackUrl}`;
            return;
        }
        
        // AUTHENTICATED FLOW:
        // 1. Clear Memory (State consumed)
        sessionStorage.removeItem(STORAGE_KEY);

        // 2. Open Modal
        setIsModalOpen(true);
    };

    const addAiTag = (text: string) => {
        setMessage(prev => prev ? `${prev} ${text}` : text);
        setIsAiActive(true);
        setTimeout(() => setIsAiActive(false), 800);
    };

    const handleBookingConfirm = async (bookingData: any) => {
        if (!clinic || !user) return;

        try {
            // Robust Date Construction for ISO format
            const rawDate = bookingData.slots[0].date; 
            const rawTime = bookingData.slots[0].time; 
            
            let timestamp: string;
            
            // Convert 12h to 24h for ISO if needed
            if (rawTime.includes('M')) {
                 const [time, modifier] = rawTime.split(' ');
                 let [hours, minutes] = time.split(':');
                 if (hours === '12') hours = '00';
                 if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
                 timestamp = new Date(`${rawDate}T${hours}:${minutes}:00`).toISOString();
            } else {
                 timestamp = new Date(`${rawDate} ${rawTime}`).toISOString();
            }

            const payload = {
                clinic_id: clinic.id,
                patient_id: user.id,
                family_member_id: bookingData.family_member_id || null,
                status: 'pending',
                requested_time: timestamp,
                service_type: selectedService || 'General Checkup',
                notes: `User Note: ${message} -- Provider: ${bookingData.provider_name}. Patient: ${bookingData.patient.name}`,
                proposed_slots: bookingData.slots
            };

            await db.createAppointment(payload as any);

            setIsModalOpen(false);
            setBookingSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: any) {
            alert('Application Error: ' + err.message);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center animate-in zoom-in shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] -z-10"></div>
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40">
                    <LucideCheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                    The clinic has received your request. We've sent a confirmation email to you.
                </p>
                <button 
                    onClick={() => { setBookingSuccess(false); setMessage(''); setSelectedService(''); setSelectedMemberId('ME'); }}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all"
                >
                    Book Another
                </button>
            </div>
        );
    }

    if (isRestoring) return <div className="p-8 text-center text-slate-500">Initializing...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            
            {/* Context Selector: Who is this for? */}
            {user && (
                <div className="mb-6 border-b border-slate-800 pb-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 flex items-center gap-2">
                        <LucideUsers size={12} /> Booking For
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedMemberId}
                            onChange={(e) => setSelectedMemberId(e.target.value)}
                            className="w-full appearance-none bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-medium cursor-pointer hover:bg-slate-900"
                        >
                            <option value="ME">Myself ({user.full_name})</option>
                            {familyMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.first_name} {member.last_name} ({member.relationship})
                                </option>
                            ))}
                        </select>
                        <LucideChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Book Visit</h3>
                {selectedService && <span className="text-[10px] bg-blue-600 px-2 py-1 rounded text-white font-bold animate-in fade-in">STEP 1 DONE</span>}
            </div>
            
            {/* Service Selection Grid */}
            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Reason for Visit</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
                {POPULAR_SERVICES.map(svc => (
                    <button 
                        key={svc.id}
                        onClick={() => setSelectedService(svc.label)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                            selectedService === svc.label 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                        }`}
                    >
                        <div className="text-lg mb-1">{svc.icon}</div>
                        <div className="text-xs font-bold">{svc.label}</div>
                    </button>
                ))}
            </div>

            {/* Dropdown */}
            <div className="relative mb-6">
                <select 
                    value={SPECIALIST_SERVICES.includes(selectedService) ? selectedService : ''}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer hover:bg-slate-900"
                >
                    <option value="" disabled>Select other procedure...</option>
                    {SPECIALIST_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <LucideChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>

            {/* AI Assist */}
            <div className={`mb-6 transition-all duration-300 ${isAiActive ? 'ring-2 ring-blue-500/50 rounded-xl' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Tell us more (Optional)</label>
                    <div className="flex items-center gap-1 text-[10px] text-blue-400">
                        <LucideSparkles className="w-3 h-3" /> AI Assist
                    </div>
                </div>
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your symptoms..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[80px] mb-3"
                />
                <div className="flex flex-wrap gap-2">
                    {AI_SUGGESTIONS.map(tag => (
                        <button 
                            key={tag}
                            onClick={() => addAiTag(tag)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 rounded-md border border-slate-700 transition-colors"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Action Button */}
            <button 
                onClick={handleBookingAction}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    selectedService 
                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white shadow-blue-900/20' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
                disabled={!selectedService}
            >
                {user ? <LucideCalendar className="w-5 h-5" /> : <LucideLogIn className="w-5 h-5" />}
                {!selectedService 
                    ? 'Select a Service' 
                    : user 
                        ? 'Choose Time & Provider' 
                        : 'Login to Continue Booking'
                }
            </button>

            <SmartBookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clinic={clinic}
                user={user}
                onConfirm={handleBookingConfirm}
                initialFamilyMemberId={selectedMemberId}
            />
        </div>
    );
};