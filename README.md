
# Dentistry Exchange (DENTEX) Monorepo

**The Operating System for Modern Dentistry.**

A comprehensive, multi-tenant platform connecting Patients, Clinics, Professionals, and Vendors.

## 🚀 Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    ```bash
    cp .env.example .env
    # Fill in your Supabase Keys
    ```

3.  **Database & Seeding:**
    ```bash
    npm run db:push
    npx tsx scripts/seed-data.ts
    ```

4.  **Launch Ecosystem:**
    ```bash
    npm run dev
    ```

## 🌍 Subdomain Architecture

| App Name | Subdomain | Port | Description |
| :--- | :--- | :--- | :--- |
| **Web Public** | `www.dentistry.exchange` | 3000 | Marketing Front Door |
| **Web Auth** | `auth.dentistry.exchange` | 3007 | SSO Identity Provider |
| **Web Patient** | `listings.dentistry.exchange` | 3001 | Patient Directory & Booking |
| **Web Clinic** | `clinics.dentistry.exchange` | 3002 | Clinic Operating System |
| **Web Pro** | `pro.dentistry.exchange` | 3003 | Talent Hub & Passports |
| **Web Recruit** | `recruit.dentistry.exchange` | 3008 | Hiring & Video Interviews |
| **Web Vendor** | `vendor.dentistry.exchange` | 3004 | Supply Chain Market |
| **Web CRM** | `crm.dentistry.exchange` | 3005 | Internal Lead Engine |
| **Web Admin** | `admin.dentistry.exchange` | 3006 | Super Admin Console |

## 🛠 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Build System:** TurboRepo
*   **Database:** Supabase (PostgreSQL + RLS)
*   **Styling:** Tailwind CSS + Lucide Icons
*   **Validation:** Zod
*   **Language:** TypeScript Strict

## 🔐 Localhost Networking

To test subdomains locally, you must update your hosts file. See `docs/localhost-setup.md`.
