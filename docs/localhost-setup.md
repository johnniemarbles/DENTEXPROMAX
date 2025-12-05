
# Localhost Networking Setup

To simulate the production `*.dentistry.exchange` subdomains on your local machine, you need to map them to your loopback address (`127.0.0.1`).

## macOS / Linux

1.  Open Terminal.
2.  Edit the hosts file:
    ```bash
    sudo nano /etc/hosts
    ```
3.  Add the following lines to the bottom of the file:
    ```text
    127.0.0.1   www.dentistry.local
    127.0.0.1   auth.dentistry.local
    127.0.0.1   listings.dentistry.local
    127.0.0.1   clinics.dentistry.local
    127.0.0.1   pro.dentistry.local
    127.0.0.1   vendor.dentistry.local
    127.0.0.1   crm.dentistry.local
    127.0.0.1   admin.dentistry.local
    ```
4.  Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).
5.  Flush DNS cache (Optional):
    ```bash
    sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
    ```

## Windows

1.  Open Notepad as **Administrator**.
2.  Open File: `C:\Windows\System32\drivers\etc\hosts`.
3.  Add the lines listed above to the bottom.
4.  Save.

## Usage

Now, when you run `npm run dev`, you can access the apps via:
*   `http://clinics.dentistry.local:3000` (Port may vary based on your Turbo config)
*   `http://auth.dentistry.local:3000`

**Note:** Ensure your Supabase Auth "Redirect URLs" include these `.local` domains.
