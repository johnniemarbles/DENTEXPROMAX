'use client';

import React, { useState, Suspense, useEffect } from "react";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { createClient } from '../../../../packages/database/client';

// Helper to get params from hash since we don't have real Next.js router in simulation
const useHashSearchParams = () => {
    const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('?')) {
            const queryPart = hash.split('?')[1];
            setParams(new URLSearchParams(queryPart));
        }
    }, []);
    return params;
};

// Internal Form Component
interface LoginFormProps {
  onLoginSuccess?: (email: string) => void;
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const searchParams = useHashSearchParams(); // Adapted for Hash Router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const db = createClient();
  
  // Support both standard patterns
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("next");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate Network Request
    await new Promise(r => setTimeout(r, 1200));

    // Mock DB Validation
    const user = await db.signIn(email);
    const isSuccess = !!user;

    if (isSuccess) {
        if (onLoginSuccess) onLoginSuccess(email);

        // --- REDIRECT LOGIC ---
        // 1. Establish Default Dashboard based on Role
        let targetHash = 'patient/dashboard';
        
        if (user.global_role === 'clinic_user') targetHash = 'clinic';
        if (user.global_role === 'admin') targetHash = 'admin';
        if (user.global_role === 'pro_candidate') targetHash = 'pro';
        if (user.global_role === 'vendor_user') targetHash = 'vendor';

        // 2. Check if the URL has a "callbackUrl" (e.g. ?callbackUrl=/clinic/123)
        // If they came from a specific page (like "Book Now"), send them back!
        if (callbackUrl) {
          let cleanPath = decodeURIComponent(callbackUrl);
          // Strip leading slash for Hash Router compatibility (e.g. /clinic -> clinic)
          if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
          targetHash = cleanPath;
        }

        console.log(`[Auth] Redirecting to: #${targetHash}`);
        
        // Small delay to allow state updates to propagate
        setTimeout(() => {
            window.location.hash = targetHash; 
        }, 100);
    } else {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Access the DENTEX PRO ecosystem
        </p>
      </div>

      <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm text-slate-900 transition-all"
                placeholder="doctor@dentex.pro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm text-slate-900 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-in shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-2.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-500 shadow-sm hover:bg-slate-50 transition-colors">
              <span className="sr-only">Sign in with Google</span>
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.387 12 12 12c6.613 0 12-5.387 12-12V9.84h-11.52z"/></svg>
              <span className="ml-2">Google</span>
            </button>
            <button className="inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-500 shadow-sm hover:bg-slate-50 transition-colors">
                <span className="sr-only">Sign in with Microsoft</span>
                 <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
                 <span className="ml-2">Microsoft</span>
            </button>
          </div>
          
           {/* Developer Shortcuts */}
           <div className="mt-8 pt-6 border-t border-slate-200">
                 <p className="text-[10px] text-center text-slate-400 mb-4 uppercase font-bold tracking-wider">Simulation Accounts</p>
                 <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => { setEmail('sarah@example.com'); setPassword('demo123'); }} className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 rounded text-[10px] text-slate-600 font-medium border border-slate-200">
                      Patient
                    </button>
                    <button type="button" onClick={() => { setEmail('dr.smith@brightsmile.com'); setPassword('demo123'); }} className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 rounded text-[10px] text-slate-600 font-medium border border-slate-200">
                      Clinic
                    </button>
                    <button type="button" onClick={() => { setEmail('admin@dentistry.exchange'); setPassword('demo123'); }} className="px-2 py-1.5 bg-red-50 hover:bg-red-100 rounded text-[10px] text-red-600 font-medium border border-red-100 col-span-2">
                      System Admin
                    </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}

// Main Export
interface LoginPageProps {
  onLoginSuccess?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
           <Suspense fallback={<div className="text-slate-500">Loading Auth...</div>}>
              <LoginForm onLoginSuccess={onLoginSuccess} />
           </Suspense>
        </div>
    );
};