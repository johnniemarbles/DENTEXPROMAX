
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../../packages/database/client';
import { LucideTrendingUp, LucideCreditCard, LucideArrowUpRight } from 'lucide-react';

export const FinanceVault: React.FC = () => {
  const [metrics, setMetrics] = useState({ totalVolume: 0, revenue: 0, orderCount: 0 });
  const db = createClient();

  useEffect(() => {
    db.getPlatformFinancials().then(setMetrics);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
       <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Finance Vault</h1>
            <p className="text-slate-500">Platform Revenue & Transaction Ledger</p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold text-slate-500 uppercase">Current Payout Cycle</div>
             <div className="text-emerald-500 font-mono">ACTIVE</div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* GMV */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <LucideTrendingUp size={64} className="text-white" />
             </div>
             <p className="text-slate-500 text-sm font-bold uppercase mb-2">Total Transaction Vol</p>
             <h2 className="text-4xl font-mono text-white mb-2">${metrics.totalVolume.toLocaleString()}</h2>
             <div className="flex items-center gap-2 text-xs text-emerald-500">
                <LucideArrowUpRight size={12} /> +12% vs last month
             </div>
          </div>

          {/* NET REVENUE */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <LucideCreditCard size={64} className="text-emerald-500" />
             </div>
             <p className="text-slate-500 text-sm font-bold uppercase mb-2">Net Platform Revenue (5%)</p>
             <h2 className="text-4xl font-mono text-emerald-500 mb-2">${metrics.revenue.toLocaleString()}</h2>
             <div className="flex items-center gap-2 text-xs text-slate-500">
                {metrics.orderCount} total transactions processed
             </div>
          </div>

          {/* PENDING PAYOUTS */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
             <p className="text-slate-500 text-sm font-bold uppercase mb-2">Pending Vendor Payouts</p>
             <h2 className="text-4xl font-mono text-slate-400 mb-2">$0.00</h2>
             <div className="flex items-center gap-2 text-xs text-slate-600">
                Next payout run: Friday 5PM EST
             </div>
          </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <h3 className="text-slate-500 font-bold mb-4">Detailed Ledger Access Restricted</h3>
          <p className="text-slate-600 max-w-lg mx-auto mb-6">
             For full transaction history, audit logs, and tax documents, please access the Stripe Connect Dashboard directly.
          </p>
          <button className="px-6 py-2 bg-[#635BFF] hover:bg-[#5851df] text-white font-bold rounded shadow-lg transition-colors">
             Open Stripe Dashboard
          </button>
       </div>
    </div>
  );
};
