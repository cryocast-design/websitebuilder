# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel project settings:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Navigate to: Settings → Environment Variables
3. Add the following variables:

### For All Environments (Production, Preview, Development):

```
VITE_SUPABASE_URL=https://atrjlqapacknrtkfnscn.supabase.co
```

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0cmpscWFwYWNrbnJ0a2Zuc2NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjUzNzUsImV4cCI6MjA4MTQwMTM3NX0.H48xpghOammJGA2ZQl4QAZpcOv7xkowgPZJ-XSdeYv4
```

```
NEXT_PUBLIC_WHOP_APP_ID=app_MklX3bNG6gZXDG
```

4. Click "Save" after adding each variable
5. Redeploy your application for changes to take effect

**Note:** The `WHOP_API_KEY` is NOT set in Vercel - it's only used server-side in Supabase Edge Functions (see below).
