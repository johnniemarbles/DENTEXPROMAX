# System Verification Protocol (The Smoke Test)

Follow this "Golden Path" to verify the DENTEX ecosystem is fully operational.

## Phase 1: Initialization

1.  [ ] **Network Check:** Verify `/etc/hosts` contains the mapping from `docs/hosts-guide.md`.
2.  [ ] **Dependencies:** Run `npm install` in root.
3.  [ ] **Database:** Run `npm run db:push` to apply schema.
4.  [ ] **Hydration:** Run `npm run seed`. Confirm console output: "✅ SEED COMPLETE".
5.  [ ] **Launch:** Run `npm run dev`. Ensure all 8 apps start without error.

## Phase 2: The Patient Journey (Discovery)

1.  [ ] Open `http://www.dentistry.local:3000`. Verify "Traffic Controller" Hero Page loads.
2.  [ ] Click "For Patients". Verify redirect to `http://listings.dentistry.local:3001`.
3.  [ ] Search for "Apex". Verify "Apex Dental Suite" appears in results.
4.  [ ] Click "View Profile". Verify Clinic Profile page loads.
5.  [ ] Click "Book Appointment". Fill form. Click "Confirm".
6.  [ ] Verify redirect to `/booking/success`.

## Phase 3: The Clinic Journey (Operations)

1.  [ ] Open `http://auth.dentistry.local:3007`.
2.  [ ] **Action:** Sign in as `dr.smith@brightsmile.com`.
3.  [ ] **Check:** Verify redirect to `http://clinics.dentistry.local:3002`.
4.  [ ] **Dashboard:** Verify "Front Desk" loads.
5.  [ ] **Verification Gate:** Confirm "Bright Smile Dental" is VERIFIED (Green badge).
6.  [ ] **Data:** Check "Incoming Requests". The appointment created in Phase 2 should appear here (if synced).

## Phase 4: The Admin Journey (God Mode)

1.  [ ] Open `http://auth.dentistry.local:3007`.
2.  [ ] **Action:** Sign in as `admin@dentistry.exchange`.
3.  [ ] **Check:** Verify redirect to `http://admin.dentistry.local:3006`.
4.  [ ] **Security:** Verify the Red Theme ("Danger Zone").
5.  [ ] **Finance:** Navigate to "Finance Vault". Check if Revenue metrics are calculating.

## Phase 5: The Edge Cases (Security)

1.  [ ] **Role Enforcer:** While logged in as Dr. Smith (Clinic), try to access `http://admin.dentistry.local:3006`.
    *   *Expected Result:* 404 Not Found (Middleware Block).
2.  [ ] **Unclaimed Clinic:** Log in as a user owning an Unclaimed clinic.
    *   *Expected Result:* Dashboard should show "Verification Required" lock screen.

---
**Status Report:** If all checks pass, the Release Candidate is valid.
