## Database Schema — Visu (Simplified)

**Name**: `visu_clean_schema`

**Description**: Simplified schema for Visu visual shopping lists app with clear separation of concerns, reusable items, and flexible group membership.

### Tables

- **users** — Core user information
  - `id` (uuid, PK) — Unique user identifier
  - `full_name` (text, required) — User's display name
  - `email` (text, required, unique) — User's email address
  - `creation_time` (timestamptz, required, default now()) — Account creation time
  - `latest_time_in_app` (timestamptz, nullable) — Last active timestamp

- **users_tracking_data** — Analytics and usage tracking (1:1 with users)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → users.id, required, unique)
  - `groups_created` (int4, default 0)
  - `current_group_count` (int4, default 0)
  - `lists_created` (int4, default 0)
  - `current_list_count` (int4, default 0)
  - `items_created` (int4, default 0)
  - `pro_status` (bool, default false)
  - `has_pro_activated_before` (bool, default false)
  - `has_reviewed` (bool, default false)

- **groups** — Shopping groups (families, roommates, teams)
  - `id` (uuid, PK)
  - `group_name` (text, required)
  - `creator_id` (uuid, FK → users.id, required)
  - `creation_time` (timestamptz, required, default now())

- **items** — Catalog of shopping items with photos
  - `id` (uuid, PK)
  - `creator_id` (uuid, FK → users.id, required)
  - `item_name` (text, required)
  - `item_category` (text, nullable)
  - `item_image` (text, nullable) — URL
  - `item_location` (text, nullable)
  - `item_extra_details` (text, nullable)

- **group_members** — Junction for users belonging to groups
  - `id` (uuid, PK)
  - `group_id` (uuid, FK → groups.id, required)
  - `user_id` (uuid, FK → users.id, required)
  - `role` (text, required, default 'member') — 'admin' | 'member'
  - `joined_at` (timestamptz, required, default now())
  - Constraints: unique(`group_id`, `user_id`)

- **lists** — Shopping lists within groups
  - `id` (uuid, PK)
  - `group_id` (uuid, FK → groups.id, required)
  - `list_name` (text, required)
  - `creator_id` (uuid, FK → users.id, required)
  - `created_at` (timestamptz, required, default now())
  - `is_active` (bool, required, default true)

- **list_items** — Items added to specific shopping lists
  - `id` (uuid, PK)
  - `list_id` (uuid, FK → lists.id, required)
  - `item_id` (uuid, FK → items.id, required)
  - `quantity` (int4, required, default 1)
  - `notes` (text, nullable)
  - `is_completed` (bool, required, default false)
  - `added_by_user_id` (uuid, FK → users.id, required)
  - Constraints: unique(`list_id`, `item_id`)

- **pro_limits** — Defines limits for free vs pro users
  - `id` (uuid, PK)
  - `plan_type` (text, required) — 'free' | 'pro'
  - `max_items` (int4, required) — -1 means unlimited
  - `max_groups` (int4, required) — -1 means unlimited
  - `max_lists` (int4, required) — -1 means unlimited
  - `has_ai_search` (bool, required, default false)
  - `has_web_access` (bool, required, default false)
  - `created_at` (timestamptz, required, default now())
  - `is_active` (bool, required, default true)
  - Constraints: only one active config per `plan_type`
  - Default rows:
    - free → `{ max_items: 20, max_groups: 2, max_lists: 5, has_ai_search: false, has_web_access: false }`
    - pro → `{ max_items: -1, max_groups: -1, max_lists: -1, has_ai_search: true, has_web_access: true }`

### Relationships
- users → users_tracking_data: 1:1 (`users.id` → `users_tracking_data.user_id`)
- users → groups: 1:many (`users.id` → `groups.creator_id`)
- users → items: 1:many (`users.id` → `items.creator_id`)
- users → lists: 1:many (`users.id` → `lists.creator_id`)
- groups → group_members: 1:many (`groups.id` → `group_members.group_id`)
- users → group_members: 1:many (`users.id` → `group_members.user_id`)
- groups → lists: 1:many (`groups.id` → `lists.group_id`)
- lists ↔ items: many:many via `list_items`

### Key Features
- Clean separation of concerns per table
- Flexible group membership with roles
- Items are reusable across lists (catalog pattern)
- Tracking data separated for performance and optionality
- Multiple lists per group supported
- Attribution maintained for all created content
- Configurable pro limits (`-1` = unlimited) via `pro_limits`
- Feature flags for pro functionality (AI search, web access)

### Notes & Recommendations
- Enable RLS from day one; write policies per table for owner/group-based access
- Add helpful indexes once usage patterns emerge (e.g., on `group_id`, `list_id`, `user_id`)
- Keep migrations annotated with comments for each table/column/function


