# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Yeko Parent is a React Native mobile application built with Expo and Expo Router. It serves as a parent portal for educational management, featuring attendance tracking, homework monitoring, event management, and communication tools. The app uses Supabase for backend services and authentication.

## Development Commands

### Development & Building
```bash
# Start development server for dev client
npm run start

# Run on Android
npm run android  # or npm run dev

# Run on iOS  
npm run ios

# Run on web
npm run web

# Reset project (runs cleanup script)
npm run reset-project
```

### Testing & Quality
```bash
# Run tests in watch mode
npm run test

# Lint code
npm run lint
```

### Supabase Local Development
```bash
# Start local Supabase (if supabase CLI installed)
supabase start

# Stop local Supabase
supabase stop

# View local database
supabase studio  # Opens on port 54323
```

## Architecture & Structure

### Navigation Structure
The app uses Expo Router with file-based routing and a nested structure:
- `app/_layout.tsx` - Root layout with Redux Provider and custom providers
- `app/index.tsx` - Entry point with authentication routing logic
- `app/(app)/` - Main app routes
  - `welcome.tsx`, `signIn.tsx`, `signUp.tsx` - Authentication screens
  - `(protected)/` - Routes requiring authentication
    - `(tabs)/` - Tab-based navigation (Home, Profile)  
    - `(details)/` - Detail screens (attendance, homework, events, etc.)
    - `completeProfile.tsx` - Profile completion flow

### State Management
- **Redux Toolkit** with TypedUseSelectorHook for type safety
- Store location: `store/index.ts` with `rootReducer.ts`
- App state slice: `store/appSlice.ts`
- Custom hook: `useAppSelector` for accessing Redux state

### Authentication & Data
- **Supabase** for authentication and backend services
- `SupabaseProvider` manages auth state and session handling  
- Custom hooks in `hooks/` directory for data fetching:
  - `useAuth.ts` - Authentication operations
  - `useAttendance.ts`, `useHomework.ts` - Feature-specific data
  - `useSchoolYear.ts` - Academic year management

### Component Architecture
- Custom component library with `Cs` prefix (CsButton, CsCard, CsText, etc.)
- Each component has:
  - `index.tsx` - Main component
  - `style.ts` - Styling
  - `type.ts` - TypeScript definitions
  - `ComponentName.test.tsx` - Jest/React Native Testing Library tests
- Components use TypeScript interfaces from `types/` directory

### Services Layer
Services in `services/` directory handle API calls:
- `attendanceService.ts`, `chatService.ts`, `eventService.ts`
- `feedbackService.ts`, `homeworkService.ts`, `scheduleService.ts`
- Each service interfaces with Supabase client

### Theming & Providers
Custom provider architecture in `providers/`:
- `ThemeProvider.tsx` & `ThemeListener.tsx` - Theme management
- `SupabaseProvider.tsx` - Authentication & session management
- `NetworkInfoContainer.tsx` - Network state monitoring
- `Toast.tsx` & `Notification.tsx` - User feedback systems

## Testing

The project uses Jest with jest-expo preset and React Native Testing Library. Tests are colocated with components using `.test.tsx` extension.

Run single test file:
```bash
npm run test -- ComponentName.test.tsx
```

Coverage is enabled by default with exclusions for configuration files.

## Development Notes

### Database Conventions
- Use plural snake_case for database table names
- Use PascalCase for TypeScript schema types (as per user rules)

### Testing Framework
- Uses Jest with jest-expo preset (not Vitest, despite user preference rule)
- React Native Testing Library for component testing

### Configuration
- **EAS Build** configured in `eas.json` for deployment
- **Expo Config** in `app.config.ts` with platform-specific settings
- **Bundle ID**: `io.ldsgroups.yeko`
- **Supabase Local**: Configured on ports 54321-54329

### TypeScript
- Strict TypeScript configuration with path aliases
- Type definitions organized in `types/` directory
- Custom hooks are fully typed with proper return types

## Local Development Setup

1. Install dependencies: `npm install`
2. Set up Supabase local instance (optional): `supabase start`
3. Configure environment variables for Supabase connection
4. Start dev server: `npm run start`
5. Run on desired platform: `npm run android|ios|web`
