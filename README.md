# WHOP Website Builder

A professional website design and creation tool built specifically for the WHOP platform. Create beautiful, customizable websites for your WHOP business with an intuitive drag-and-drop interface.

## Features

- **WHOP Integration**: Seamless authentication and integration with WHOP platform
- **Template Library**: Pre-built templates for various business types
- **Visual Designer**: Intuitive drag-and-drop website builder
- **Real-time Preview**: See changes as you design
- **Responsive Design**: Automatically optimized for all devices
- **Custom Domains**: Connect your own domain (coming soon)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Platform**: WHOP (iframe embedding)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- WHOP developer account and API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd whop-website-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
WHOP_API_KEY=your_whop_api_key
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## WHOP Integration

This app is designed to run as an embedded application within the WHOP dashboard. The authentication flow:

1. User accesses the app from WHOP Dashboard
2. App detects iframe context and extracts company ID
3. WHOP SDK communicates with parent frame via postMessage
4. Supabase edge function verifies WHOP user token
5. Session established for authenticated access

See the [PRD](./docs/WHOP_AUTH_AND_WEBSITES_PRD.md) for detailed architecture.

## Project Structure

```
src/
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (WhopContext)
├── hooks/              # Custom React hooks
├── integrations/       # External integrations (Supabase)
├── lib/                # Utility functions
├── pages/              # Page components
└── App.tsx            # Main app component
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding UI Components

This project uses shadcn/ui. To add a new component:

```bash
npx shadcn-ui@latest add [component-name]
```

## Deployment

### Supabase Edge Functions

The app requires a `whop-auth` edge function. Deploy it to Supabase:

```bash
supabase functions deploy whop-auth
```

### Environment Setup

Ensure all environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `WHOP_API_KEY` (server-side only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
