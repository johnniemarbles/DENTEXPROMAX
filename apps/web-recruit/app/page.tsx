
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../packages/database/client';
import { Interview, Job } from '../../../packages/database/types';
import { LucideVideo, LucideCalendarClock, LucideUsers, LucideBriefcase } from 'lucide-react';

export const RecruitDashboard: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const db = createClient();

  useEffect(() => {
    // In a real app, we'd get the clinic ID from the user context
    const init = async () => {
        const myClinics = await db.getMyClinics();
        if (myClinics.length > 0) {
            const clinicId = myClinics[0].id;
            const ints = await db.getInterviewsForClinic(clinicId);
            const activeJobs = await db.getJobs(); // Simplified: fetching all active jobs
            setInterviews(ints);
            setJobs(activeJobs.filter(j => j.clinic_id === clinicId));
        }
    };
    init();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Talent Dashboard</h1>
            <p className="text-slate-500">Manage your hiring pipeline and scheduled interviews.</p>
          </div>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-lg shadow-cyan-900/20">
             + Post New Job
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><LucideBriefcase size={20} /></div>
                <span className="text-slate-400 font-bold uppercase text-xs">Active Roles</span>
             </div>
             <div className="text-3xl font-bold text-white">{jobs.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400"><LucideUsers size={20} /></div>
                <span className="text-slate-400 font-bold uppercase text-xs">Candidates</span>
             </div>
             <div className="text-3xl font-bold text-white">12</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><LucideVideo size={20} /></div>
                <span className="text-slate-400 font-bold uppercase text-xs">Upcoming Interviews</span>
             </div>
             <div className="text-3xl font-bold text-white">{interviews.length}</div>
          </div>
       </div>

       {/* Interviews Section */}
       <h3 className="text-xl font-bold text-white mb-4">Scheduled Video Interviews</h3>
       <div className="space-y-4">
          {interviews.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                  No interviews scheduled.
              </div>
          )}
          {interviews.map(int => (
             <div key={int.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400">
                      {int.candidate_name.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-bold text-white text-lg">{int.candidate_name}</h4>
                      <p className="text-cyan-400 text-sm flex items-center gap-2"><LucideBriefcase size={12} /> {int.job_title}</p>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <div className="text-white font-bold">{new Date(int.scheduled_at).toLocaleDateString()}</div>
                      <div className="text-slate-500 text-sm flex items-center gap-1 justify-end"><LucideCalendarClock size={12} /> {new Date(int.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                   </div>
                   
                   <a 
                     href={int.meeting_link} 
                     target="_blank" 
                     className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-900/20"
                   >
                      <LucideVideo size={16} /> Join Room
                   </a>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};