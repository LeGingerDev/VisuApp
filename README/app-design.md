## App Design — Visu: Visual Shopping Lists

### Product overview
- **Problem**: Buying for others is error-prone when you can’t see the exact product.
- **Solution**: Visual shopping lists with photos of the exact items people use, organized by shared groups.

### Target users & key scenarios
- **Users**: Families, couples, roommates, small teams.
- **Scenario**: “Grab coffee” → open Visu → see photo and details of the exact preferred coffee → buy confidently.

### MVP scope (in) and non-goals (out)
- **In (MVP)**:
  - Create groups and invite members
  - Create lists per group
  - Add items with photo, name, optional category/location/notes
  - Basic text search (group-level)
  - Sync across members (real-time or near real-time)
  - Freemium limits enforcement and paywall
- **Out (v1)**:
  - AI search
  - Advanced categorization/analytics dashboards
  - Complex usage tracking visuals
  - Web client

### Differentiators
- Visual-first lists (photo-centric)
- Multiple groups and lists (family, roommates, work)
- Simple, fast add-item flow (camera or gallery)

### Monetization
- **Freemium limits**: 20 items total, 2 groups, 5 lists, basic search
- **Premium**: $2.49/month → unlimited + AI search (later) + web access (later)
- **Ads for free users**: banner ads in lists; interstitial ~every 5 minutes (design placement only; add SDK later)

### Success metrics
- First-week activation rate (create 1 group, 1 list, 3 items)
- Repeat usage (2+ sessions per week)
- Time-to-first-item (sub 2 minutes from install)
- Conversion to premium after hitting limits

### Information architecture (high-level)
- Entities: `users`, `users_tracking_data`, `groups`, `group_members`, `lists`, `items`, `list_items`
- Relationships: lists belong to groups; items reusable across lists; membership with roles per group
- See `schema-overview.md` for full fields and relationships

### Navigation & screen map
- **Pattern**: Native Stack (root) + Tabs inside main stack; centralized navigation service; SafeArea container + fixed header + scrollable content
- **Screens**:
  - Auth: Sign In (Google/Apple), minimal onboarding (optional)
  - Home: user’s groups overview (name, member count, recent activity snapshot)
  - Group: group header + lists grid/list; quick add list
  - List: photo-first grid of items; add item CTA
  - Add/Edit Item: capture/upload photo, name, category (optional), location (optional), notes
  - Search: basic text search within group catalog
  - Invite/Share: invite via link/email
  - Paywall: show limits reached → subscribe (RevenueCat)
  - Settings: account, subscription status, theme

### UX principles
- “Show don’t tell” — image-first cards, large thumbnails
- 3-tap add flow: open list → Add → camera/gallery → item name → save
- Keep actions contextual (long-press or overflow menu for edit/remove)
- Accessibility: large hit targets, meaningful labels, supports screen readers

### Visual system & theming
- No hardcoded colors; use a theme tokens file (light/dark), semantic roles (primary, surface, text, success, warning, error)
- Typography: legible, minimal; use platform defaults or a single family
- Components: keep files < 200–300 LOC; extract subcomponents when growing

### Media handling (design intent)
- Photos: capture or gallery, compress and generate thumbnail
- Storage: persistent object storage (e.g., Supabase Storage), keep public URLs or signed URLs
- Consistent aspect ratio for list cards; defer cropping UI (v1.1)

### Permissions & data access (design intent)
- Groups have roles: admin, member
- RLS policies enforce: users see own profile, group members see group lists/items
- Audit: track creator and timestamps for lists/items

### Technical alignment (high-level)
- **Stack**: React Native 0.79.5, Expo 53, TypeScript ~5.8.3, Ignite 11.0.0
- **Backend**: Supabase (DB, Auth, Storage, Edge Functions), Firebase (Analytics), RevenueCat (IAP)
- **Service layer**: all network and integration code under `app/services`; no direct API calls from screens
- **EAS**: development/preview/production profiles; bundle id `com.legingerdev.visu`

### Paywall & limits (UX)
- Show soft warning at 80% of free limit usage; hard block at limit with paywall
- Keep paywall simple: benefits list, price, restore/manage purchase

### ASO (store positioning)
- Name: “Visu: Visual Shopping Lists”
- Category: Shopping
- Keywords: shopping, list, grocery, family, share, photo, visual, organize, household, team, ai, search, sync
- Creative: app icon with shopping list + magnifying glass; screenshots that show visual lists

### Roadmap (phased)
- **v1.0 (MVP)**: groups, lists, photo items, basic search, sharing, freemium limits + paywall
- **v1.1**: image cropping, better thumbnails, bulk add, improved search UX
- **v1.2**: invitations via email/link with status, richer roles, activity feed
- **v2.0**: AI search, advanced categorization, analytics views, web client

### Risks & mitigations
- Image storage costs → compress & thumbnail; lazy load
- Scope creep → keep to MVP scope; use this doc as gatekeeper
- Permissions complexity → keep roles simple (admin|member) in v1

### Definition of done (MVP)
- End-to-end: create group → invite → create list → add 3 items with photos → search → sync across 2 devices
- Paywall triggers correctly at limits; RevenueCat purchase and restore verified
- Basic analytics events logged (screen views, item add, paywall shown)


