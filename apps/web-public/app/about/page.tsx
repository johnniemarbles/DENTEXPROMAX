
import React from 'react';
import { Button } from '../../../../packages/ui/src';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Connecting the Fragmented Dental Economy.</h1>
      
      <div className="prose prose-invert prose-lg text-slate-400 mb-12">
        <p>
          Dentistry is currently a siloed industry. Clinics use one software for scheduling, another for billing, and a third for supply ordering. 
          Patients struggle to find verified care with transparent pricing. Professionals rely on outdated job boards.
        </p>
        <p>
          <strong>DENTEX</strong> is the unified operating system that brings it all together. 
          We are building the digital infrastructure for the next generation of dental care.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h3 className="text-xl font-bold text-white mb-2">Interested in Enterprise?</h3>
            <p className="text-slate-400">Get a custom demo for your DSO or Multi-Location Practice.</p>
         </div>
         <Button 
           size="lg" 
           className="bg-white text-slate-950 hover:bg-slate-200"
           onClick={() => window.location.href = 'mailto:sales@dentistry.exchange'}
         >
           Contact Sales
         </Button>
      </div>
    </div>
  );
};
