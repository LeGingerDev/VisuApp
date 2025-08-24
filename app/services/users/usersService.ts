import { supabase } from "../supabase/supabaseClient"

export interface User {
  id: string
  full_name: string
  email: string
  created_at: string
  avatar_url?: string
}

export interface UsersResult {
  ok: boolean
  data?: User[]
  error?: string
}

export interface UserResult {
  ok: boolean
  data?: User
  error?: string
}

/**
 * Service for managing users in the database
 */
export class UsersService {
  /**
   * Get a user by ID
   */
  static async getUserById(userId: string): Promise<UserResult> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user:", error)
        return { ok: false, error: "Failed to fetch user" }
      }

      return { ok: true, data }
    } catch (error) {
      console.error("Exception fetching user:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Get multiple users by their IDs
   */
  static async getUsersByIds(userIds: string[]): Promise<UsersResult> {
    try {
      if (userIds.length === 0) {
        return { ok: true, data: [] }
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("id", userIds)

      if (error) {
        console.error("Error fetching users:", error)
        return { ok: false, error: "Failed to fetch users" }
      }

      return { ok: true, data: data || [] }
    } catch (error) {
      console.error("Exception fetching users:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Search for users by name or email
   */
  static async searchUsers(query: string, limit: number = 10): Promise<UsersResult> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit)

      if (error) {
        console.error("Error searching users:", error)
        return { ok: false, error: "Failed to search users" }
      }

      return { ok: true, data: data || [] }
    } catch (error) {
      console.error("Exception searching users:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, "full_name" | "avatar_url">>,
  ): Promise<UserResult> {
    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        console.error("Error updating user profile:", error)
        return { ok: false, error: "Failed to update user profile" }
      }

      return { ok: true, data }
    } catch (error) {
      console.error("Exception updating user profile:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }
}


