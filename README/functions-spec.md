## Functions Specification — Visu

Single-source overview of database SQL functions, Edge Functions, and triggers that power core app flows. Keep logic centralized and testable; call these from the service layer only.

### SQL functions (database)

- **get_user_groups_with_lists(user_id: uuid) → table**
  - Purpose: Dashboard query returning all groups a user belongs to, with lists and member counts
  - Returns (shape):
    - `group_id: uuid`, `group_name: text`, `user_role: text`, `member_count: int`, `list_count: int`, `lists: json[]` of `{ id, name, item_count, is_active }`

- **get_list_with_items(list_id: uuid, user_id: uuid) → table**
  - Purpose: Full list payload including permission flag and items
  - Returns (shape):
    - `list_id: uuid`, `list_name: text`, `group_name: text`, `can_edit: boolean`, `items: json[]` with list-specific data

- **search_items_in_group(group_id: uuid, search_term: text, limit_count: int) → table**
  - Purpose: Ranked search of items created by group members for quick add
  - Returns (shape):
    - `item_id: uuid`, `item_name: text`, `item_category: text`, `item_image: text`, `creator_name: text`, `relevance_score: int`

- **update_tracking_data(user_id: uuid, operation: text, entity_type: text) → void**
  - Purpose: Maintain counters: created/current for groups/lists/items
  - Supported ops: `increment_created`, `increment_current`, `decrement_current`

- **get_group_activity(group_id: uuid, days_back: int) → table**
  - Purpose: Recent activity timeline for a group
  - Returns (shape):
    - `activity_type: text`, `user_name: text`, `item_name: text`, `list_name: text`, `created_at: timestamptz`

Notes
- Enforce RLS; functions should check permissions (membership/role) and return only allowed data
- Add helpful indexes for common filters (e.g., by `group_id`, `list_id`, `user_id`)

### Edge functions (server-side endpoints)

- **POST /create-group** — create_group_with_member
  - Params: `group_name: string`, `user_id: string`
  - Purpose: Create group + add creator as admin + update tracking (transactional)
  - Returns: `{ success: boolean, group_id?: string, error?: string }`

- **POST /invite-user** — invite_user_to_group
  - Params: `group_id: string`, `email: string`, `inviter_id: string`
  - Purpose: Send email + create pending membership consistently
  - Returns: `{ success: boolean, invitation_sent: boolean, error?: string }`

- **POST /add-list-item** — add_item_to_list
  - Params: `list_id: string`, `item_data: object`, `user_id: string`, `quantity?: number`, `notes?: string`
  - Purpose: Create catalog item (if needed) + attach to list + update tracking (atomic)
  - Returns: `{ success: boolean, item_id?: string, list_item_id?: string, error?: string }`

- **POST /upload-item-image** — process_image_upload
  - Params: `image_file: file`, `user_id: string`, `item_id?: string`
  - Purpose: Upload, resize/compress, and return storage URLs
  - Returns: `{ success: boolean, image_url?: string, thumbnail_url?: string, error?: string }`

- **POST /check-subscription** — check_subscription_status
  - Params: `user_id: string`
  - Purpose: Verify store subscription; sync `pro_status`
  - Returns: `{ is_pro: boolean, expires_at?: string, needs_update: boolean }`

- **GET /dashboard/:user_id** — get_dashboard_data
  - Params: `user_id: string (url param)`
  - Purpose: Compose dashboard from SQL functions (user, groups, recent activity, tracking)
  - Returns: `{ user_info: object, groups: any[], recent_activity: any[], tracking_data: object }`

Notes
- Edge functions should be thin orchestrators over SQL functions
- Validate inputs; authenticate requests; never trust client-provided identifiers blindly

### Database triggers (automatic updates)

- `groups` INSERT — update_tracking_on_group_create
  - Increment `groups_created` and `current_group_count` for creator

- `items` INSERT — update_tracking_on_item_create
  - Increment `items_created` for creator

- `users` UPDATE — update_latest_time_in_app
  - Update `latest_time_in_app` timestamp on profile updates

- `users` INSERT — create_tracking_data_on_user_create
  - Create default `users_tracking_data` row for every new user

Notes
- Triggers are powerful but harder to debug; prefer explicit SQL functions for core flows and keep triggers minimal

### Implementation strategy

Start with
- `get_user_groups_with_lists` — dashboard
- `get_list_with_items` — list view
- `create_group_with_member` — group creation
- Basic tracking triggers

Add later
- `search_items_in_group` — when search UX matters
- `process_image_upload` — when adding photos
- `invite_user_to_group` — when adding sharing
- `check_subscription_status` — when adding pro features

Development notes
- Write and test SQL functions first (pure DB logic)
- Build Edge functions as thin layers that call SQL functions
- Add triggers last; keep behavior explicit where possible


