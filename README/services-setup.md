## Services Setup — Supabase, Firebase, RevenueCat

### Environment variables (public)
Set these via EAS Secrets or `.env` for local, read by `app.config.ts`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`
- `EXPO_PUBLIC_REVENUECAT_IOS_KEY`

---

### Supabase (JS `^2.50.3`)
- Create a new project; enable RLS from day one
- Copy Project URL and anon key → set env vars above
- Keep schema changes in SQL migrations and document table purposes
- For OAuth (Google/Apple), configure Redirects in Supabase Auth settings

---

### Firebase (RN Firebase `^22.4.0`)
- Add iOS and Android apps in Firebase Console
- Download and place files:
  - Android: `android/app/google-services.json`
  - iOS: `ios/GoogleService-Info.plist`
- Ensure plugins are configured (see `app.json` / `plugins`)
- Analytics is optional in dev; enable in prod builds

---

### RevenueCat (`react-native-purchases@^8.0.0`)
- Create products/offerings in RevenueCat dashboard
- Add platform API keys via env vars above
- Keep product identifiers consistent between stores and RevenueCat

---

### Conventions
- All network calls go through `app/services`
- Screens/components should not contain direct API logic
- Do not commit secrets; store via EAS Secrets/CI


