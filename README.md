# EDUMYNT - Learning Platform

A student-first learning platform for government exam preparation built with modern web technologies.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Turbopack (for faster development)

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Supabase credentials.

3. **Start development server:**
   ```bash
   npm run dev
   ```
   This will use Turbopack for faster builds and hot reloading.

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppShell, TopBar, BottomNav)
│   └── ui/             # shadcn/ui components
├── lib/                # Utility functions and configurations
│   └── supabase/      # Supabase client configurations
└── public/            # Static assets
```

## Features

- 📱 Native app-like experience with top bar and bottom navigation
- 🌓 Dark/light theme support
- 📱 Mobile-first responsive design
- ⚡ Turbopack for lightning-fast development
- 🔐 Supabase authentication and database ready
- 🎨 Modern UI with shadcn/ui components
- 🎯 Optimized for learning and education workflows

## Environment Ready

The development environment is configured and ready for building:
- App shell with native-like navigation
- Theme provider for dark/light modes
- Supabase integration setup
- TypeScript configuration
- Tailwind CSS with custom design tokens
- Framer Motion for smooth animations

## Next Steps

You can now start building specific pages and features:
- Create course pages
- Add authentication flows
- Build lesson components
- Implement test interfaces
- Add AI integration features

Ready to build something amazing! 🚀