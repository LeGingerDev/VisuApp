## Visu — Quick Overview

### Essentials
- **Bundle identifier**: `com.legingerdev.visu`
- **Platforms**: iOS and Android via Expo EAS
- **Navigation**: Native Stack as default; tabs-inside-stack; centralized navigation service
- **Theming**: No hardcoded colors; use a shared theme system
- **Service layer**: All API/data logic lives under `app/services`

### Tech stack and versions
- **React Native**: `0.79.5`
- **React**: `19.0.0`
- **Expo SDK**: `53.0.20`
- **EAS CLI**: `>=3.15.1`
- **TypeScript**: `~5.8.3`
- **Ignite CLI**: `11.0.0`
- **Supabase JS**: `^2.50.3`
- **RevenueCat (react-native-purchases)**: `^8.0.0`
- **Firebase**: `@react-native-firebase/app@^22.4.0`, `@react-native-firebase/analytics@^22.4.0`

### What’s new (vs previous docs)
- Updated to React Native `0.79.5`, React `19.0.0`, Expo `53.0.20`
- EAS profiles defined for development, preview, and production with remote credentials
- Centralized config via `app.config.ts` for public env values

### Minimal project structure (high-level)
- `app/navigation/` — navigators, routes, navigation service
- `app/screens/` — screens only; keep logic thin
- `app/components/` — reusable UI; no hardcoded colors
- `app/services/` — API/Supabase/RevenueCat/Firebase integrations
- `app/hooks/`, `app/utils/`, `app/constants/` — shared logic and constants

### Rules of thumb
- Keep navigation depth under 3–4 levels; prefer conditional flows
- Use a service layer for all network/stateful logic; no direct API calls in screens
- Keep files under ~200–300 LOC; extract components/hooks when growing


