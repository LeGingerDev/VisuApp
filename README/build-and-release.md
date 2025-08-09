## Build & Release (EAS)

### Profiles (from `eas.json`)
- **development**: debug builds, dev client, internal distribution
- **development:device**: same as development, device targets
- **preview**: internal distribution; iOS simulator builds; Android APK
- **preview:device**: device builds
- **production**: store-ready; Android App Bundle, iOS archive

### Required identifiers
- **iOS bundleIdentifier**: `com.legingerdev.visu` (in `app.json`/`app.config.ts`)
- **Android package**: `com.legingerdev.visu` (in `app.json`)

### Core commands
- Start dev client: `npm run start`
- Remote build (examples):
  - iOS dev: `eas build --profile development --platform ios`
  - Android dev: `eas build --profile development --platform android`
  - iOS prod: `eas build --profile production --platform ios`
  - Android prod: `eas build --profile production --platform android`
- Submit to stores:
  - iOS: `eas submit --platform ios --profile production`
  - Android: `eas submit --platform android --profile production`

### Credentials
- Use the same Apple/Google accounts as existing app
- Keep using remote credentials (as configured in `eas.json`)
- Preserve Android keystore and iOS signing assets

### Versioning
- iOS: auto-increment `buildNumber` (EAS)
- Android: auto-increment `versionCode` (EAS)

### Notes
- Ensure `owner` and `projectId` are set under `extra.eas` in `app.json`
- If rebuilding from scratch, run `eas project:init` once, then reuse existing bundle IDs


