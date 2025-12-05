# Local DNS & Networking Configuration

To properly test the **DENTEX Multi-Tenant Ecosystem** locally, you must map the production-style subdomains to your local loopback address (`127.0.0.1`). This is required for:
1.  **Cookie Sharing:** Sessions set on `.dentistry.local` need to be readable by `clinics.dentistry.local`.
2.  **CORS Policies:** Browsers treat `localhost` differently than custom domains.

## 1. Locate your Hosts File

*   **macOS / Linux:** `/etc/hosts`
*   **Windows:** `C:\Windows\System32\drivers\etc\hosts`

## 2. Edit with Administrator Privileges

Run the following command in your terminal (macOS/Linux):
```bash
sudo nano /etc/hosts
```

For Windows, open Notepad as Administrator and open the file manually.

## 3. Add the DENTEX Map

Copy and paste the block below to the **bottom** of your hosts file:

```text
# --- DENTEX PRO LOCAL DEV MAP ---
127.0.0.1   dentistry.local
127.0.0.1   www.dentistry.local
127.0.0.1   auth.dentistry.local
127.0.0.1   listings.dentistry.local
127.0.0.1   clinics.dentistry.local
127.0.0.1   pro.dentistry.local
127.0.0.1   vendor.dentistry.local
127.0.0.1   crm.dentistry.local
127.0.0.1   admin.dentistry.local
# --------------------------------
```

## 4. Save and Apply

*   **Nano:** Press `Ctrl+O`, `Enter`, then `Ctrl+X`.
*   **Windows:** File > Save.

## 5. Port Mapping Reference

When running `npm run dev`, ensure your apps are listening on these specific ports to match the Auth Redirect URIs:

| App | URL | Port |
| :--- | :--- | :--- |
| **Public** | `http://www.dentistry.local:3000` | 3000 |
| **Patient** | `http://listings.dentistry.local:3001` | 3001 |
| **Clinic** | `http://clinics.dentistry.local:3002` | 3002 |
| **Pro** | `http://pro.dentistry.local:3003` | 3003 |
| **Vendor** | `http://vendor.dentistry.local:3004` | 3004 |
| **CRM** | `http://crm.dentistry.local:3005` | 3005 |
| **Admin** | `http://admin.dentistry.local:3006` | 3006 |
| **Auth** | `http://auth.dentistry.local:3007` | 3007 |
