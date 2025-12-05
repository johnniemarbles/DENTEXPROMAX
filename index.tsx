
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { db } from './packages/database/client';
import { Profile } from './packages/database/types';
import { Header, Footer, DebugSessionBar } from './packages/ui/src';
import { LoginPage } from './apps/web-auth/app/login/page';
import { ClinicMiddleware } from './apps/web-clinic/middleware';
import { ClinicLayout } from './apps/web-clinic/app/layout';
import { ClinicDashboard } from './apps/web-clinic/app/page';
import { ClinicCalendarPage } from './apps/web-clinic/app/calendar/page';
import { PatientsPage } from './apps/web-clinic/app/patients/page';
import { PatientLayout } from './apps/web-patient/app/layout';
import { PatientDirectory } from './apps/web-patient/app/page';
import { PatientDashboard } from './apps/web-patient/app/dashboard/page';
import { PatientDashboardLayout } from './apps/web-patient/app/dashboard/layout';
import { PatientSettings } from './apps/web-patient/app/settings/page';
import { ClinicProfile } from './apps/web-patient/app/clinic/[slug]/page';
import { AppointmentPage } from './apps/web-patient/app/clinic/[slug]/appointment/page';
import { BookingSuccess } from './apps/web-patient/app/booking/success/page';
import { FamilyPage } from './apps/web-patient/app/family/page';
import { ProLayout } from './apps/web-pro/app/layout';
import { ProDashboard } from './apps/web-pro/app/page';
import { PassportPage } from './apps/web-pro/app/passport/page';
import { JobsPage } from './apps/web-pro/app/jobs/page';
import { VendorLayout } from './apps/web-vendor/app/layout';
import { VendorDashboard } from './apps/web-vendor/app/page';
import { ProductsPage } from './apps/web-vendor/app/products/page';
import { OrdersPage } from './apps/web-vendor/app/orders/page';
import { CrmMiddleware } from './apps/web-crm/middleware';
import { CrmLayout } from './apps/web-crm/app/layout';
import { CrmHarvester } from './apps/web-crm/app/page';
import { CrmLeads } from './apps/web-crm/app/leads/page';
import { AdminMiddleware } from './apps/web-admin/middleware';
import { AdminLayout } from './apps/web-admin/app/layout';
import { UserManager } from './apps/web-admin/app/users/page';
import { FinanceVault } from './apps/web-admin/app/finance/page';
import { OperationalVaultPage } from './apps/web-admin/app/vault/page';
import { PublicLayout } from './apps/web-public/app/layout';
import { PublicHome } from './apps/web-public/app/page';
import { AboutPage } from './apps/web-public/app/about/page';
import { RecruitMiddleware } from './apps/web-recruit/middleware';
import { RecruitLayout } from './apps/web-recruit/app/layout';
import { RecruitDashboard } from './apps/web-recruit/app/page';
import { LucideLoader2 } from 'lucide-react';

// --- ROUTING HELPERS ---

// Helper: Parse the current hash into { subdomain, path, params }
const parseHash = () => {
    const hash = window.location.hash.replace('#', '');
    
    // Default to Public
    if (!hash) return { subdomain: 'public', path: '/' };

    // Define known apps
    const apps = ['patient', 'clinic', 'recruit', 'auth', 'pro', 'vendor', 'crm', 'admin'];
    
    // Check if hash starts with an app name
    for (const app of apps) {
        // Match exact "app", "app/", or "app?" (for query params like auth?callback=...)
        if (hash === app || hash.startsWith(app + '/') || hash.startsWith(app + '?')) {
            const path = hash.replace(app, '') || '/';
            // Normalize path to always ensure it starts with / if not empty
            const normalizedPath = path.startsWith('/') || path.startsWith('?') || path === '' ? path : `/${path}`;
            return { subdomain: app, path: normalizedPath || '/' };
        }
    }

    // Fallback to public for unknown routes
    return { subdomain: 'public', path: '/' };
};

// --- ERROR BOUNDARY ---
interface ErrorBoundaryProps {
    children?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = { hasError: false };

    constructor(props: ErrorBoundaryProps) { 
        super(props); 
    }
    
    static getDerivedStateFromError() { return { hasError: true }; }
    
    componentDidCatch(error: any) { console.error("App Crash:", error); }
    
    render() {
        if (this.state.hasError) return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-950">
             <h2 className="text-xl font-bold text-white mb-2">System Malfunction</h2>
             <p className="mb-4">The application encountered a critical error.</p>
             <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">Reboot System</button>
          </div>
        );
        return this.props.children;
    }
}

// --- SUBDOMAIN COMPONENTS ---

const PublicApp = ({ currentPath }: { currentPath: string }) => {
  const navigate = (p: string) => { window.location.hash = `public${p}`; };
  
  if (currentPath === '/' || currentPath === '') return <PublicLayout onNavigate={navigate}><PublicHome /></PublicLayout>;
  if (currentPath === '/about') return <PublicLayout onNavigate={navigate}><AboutPage /></PublicLayout>;
  
  return <div>404 Public Route</div>;
};

const PatientApp = ({ user, currentPath }: { user: Profile | null, currentPath: string }) => {
  const navigate = (path: string, params?: any) => { 
      // Ensure we don't double slash
      let cleanPath = path.startsWith('/') ? path : `/${path}`;
      
      // Append Params if they exist (handling the openBooking case)
      if (params && params.openBooking) {
          cleanPath += cleanPath.includes('?') ? '&openBooking=true' : '?openBooking=true';
      }
      
      window.location.hash = `patient${cleanPath}`; 
  };

  // 1. PUBLIC ROUTES
  if (currentPath === '/' || currentPath === '') return <PatientLayout user={user}><PatientDirectory user={user} onNavigate={navigate} /></PatientLayout>;

  // 2. SHARED ROUTES (Clinic Profile)
  if (currentPath.startsWith('/clinic/')) {
      const parts = currentPath.split('/');
      const rawSlug = parts[2] || '';
      const subPage = parts[3];
      const [slug, queryString] = rawSlug.split('?');

      if (subPage === 'appointment') {
           return <PatientLayout user={user}><AppointmentPage slug={slug} onNavigate={navigate} /></PatientLayout>;
      }

      // Check query param from URL hash string manually since we don't have full router
      const shouldOpenBooking = currentPath.includes('openBooking=true');

      return (
          <PatientLayout user={user}>
            <ClinicProfile 
                slug={slug} 
                user={user} 
                initialBookingState={shouldOpenBooking} 
                onNavigate={navigate} 
            />
          </PatientLayout>
      );
  }
  
  // 3. AUTH & RBAC
  if (!user) {
      setTimeout(() => window.location.hash = `auth?callbackUrl=${encodeURIComponent('patient' + currentPath)}`, 0);
      return <div className="p-12 text-center text-slate-500">Redirecting to Login...</div>;
  }

  // Block Pros from Patient Dashboard (Bounce to Pro)
  if (user.global_role === 'pro_candidate' || user.global_role === 'pro') {
      setTimeout(() => window.location.hash = 'pro', 0);
      return null;
  }

  // 4. PRIVATE ROUTES
  let content = null;
  if (currentPath === '/dashboard') content = <PatientDashboard onNavigate={navigate} />;
  if (currentPath === '/family') content = <FamilyPage onNavigate={navigate} />;
  if (currentPath === '/settings') content = <PatientSettings />;
  if (currentPath === '/booking/success') content = <BookingSuccess onNavigate={navigate} />;

  if (content) {
      return (
          <PatientLayout user={user}>
            <PatientDashboardLayout currentPath={currentPath} onNavigate={navigate} user={user}>
                {content}
            </PatientDashboardLayout>
          </PatientLayout>
      );
  }

  return <PatientLayout user={user}><div className="p-12 text-center">404 Not Found: {currentPath}</div></PatientLayout>;
};

const ClinicApp = ({ user, currentPath }: { user: Profile | null, currentPath: string }) => {
  const navigate = (p: string) => { window.location.hash = `clinic/${p}`; };
  // Strip leading slash for internal router
  const internalPath = currentPath.replace(/^\//, '') || 'dashboard';

  return (
    <ClinicMiddleware user={user}>
      {(clinic) => (
         <ClinicLayout user={user!} clinic={clinic} onNavigate={navigate} currentPath={internalPath}>
            {internalPath === 'dashboard' && <ClinicDashboard clinic={clinic} />}
            {internalPath === 'calendar' && <ClinicCalendarPage />}
            {internalPath === 'patients' && <PatientsPage />}
         </ClinicLayout>
      )}
    </ClinicMiddleware>
  );
};

const ProApp = ({ user, currentPath }: { user: Profile | null, currentPath: string }) => {
  const navigate = (p: string) => { window.location.hash = `pro${p.startsWith('/') ? p : '/' + p}`; };
  const safeUser = user || null;

  // Shared Route: Clinic Profile
  if (currentPath.startsWith('/clinic/')) {
    const rawSlug = currentPath.split('/')[2] || '';
    const [slug] = rawSlug.split('?');
    return <ProLayout user={safeUser} onNavigate={navigate} currentPath={currentPath}><ClinicProfile slug={slug} user={safeUser} onNavigate={navigate} /></ProLayout>;
  }

  if (!safeUser) {
      setTimeout(() => window.location.hash = 'auth', 0);
      return null;
  }

  if (currentPath === '/' || currentPath === '/dashboard') return <ProLayout user={safeUser} onNavigate={navigate} currentPath="/"><ProDashboard user={safeUser} onNavigate={navigate} /></ProLayout>;
  if (currentPath === '/passport') return <ProLayout user={safeUser} onNavigate={navigate} currentPath="/passport"><PassportPage user={safeUser} /></ProLayout>;
  if (currentPath === '/jobs') return <ProLayout user={safeUser} onNavigate={navigate} currentPath="/jobs"><JobsPage /></ProLayout>;

  return <div>Pro Route Not Found</div>;
};

// --- MAIN GATEWAY ---

const App = () => {
  const [route, setRoute] = useState(parseHash());
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Global Hash Listener
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash();
      // Only update if actually changed to prevent loops
      setRoute(prev => {
         if (newRoute.subdomain !== prev.subdomain || newRoute.path !== prev.path) {
             window.scrollTo(0,0);
             return newRoute;
         }
         return prev;
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // Empty dependency array ensures we don't re-bind unnecessarily

  // 2. Auth Init
  useEffect(() => {
    const init = async () => {
      const u = db.getCurrentUser();
      setUser(u);
      setLoading(false);
    };
    init();
  }, []);

  const handleLoginSuccess = async (email: string) => {
    const u = await db.signIn(email); 
    setUser(u);
    // Intelligent Redirect
    if (!window.location.hash.includes('?')) {
        if (u?.global_role === 'clinic_user') window.location.hash = 'clinic';
        else if (u?.global_role === 'admin') window.location.hash = 'admin';
        else if (u?.global_role === 'pro_candidate') window.location.hash = 'pro';
        else if (u?.global_role === 'vendor_user') window.location.hash = 'vendor';
        else window.location.hash = 'patient/dashboard';
    } else {
        // Handle callback URL if present
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const cb = params.get('callbackUrl');
        if (cb) window.location.hash = cb;
    }
  };

  if (loading) return <div className="bg-slate-950 h-screen flex items-center justify-center text-emerald-500 font-mono">INITIALIZING SYSTEM...</div>;

  // 3. Router Switch
  return (
    <ErrorBoundary>
      {route.subdomain === 'public' && <PublicApp currentPath={route.path} />}
      
      {route.subdomain === 'patient' && <PatientApp user={user} currentPath={route.path} />}
      
      {route.subdomain === 'clinic' && <ClinicApp user={user} currentPath={route.path} />}
      
      {route.subdomain === 'pro' && <ProApp user={user} currentPath={route.path} />}
      
      {route.subdomain === 'auth' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      
      {/* Other Apps (Simplified for Brevity) */}
      {route.subdomain === 'recruit' && (
          <RecruitMiddleware user={user}>
             <RecruitLayout user={user!} onNavigate={(p) => window.location.hash=`recruit/${p}`} currentPath={route.path}>
                <RecruitDashboard />
             </RecruitLayout>
          </RecruitMiddleware>
      )}
      
      {route.subdomain === 'vendor' && (
          <VendorLayout user={user} onNavigate={(p) => window.location.hash=`vendor${p}`} currentPath={route.path}>
             {(vendor) => (
                 <>
                    {route.path === '/' && <VendorDashboard vendor={vendor} />}
                    {route.path === '/products' && <ProductsPage vendor={vendor} />}
                    {route.path === '/orders' && <OrdersPage vendor={vendor} />}
                 </>
             )}
          </VendorLayout>
      )}
      
      {route.subdomain === 'crm' && (
          <CrmMiddleware user={user}>
             <CrmLayout user={user!} onNavigate={(p) => window.location.hash=`crm${p}`} currentPath={route.path}>
                {route.path === '/' ? <CrmHarvester /> : <CrmLeads />}
             </CrmLayout>
          </CrmMiddleware>
      )}
      
      {route.subdomain === 'admin' && (
          <AdminMiddleware user={user}>
             <AdminLayout user={user!} onNavigate={(p) => window.location.hash=`admin${p}`} currentPath={route.path}>
                {route.path === '/' && <div className="p-12 text-slate-500">Dashboard Ready</div>}
                {route.path === '/users' && <UserManager />}
                {route.path === '/finance' && <FinanceVault />}
                {route.path === '/vault' && <OperationalVaultPage />}
             </AdminLayout>
          </AdminMiddleware>
      )}

      <DebugSessionBar />
    </ErrorBoundary>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
