
import { Profile, Clinic, Membership, Appointment, ProProfile, Job, Vendor, Product, Order, ClinicClaimStatus, SystemSetting, FamilyMember, Interview } from './types';
import { InsertAppointmentValues, InsertProductValues, InsertClinicValues } from './zod-schemas';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

// --- LIVE SUPABASE CREDENTIALS ---
const SUPABASE_URL = "https://tufwbvnnzckrdvixsuht.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Zndidm5uemNrcmR2aXhzdWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODI2OTQsImV4cCI6MjA4MDE1ODY5NH0.rT2dwuTRGMiYyr20tVOZu9HRWgEeK7mjymiW9_b0k";

// Initialize Real Client
const realSupabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'dentex-auth-token',
    }
});

// --- MOCK DATA SEEDS ---

const MOCK_PROFILES: Profile[] = [
  {
    id: 'user-sarah',
    email: 'sarah@example.com',
    full_name: 'Sarah Patient',
    global_role: 'patient',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'user-dr-smith',
    email: 'dr.smith@brightsmile.com',
    full_name: 'Dr. John Smith',
    global_role: 'clinic_user',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: 'user-admin',
    email: 'admin@dentistry.exchange',
    full_name: 'Super Admin',
    global_role: 'admin',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    id: 'user-pro-lisa',
    email: 'lisa.rdh@example.com',
    full_name: 'Lisa Ray, RDH',
    global_role: 'pro_candidate',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
  },
  {
    id: 'user-vendor-bob',
    email: 'bob@dental-supplies.com',
    full_name: 'Bob Supplier',
    global_role: 'vendor_user',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  }
];

const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-1',
    guardian_id: 'user-sarah',
    first_name: 'Timmy',
    last_name: 'Patient',
    date_of_birth: '2015-05-12',
    relationship: 'Child',
    gender: 'Male'
  }
];

const MOCK_CLINICS: Clinic[] = [
  {
    id: 'clinic-bright-smile',
    name: 'Bright Smile Dental',
    slug: 'bright-smile',
    address: '123 Main St',
    city: 'New York',
    claim_status: 'verified',
    is_front_runner: true,
    contact_phone: '555-0101',
    created_at: new Date().toISOString()
  },
  {
    id: 'clinic-downtown',
    name: 'Downtown Dental (Unclaimed)',
    slug: 'downtown-dental',
    address: '456 Market Ave',
    city: 'Chicago',
    claim_status: 'unclaimed',
    is_front_runner: false,
    contact_phone: '555-0102',
    created_at: new Date().toISOString()
  }
];

const MOCK_MEMBERSHIPS: Membership[] = [
  {
    id: 'mem-1',
    user_id: 'user-dr-smith',
    clinic_id: 'clinic-bright-smile',
    role: 'owner',
    is_primary: true
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    clinic_id: 'clinic-bright-smile',
    patient_id: 'user-sarah',
    status: 'confirmed',
    requested_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    service_type: 'General Checkup',
    notes: 'Patient prefers morning slots.',
    created_at: new Date().toISOString()
  }
];

const MOCK_PRO_PROFILES: ProProfile[] = [
  {
    user_id: 'user-pro-lisa',
    title: 'Senior Registered Dental Hygienist',
    bio: 'Experienced RDH with 8 years in pediatric and general dentistry. Passionate about preventative care.',
    years_experience: 8,
    hourly_rate: 45,
    license_number: 'RDH-998877',
    is_license_verified: true,
    availability: { status: 'open' }
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    clinic_id: 'clinic-bright-smile',
    clinic_name: 'Bright Smile Dental',
    title: 'Full-Time Dental Hygienist',
    description: 'Looking for a friendly RDH to join our growing team.',
    type: 'Full-time',
    salary_range: '$40 - $55 / hr',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-2',
    clinic_id: 'clinic-bright-smile',
    clinic_name: 'Bright Smile Dental',
    title: 'Locum Dentist Needed',
    description: 'Coverage needed for 2 weeks in August.',
    type: 'Locum',
    salary_range: '$1200 / day',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-3',
    clinic_id: 'clinic-downtown',
    clinic_name: 'Downtown Dental',
    title: 'Dental Assistant',
    description: 'Entry level position, training provided.',
    type: 'Full-time',
    salary_range: '$22 - $28 / hr',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

const MOCK_INTERVIEWS: Interview[] = [
    {
        id: 'int-1',
        clinic_id: 'clinic-bright-smile',
        candidate_id: 'user-pro-lisa',
        candidate_name: 'Lisa Ray, RDH',
        job_title: 'Full-Time Dental Hygienist',
        scheduled_at: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        status: 'scheduled',
        meeting_link: 'https://meet.google.com/abc-defg-hij'
    }
];

const MOCK_VENDORS: Vendor[] = [
    {
        id: 'vendor-1',
        name: 'Apex Dental Supplies',
        is_verified: true
    }
];

const MOCK_USER_VENDOR_MAP: Record<string, string> = {
    'user-vendor-bob': 'vendor-1'
};

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        vendor_id: 'vendor-1',
        name: 'Latex Gloves (Box of 100)',
        price: 15.99,
        stock_count: 500,
        category: 'Consumables',
        is_visible: true
    },
    {
        id: 'prod-2',
        vendor_id: 'vendor-1',
        name: 'Dental Mirror #4',
        price: 8.50,
        stock_count: 120,
        category: 'Instruments',
        is_visible: true
    }
];

const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-101',
        clinic_id: 'clinic-bright-smile',
        vendor_id: 'vendor-1',
        total_amount: 145.50,
        status: 'processing',
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
        id: 'ord-102',
        clinic_id: 'clinic-bright-smile',
        vendor_id: 'vendor-1',
        total_amount: 550.00,
        status: 'shipped',
        created_at: new Date(Date.now() - 604800000).toISOString() // 1 week ago
    }
];

const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  { key: 'GOOGLE_MAPS_API_KEY', value: 'AIzaSyD-MockKey-123456789', category: 'infra', description: 'Used for Geocoding and Maps rendering.', updated_at: new Date().toISOString() },
  { key: 'REOON_VERIFIER_KEY', value: 'reoon_live_mock_998877', category: 'ops', description: 'Email verification service for new clinics.', updated_at: new Date().toISOString() },
  { key: 'SUPABASE_SERVICE_ROLE', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', category: 'infra', description: 'Root level database access. HANDLE WITH CARE.', updated_at: new Date().toISOString() },
  { key: 'STRIPE_CONNECT_CLIENT_ID', value: 'ca_HkL234MockClientId', category: 'infra', description: 'For vendor payouts and onboarding.', updated_at: new Date().toISOString() }
];

// --- HYBRID DATABASE CLIENT CLASS ---

class MockDatabase {
  private profiles = MOCK_PROFILES;
  private familyMembers = MOCK_FAMILY_MEMBERS;
  private clinics = MOCK_CLINICS;
  private memberships = MOCK_MEMBERSHIPS;
  private appointments = MOCK_APPOINTMENTS;
  private proProfiles = MOCK_PRO_PROFILES;
  private jobs = MOCK_JOBS;
  private interviews = MOCK_INTERVIEWS;
  private vendors = MOCK_VENDORS;
  private products = MOCK_PRODUCTS;
  private orders = MOCK_ORDERS;
  private systemSettings = MOCK_SYSTEM_SETTINGS;
  
  private currentUser: Profile | null = null;
  public supabase: SupabaseClient;

  constructor() {
      this.supabase = realSupabase;
      
      // AUTO-RECOVERY FOR SIMULATION
      // We simulate Server-Side Cookie persistence by reading document.cookie on client init.
      if (typeof document !== 'undefined') {
          // 1. Try explicit session cookie
          const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('dentex_session_user='));
          if (sessionCookie) {
              const email = decodeURIComponent(sessionCookie.split('=')[1]);
              const user = this.profiles.find(p => p.email === email);
              if (user) {
                  this.currentUser = user;
                  console.log(`[MockDB] Session Restored: ${user.email}`);
                  return;
              }
          }

          // 2. Try Ghost Role cookie (from DebugSessionBar)
          const ghostCookie = document.cookie.split('; ').find(row => row.startsWith('dentex_ghost_role='));
          if (ghostCookie) {
              const role = ghostCookie.split('=')[1];
              let targetEmail = '';
              if (role === 'patient') targetEmail = 'sarah@example.com';
              if (role === 'clinic') targetEmail = 'dr.smith@brightsmile.com';
              if (role === 'admin') targetEmail = 'admin@dentistry.exchange';
              
              if (targetEmail) {
                  const user = this.profiles.find(p => p.email === targetEmail);
                  if (user) {
                      this.currentUser = user;
                      console.log(`[MockDB] Ghost Session Restored: ${user.email}`);
                  }
              }
          }
      }
  }

  // Auth: Use Mock for now to preserve Demo Role Shortcuts
  async signIn(email: string): Promise<Profile | null> {
    const user = this.profiles.find(p => p.email === email);
    if (user) {
        this.currentUser = user;
        
        // PERSIST SESSION (Client-Side Mock for httpOnly cookie)
        // Equivalent to: cookies().set({ name: 'auth_token', ... })
        if (typeof document !== 'undefined') {
             document.cookie = `dentex_session_user=${encodeURIComponent(email)}; path=/; max-age=604800; SameSite=Lax`;
        }
    }
    return user || null;
  }

  async signOut() {
    this.currentUser = null;
    if (typeof document !== 'undefined') {
        document.cookie = "dentex_session_user=; path=/; max-age=0";
        document.cookie = "dentex_ghost_role=; path=/; max-age=0";
    }
    await this.supabase.auth.signOut(); // Also sign out of real backend if connected
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // --- HYBRID REALTIME SUBSCRIPTION ---
  // Delegates to the REAL Supabase Client to enable actual websocket connections
  channel(name: string) {
    return this.supabase.channel(name);
  }
  
  removeChannel(channel: any) {
      if (channel && typeof channel.unsubscribe === 'function') {
          // Real Supabase channel
          this.supabase.removeChannel(channel);
      }
  }

  // Admin / Seed Methods
  async upsertProfile(profile: Profile): Promise<Profile> {
      const idx = this.profiles.findIndex(p => p.email === profile.email);
      if (idx >= 0) {
          this.profiles[idx] = { ...this.profiles[idx], ...profile };
          return this.profiles[idx];
      } else {
          this.profiles.push(profile);
          return profile;
      }
  }

  async createVendor(vendor: Vendor): Promise<Vendor> {
      this.vendors.push(vendor);
      return vendor;
  }

  // Family Members
  async getFamilyMembers(userId: string): Promise<FamilyMember[]> {
      return this.familyMembers.filter(m => m.guardian_id === userId);
  }

  async createFamilyMember(data: Omit<FamilyMember, 'id'>): Promise<FamilyMember> {
      const newMember: FamilyMember = {
          id: `fam-${Date.now()}`,
          ...data
      };
      this.familyMembers.push(newMember);
      return newMember;
  }

  async deleteFamilyMember(id: string): Promise<void> {
      this.familyMembers = this.familyMembers.filter(m => m.id !== id);
  }

  // RLS: "Public View Clinics"
  async getClinics(filter: 'all' | 'verified' = 'all'): Promise<Clinic[]> {
    await new Promise(r => setTimeout(r, 200)); // Latency
    if (filter === 'verified') {
      return this.clinics.filter(c => c.claim_status === 'verified');
    }
    return this.clinics;
  }

  async getClinicBySlug(slug: string): Promise<Clinic | undefined> {
    return this.clinics.find(c => c.slug === slug);
  }

  // RLS: "Clinic Staff View Own Clinic"
  async getMyClinics(): Promise<Clinic[]> {
    if (!this.currentUser) return [];
    
    const myMemberships = this.memberships.filter(m => m.user_id === this.currentUser?.id);
    const clinicIds = myMemberships.map(m => m.clinic_id);
    
    return this.clinics.filter(c => clinicIds.includes(c.id));
  }

  // CRM Features
  async createClinic(data: InsertClinicValues & { is_front_runner?: boolean, claim_status?: ClinicClaimStatus }): Promise<Clinic> {
    const newClinic: Clinic = {
        id: `clinic-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: data.name,
        slug: data.slug,
        address: data.address,
        city: data.city,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        claim_status: data.claim_status || 'unclaimed',
        is_front_runner: data.is_front_runner || false,
        created_at: new Date().toISOString()
    };
    this.clinics.push(newClinic);
    return newClinic;
  }

  async updateClinicStatus(id: string, status: ClinicClaimStatus): Promise<void> {
    const clinic = this.clinics.find(c => c.id === id);
    if (clinic) {
        clinic.claim_status = status;
    }
  }

  async deleteClinic(id: string): Promise<void> {
    this.clinics = this.clinics.filter(c => c.id !== id);
  }

  // RLS: "Staff View Appointments"
  async getAppointmentsForClinic(clinicId: string): Promise<Appointment[]> {
    if (!this.currentUser) throw new Error("Unauthorized");
    const hasAccess = this.memberships.find(
      m => m.user_id === this.currentUser?.id && m.clinic_id === clinicId
    );
    if (!hasAccess && this.currentUser.global_role !== 'admin') {
      throw new Error("RLS Violation: Access Denied");
    }
    return this.appointments.filter(a => a.clinic_id === clinicId);
  }

  async getAppointmentsForPatient(patientId: string): Promise<Appointment[]> {
      return this.appointments.filter(a => a.patient_id === patientId);
  }

  async createAppointment(data: InsertAppointmentValues): Promise<Appointment> {
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      clinic_id: data.clinic_id,
      patient_id: data.patient_id || this.currentUser?.id,
      family_member_id: data.family_member_id || null,
      status: 'pending',
      requested_time: data.requested_time,
      service_type: data.service_type,
      notes: data.notes,
      created_at: new Date().toISOString()
    };
    this.appointments.unshift(newAppt); // Add to top
    return newAppt;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
      const idx = this.appointments.findIndex(a => a.id === id);
      if (idx !== -1) {
          this.appointments[idx] = { ...this.appointments[idx], ...updates, updated_at: new Date().toISOString() };
          return this.appointments[idx];
      }
      return undefined;
  }

  // --- PRO FEATURES ---

  async getProProfile(userId: string): Promise<ProProfile | undefined> {
     return this.proProfiles.find(p => p.user_id === userId);
  }

  async updateProProfile(userId: string, data: Partial<ProProfile>): Promise<ProProfile> {
     const index = this.proProfiles.findIndex(p => p.user_id === userId);
     if (index >= 0) {
       this.proProfiles[index] = { ...this.proProfiles[index], ...data };
       return this.proProfiles[index];
     } else {
        const newProfile: ProProfile = {
            user_id: userId,
            title: data.title || 'Untitled',
            is_license_verified: false,
            ...data
        };
        this.proProfiles.push(newProfile);
        return newProfile;
     }
  }

  async getJobs(): Promise<Job[]> {
      return this.jobs.filter(j => j.is_active);
  }

  // --- RECRUIT FEATURES (NEW) ---

  async getInterviewsForClinic(clinicId: string): Promise<Interview[]> {
     return this.interviews.filter(i => i.clinic_id === clinicId);
  }

  // --- VENDOR FEATURES ---

  async getVendorForUser(userId: string): Promise<Vendor | null> {
      const vendorId = MOCK_USER_VENDOR_MAP[userId];
      if (!vendorId) return null;
      return this.vendors.find(v => v.id === vendorId) || null;
  }

  async getProductsByVendor(vendorId: string): Promise<Product[]> {
      return this.products.filter(p => p.vendor_id === vendorId);
  }

  async createProduct(data: InsertProductValues): Promise<Product> {
      const newProd: Product = {
          id: `prod-${Date.now()}`,
          is_visible: true,
          ...data
      };
      this.products.push(newProd);
      return newProd;
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
      return this.orders.filter(o => o.vendor_id === vendorId);
  }

  async updateOrderStatus(orderId: string, status: 'processing' | 'shipped' | 'delivered'): Promise<void> {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
          order.status = status;
      }
  }

  // --- ADMIN FEATURES ---
  
  async getAllProfiles(): Promise<Profile[]> {
      return this.profiles;
  }

  async banUser(userId: string): Promise<void> {
      console.log(`[AUDIT] User ${userId} has been banned.`);
  }

  async getPlatformFinancials(): Promise<{ totalVolume: number, revenue: number, orderCount: number }> {
      const totalVolume = this.orders.reduce((sum, o) => sum + o.total_amount, 0);
      return {
          totalVolume,
          revenue: totalVolume * 0.05, // 5% Take Rate
          orderCount: this.orders.length
      };
  }

  // --- ADMIN VAULT FEATURES ---

  async getSystemSettings(): Promise<SystemSetting[]> {
      await new Promise(r => setTimeout(r, 500)); 
      return this.systemSettings;
  }

  async updateSystemSetting(key: string, value: string): Promise<void> {
      const idx = this.systemSettings.findIndex(s => s.key === key);
      if (idx !== -1) {
          this.systemSettings[idx] = { 
              ...this.systemSettings[idx], 
              value, 
              updated_at: new Date().toISOString() 
          };
      }
  }
}

// SINGLETON INSTANCE
export const db = new MockDatabase();

// Factory compatible with both patterns
export const createClient = () => {
    return db as any;
};

// Export raw supabase for specific components if needed
export const supabase = realSupabase;
