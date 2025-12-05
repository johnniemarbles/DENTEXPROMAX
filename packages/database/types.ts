
export type UserAppRole = 'admin' | 'clinic_user' | 'pro_candidate' | 'vendor_user' | 'patient' | 'pro';
export type ClinicClaimStatus = 'unclaimed' | 'pending_verification' | 'verified' | 'suspended';
export type AppointmentStatus = 'pending' | 'proposed' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type ClinicRole = 'owner' | 'dentist' | 'hygienist' | 'admin' | 'receptionist';
export type FamilyRelationship = 'Child' | 'Spouse' | 'Parent' | 'Other';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  global_role: UserAppRole;
  created_at: string;
  updated_at?: string;
}

export interface FamilyMember {
  id: string;
  guardian_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  relationship: FamilyRelationship;
  gender?: string;
  notes?: string;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address?: string;
  city?: string;
  geo_location?: any; 
  claim_status: ClinicClaimStatus;
  is_front_runner: boolean;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  created_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  clinic_id: string;
  role: ClinicRole;
  is_primary: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id?: string;
  family_member_id?: string | null; // Linked dependent
  status: AppointmentStatus;
  requested_time: string;
  confirmed_time?: string;
  proposed_slots?: { start: string; end: string }[];
  service_type: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProProfile {
  user_id: string;
  title: string;
  bio?: string;
  years_experience?: number;
  hourly_rate?: number;
  license_number?: string;
  is_license_verified: boolean;
  availability?: any; 
}

export interface Job {
  id: string;
  clinic_id: string;
  clinic_name: string; 
  title: string;
  description?: string;
  type: 'Full-time' | 'Part-time' | 'Locum' | 'Temp';
  salary_range: string;
  is_active: boolean;
  created_at: string;
}

export interface Interview {
  id: string;
  clinic_id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  meeting_link?: string;
}

export interface Vendor {
    id: string;
    name: string;
    stripe_account_id?: string;
    is_verified: boolean;
}

export interface Product {
    id: string;
    vendor_id: string;
    name: string;
    description?: string;
    price: number;
    stock_count: number;
    category?: string;
    image_url?: string;
    is_visible: boolean;
}

export interface Order {
    id: string;
    clinic_id: string;
    vendor_id: string;
    total_amount: number;
    status: 'processing' | 'shipped' | 'delivered';
    created_at: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  category: 'ops' | 'infra';
  description: string;
  updated_at: string;
}