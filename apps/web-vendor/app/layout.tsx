
import React, { useEffect, useState } from 'react';
import { Profile, Vendor } from '../../../packages/database/types';
import { createClient } from '../../../packages/database/client';
import { Header, Footer } from '../../../packages/ui/src';
import { LucideLayoutDashboard, LucidePackage, LucideTruck, LucideSettings, LucideLoader2 } from 'lucide-react';

interface VendorLayoutProps {
  user: Profile | null;
  children: (vendor: Vendor) => React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const VendorLayout: React.FC<VendorLayoutProps> = ({ user, children, onNavigate, currentPath }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const db = createClient();

  useEffect(() => {
    const fetchVendor = async () => {
        if (!user) return;
        const v = await db.getVendorForUser(user.id);
        setVendor(v);
        setLoading(false);
    };
    fetchVendor();
  }, [user]);

  const navItems = [
    { id: '/', label: 'Dashboard', icon: LucideLayoutDashboard },
    { id: '/products', label: 'My Products', icon: LucidePackage },
    { id: '/orders', label: 'Orders', icon: LucideTruck },
    { id: '/settings', label: 'Settings', icon: LucideSettings },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-orange-500"><LucideLoader2 className="animate-spin mr-2" /> Loading Vendor Portal...</div>;

  if (!user || !vendor) {
    return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold">Vendor Access Denied</h1>
            <p className="text-slate-400 mb-4">You do not have a registered Vendor account.</p>
            <button onClick={() => window.location.hash = 'auth'} className="text-orange-500 underline">Sign In</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      <Header 
        appName="VENDOR PORTAL" 
        user={user} 
        onLogout={() => window.location.reload()}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-800">
             <div className="font-bold text-white truncate text-lg">{vendor.name}</div>
             <div className="text-xs text-orange-500 font-mono mt-1">SUPPLIER CONSOLE</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPath === item.id 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-slate-950 relative">
           {children(vendor)}
        </main>
      </div>
      <Footer currentApp="web-vendor" tenantId={vendor.id} userRole={user.global_role} />
    </div>
  );
};
