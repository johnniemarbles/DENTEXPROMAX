# Supabase Auth Configuration Guide

To ensure Single Sign-On (SSO) works across the DENTEX ecosystem, you must configure the **Redirect URLs** in your Supabase Dashboard.

## 1. Access Authentication Settings
1. Go to your Supabase Project.
2. Click **Authentication** in the sidebar.
3. Click **URL Configuration**.

## 2. Site URL
Set the `Site URL` to your Auth App (The central identity provider).

*   **Prod:** `https://auth.dentistry.exchange`
*   **Local:** `http://localhost:3007` (or whichever port runs `web-auth`)

## 3. Redirect URLs (The Allow List)
Add ALL of the following URLs to the "Redirect URLs" whitelist. This allows the Magic Link to redirect users safely to the specific app they requested access to.

### Production Environment
*   `https://www.dentistry.exchange/**` (Marketing)
*   `https://auth.dentistry.exchange/**` (Identity)
*   `https://listings.dentistry.exchange/**` (Patient Portal)
*   `https://clinics.dentistry.exchange/**` (Clinic OS)
*   `https://pro.dentistry.exchange/**` (Talent Hub)
*   `https://vendor.dentistry.exchange/**` (Marketplace)
*   `https://crm.dentistry.exchange/**` (Internal CRM)
*   `https://admin.dentistry.exchange/**` (Super Admin)

### Local Development Environment
*   `http://localhost:3000/**`
*   `http://localhost:3001/**`
*   `http://localhost:3002/**`
*   `http://localhost:3003/**`
*   `http://localhost:3004/**`
*   `http://localhost:3005/**`
*   `http://localhost:3006/**`
*   `http://localhost:3007/**`

## 4. Cookie Configuration
To share the session across subdomains, ensure your Supabase Client in `packages/database` is configured with:

```typescript
cookieOptions: {
  domain: '.dentistry.exchange', // (Or 'localhost' for dev)
  path: '/',
  sameSite: 'lax',
  secure: true
}
```