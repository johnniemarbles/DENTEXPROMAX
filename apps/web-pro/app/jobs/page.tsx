
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { Job } from '../../../../packages/database/types';
import { Button } from '../../../../packages/ui/src';
import { LucideSearch, LucideMapPin, LucideDollarSign, LucideBriefcase } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const db = createClient();

  useEffect(() => {
    db.getJobs().then(setJobs);
  }, []);

  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
       <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Board</h1>
          <p className="text-slate-500">Find your next full-time role or pick up extra shifts.</p>
       </div>

       <div className="relative mb-8">
          <LucideSearch className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search for roles (e.g. Hygienist, Assistant)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-violet-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map(job => (
             <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-violet-700 transition-colors">{job.title}</h3>
                      <div className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                         <LucideBriefcase size={14} /> {job.clinic_name}
                      </div>
                   </div>
                   <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold uppercase">
                      {job.type}
                   </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                   {job.description}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium">
                   <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <LucideDollarSign size={14} /> {job.salary_range}
                   </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                   <Button size="sm" variant="outline" className="w-full">View Details</Button>
                </div>
             </div>
          ))}
          
          {filteredJobs.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400">
                No jobs found matching your criteria.
             </div>
          )}
       </div>
    </div>
  );
};
