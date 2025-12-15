# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory with:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase**
   
   You'll need to:
   - Create a Supabase project
   - Set up the `whop-auth` edge function (copy from TennisHub project)
   - Configure environment variables in Supabase for `WHOP_API_KEY`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## WHOP Integration

To test WHOP integration:

1. Access the app from WHOP Dashboard at `/dashboard/biz_xxx`
2. The app will automatically initialize WHOP authentication
3. Ensure the `whop-auth` edge function is deployed to Supabase

## Project Structure

```
whop-website-builder/
├── src/
│   ├── components/      # React components
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/       # React contexts
│   │   └── WhopContext.tsx
│   ├── integrations/   # External services
│   │   └── supabase/
│   ├── lib/            # Utilities
│   │   ├── utils.ts
│   │   └── whop-sdk.ts
│   ├── pages/          # Page components
│   │   ├── Designer.tsx
│   │   └── WhopDashboard.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Next Steps

1. Install dependencies: `npm install`
2. Set up Supabase edge function for `whop-auth`
3. Configure environment variables
4. Start building the website designer features

