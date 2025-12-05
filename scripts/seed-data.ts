
/**
 * DENTEX SEED SCRIPT
 * Usage: npx tsx scripts/seed-data.ts
 * Description: Hydrates the database with initial Demo data.
 */

import { db } from '../packages/database/client';

async function seed() {
  console.log("🌱 STARTING SEED SEQUENCE...");

  // 1. CREATE ROOT ADMIN
  console.log("... Creating Root Admin");
  await db.upsertProfile({
    id: 'user-root-admin',
    email: 'admin@dentistry.exchange',
    full_name: 'System Root',
    global_role: 'admin',
    created_at: new Date().toISOString(),
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Root'
  });

  // 2. CREATE DEMO CLINIC
  console.log("... Creating Demo Clinic (Apex Dental Suite)");
  const clinic = await db.createClinic({
    name: "Apex Dental Suite",
    slug: "apex-dental",
    address: "99 Innovation Blvd",
    city: "San Francisco",
    contact_phone: "415-555-9000",
    claim_status: 'verified',
    is_front_runner: true
  });

  // 3. CREATE DEMO VENDOR
  console.log("... Creating Demo Vendor (MedTech Solutions)");
  const vendor = await db.createVendor({
    id: 'vendor-medtech',
    name: 'MedTech Solutions',
    is_verified: true
  });

  await db.createProduct({
    vendor_id: vendor.id,
    name: "Titanium Implants (Set)",
    price: 1200.00,
    stock_count: 50,
    category: "Surgical"
  });

  console.log("✅ SEED COMPLETE. System Ready.");
}

seed().catch(console.error);
