# Supabase Edge Functions Setup

## Set WHOP API Key in Supabase Secrets

The `WHOP_API_KEY` needs to be set as a secret in Supabase Edge Functions (server-side only).

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com/project/atrjlqapacknrtkfnscn
2. Navigate to: Edge Functions → whop-auth → Settings
3. Under "Secrets", add:
   - **Name:** `WHOP_API_KEY`
   - **Value:** `apik_AGHjgNTfy4u0v_A2020902_C_4c3df67e33e2b163d71e848a7a28a68a988db6372ddcbe32cb4210c4a24f7c`
4. Click "Save"

### Option 2: Via Supabase CLI

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref atrjlqapacknrtkfnscn

# Set the WHOP API Key as a secret
supabase secrets set WHOP_API_KEY=apik_AGHjgNTfy4u0v_A2020902_C_4c3df67e33e2b163d71e848a7a28a68a988db6372ddcbe32cb4210c4a24f7c

# Also set Supabase environment variables for Edge Functions
supabase secrets set SUPABASE_URL=https://atrjlqapacknrtkfnscn.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0cmpscWFwYWNrbnJ0a2Zuc2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjUzNzUsImV4cCI6MjA4MTQwMTM3NX0.H48xpghOammJGA2ZQl4QAZpcOv7xkowgPZJ-XSdeYv4
```

## Deploy whop-auth Edge Function

You need to copy the `whop-auth` edge function from the TennisHub project and deploy it.

1. Copy the function from: `tennishub/supabase/functions/whop-auth/`
2. Create the directory structure: `supabase/functions/whop-auth/`
3. Copy `index.ts` to that location
4. Deploy the function:

```bash
supabase functions deploy whop-auth
```

## Get Service Role Key (if needed)

If you need the Service Role Key for the Edge Function:

1. Go to Supabase Dashboard → Settings → API
2. Copy the "service_role" key (keep this secret!)
3. Set it as a secret:
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
