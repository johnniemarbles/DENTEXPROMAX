
'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { FamilyMember } from '../../../../packages/database/types';
import { Button, Input } from '../../../../packages/ui/src';
import { LucideUsers, LucidePlus, LucideTrash2, LucideBaby, LucideHeart, LucideUser, LucideArrowLeft } from 'lucide-react';

interface FamilyPageProps {
    onNavigate: (path: string) => void;
}

export const FamilyPage: React.FC<FamilyPageProps> = ({ onNavigate }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    relationship: 'Child'
  });

  const db = createClient();

  useEffect(() => {
    fetchFamily();
  }, []);

  async function fetchFamily() {
    const user = db.getCurrentUser();
    if (!user) return; 

    const data = await db.getFamilyMembers(user.id);
    
    if (data) setMembers(data);
    setLoading(false);
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    const user = db.getCurrentUser();
    if (!user) return;

    await db.createFamilyMember({
        guardian_id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        relationship: formData.relationship as any,
        gender: 'Unknown'
    });

    setIsAdding(false);
    setFormData({ first_name: '', last_name: '', date_of_birth: '', relationship: 'Child' });
    fetchFamily(); // Refresh list
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    
    // Call DB delete
    await db.deleteFamilyMember(id);
    // Refresh list
    fetchFamily();
  }

  const getIcon = (rel: string) => {
      switch(rel) {
          case 'Child': return <LucideBaby className="w-5 h-5 text-blue-400" />;
          case 'Spouse': return <LucideHeart className="w-5 h-5 text-red-400" />;
          default: return <LucideUser className="w-5 h-5 text-slate-400" />;
      }
  };

  return (
    <div className="text-white max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
             <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <LucideUsers className="w-8 h-8 text-blue-500" /> My Family
                </h1>
                <p className="text-slate-400 mt-2">Manage dependents for faster booking.</p>
             </div>
          </div>

          {/* List */}
          <div className="space-y-4 mb-8">
             {members.length === 0 && !loading && (
                 <div className="p-8 text-center border border-slate-800 border-dashed rounded-2xl text-slate-500">
                     No family members added yet.
                 </div>
             )}
             
             {members.map(member => (
                 <div key={member.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                            {getIcon(member.relationship)}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{member.first_name} {member.last_name}</h3>
                            <p className="text-xs text-slate-400 uppercase tracking-wider">{member.relationship} • {member.date_of_birth}</p>
                        </div>
                    </div>
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                        <LucideTrash2 className="w-4 h-4" />
                    </button>
                 </div>
             ))}
          </div>

          {/* Add Form */}
          {isAdding ? (
              <form onSubmit={handleAddMember} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white">Add New Member</h3>
                      <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">First Name</label>
                          <Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required className="bg-slate-950 border-slate-700 text-white" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Last Name</label>
                          <Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required className="bg-slate-950 border-slate-700 text-white" />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date of Birth</label>
                          <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none" 
                              value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} required />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Relationship</label>
                          <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                              value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})}>
                              <option>Child</option>
                              <option>Spouse</option>
                              <option>Parent</option>
                              <option>Other</option>
                          </select>
                      </div>
                  </div>

                  <Button type="submit" className="w-full">Save Family Member</Button>
              </form>
          ) : (
              <button onClick={() => setIsAdding(true)} className="w-full py-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 font-bold">
                  <LucidePlus className="w-5 h-5" /> Add Family Member
              </button>
          )}

    </div>
  );
}