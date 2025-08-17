import { supabase } from "../supabase/supabaseClient"

export interface Group {
  id: string
  group_name: string
  creator_id: string
  creation_time: string
  member_count?: number
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  role: string
  joined_at: string
}

export interface CreateGroupData {
  group_name: string
  creator_id: string
}

export interface GroupsResult {
  ok: boolean
  data?: Group[]
  error?: string
}

export interface CreateGroupResult {
  ok: boolean
  data?: Group
  error?: string
}

export interface GroupMembersResult {
  ok: boolean
  data?: GroupMember[]
  error?: string
}

/**
 * Service for managing groups in the database
 */
export class GroupsService {
  /**
   * Get all groups where the user is a member (including groups they created)
   */
  static async getUserGroups(userId: string): Promise<GroupsResult> {
    try {
      // First, try to get groups where the user is the creator
      const { data: createdGroups, error: creatorError } = await supabase
        .from("groups")
        .select("*")
        .eq("creator_id", userId)
      
      if (creatorError) {
        console.error("Error fetching created groups:", creatorError)
      }
      
      // Then, get groups where the user is a member
      const { data: membershipData, error: membershipError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId)
        
      if (membershipError) {
        console.error("Error fetching user group memberships:", membershipError)
        return { 
          ok: false, 
          error: "Failed to fetch group memberships",
          data: createdGroups || [] // Return created groups if available
        }
      }
      
      // Get the unique group IDs from memberships
      const memberGroupIds = membershipData?.map(m => m.group_id) || []
      
      // If user is a member of any groups, fetch those groups
      let memberGroups: Group[] = []
      if (memberGroupIds.length > 0) {
        const { data: groups, error: groupsError } = await supabase
          .from("groups")
          .select("*")
          .in("id", memberGroupIds)
          
        if (groupsError) {
          console.error("Error fetching member groups:", groupsError)
        } else {
          memberGroups = groups || []
        }
      }
      
      // Combine and deduplicate groups
      const allGroups = [...(createdGroups || []), ...memberGroups]
      const uniqueGroups = allGroups.filter((group, index, self) => 
        index === self.findIndex(g => g.id === group.id)
      )
      
      // Get member counts for all groups efficiently
      const groupIds = uniqueGroups.map(g => g.id)
      if (groupIds.length > 0) {
        const { data: memberCounts, error: countError } = await supabase
          .from("group_members")
          .select("group_id")
          .in("group_id", groupIds)
        
        if (!countError && memberCounts) {
          // Count members per group
          const countMap = new Map<string, number>()
          memberCounts.forEach(member => {
            countMap.set(member.group_id, (countMap.get(member.group_id) || 0) + 1)
          })
          
          // Add member counts to groups
          uniqueGroups.forEach(group => {
            group.member_count = countMap.get(group.id) || 0
          })
        }
      }
      
      return { ok: true, data: uniqueGroups }
    } catch (error) {
      console.error("Exception fetching user groups:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Create a new group and add the creator as an admin member
   * Note: This requires the RLS policy to be fixed to allow group creation
   */
  static async createGroup(groupData: CreateGroupData): Promise<CreateGroupResult> {
    try {
      // First create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert([groupData])
        .select()
        .single()

      if (groupError) {
        console.error("Error creating group:", groupError)
        return { ok: false, error: "Failed to create group" }
      }

      // Then add the creator as an admin member
      const { error: memberError } = await supabase.from("group_members").insert([
        {
          group_id: group.id,
          user_id: groupData.creator_id,
          role: "admin",
          joined_at: new Date().toISOString(),
        },
      ])

      if (memberError) {
        console.error("Error adding creator as group member:", memberError)
        // Group was created but member addition failed
        // You might want to delete the group here or handle this case
        return { ok: false, error: "Group created but failed to add member" }
      }

      return { ok: true, data: group }
    } catch (error) {
      console.error("Exception creating group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Get a group by ID (only if user is a member)
   */
  static async getGroupById(groupId: string): Promise<CreateGroupResult> {
    try {
      const { data, error } = await supabase.from("groups").select("*").eq("id", groupId).single()

      if (error) {
        console.error("Error fetching group:", error)
        return { ok: false, error: "Failed to fetch group" }
      }

      return { ok: true, data }
    } catch (error) {
      console.error("Exception fetching group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Get all members of a group (only if user is a member of the group)
   */
  static async getGroupMembers(groupId: string): Promise<GroupMembersResult> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          *,
          users!inner(id, full_name, email)
        `,
        )
        .eq("group_id", groupId)

      if (error) {
        console.error("Error fetching group members:", error)
        return { ok: false, error: "Failed to fetch group members" }
      }

      return { ok: true, data: data || [] }
    } catch (error) {
      console.error("Exception fetching group members:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Add a user to a group (only if current user is a member of the group)
   */
  static async addUserToGroup(
    groupId: string,
    userId: string,
    role: string = "member",
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("group_members").insert([
        {
          group_id: groupId,
          user_id: userId,
          role,
          joined_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error adding user to group:", error)
        return { ok: false, error: "Failed to add user to group" }
      }

      return { ok: true }
    } catch (error) {
      console.error("Exception adding user to group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Remove a user from a group (only if current user is an admin)
   */
  static async removeUserFromGroup(
    groupId: string,
    userId: string,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId)

      if (error) {
        console.error("Error removing user from group:", error)
        return { ok: false, error: "Failed to remove user from group" }
      }

      return { ok: true }
    } catch (error) {
      console.error("Exception removing user from group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Update a group (only if user is creator or admin)
   */
  static async updateGroup(
    groupId: string,
    updates: Partial<Pick<Group, "group_name">>,
  ): Promise<CreateGroupResult> {
    try {
      const { data, error } = await supabase
        .from("groups")
        .update(updates)
        .eq("id", groupId)
        .select()
        .single()

      if (error) {
        console.error("Error updating group:", error)
        return { ok: false, error: "Failed to update group" }
      }

      return { ok: true, data }
    } catch (error) {
      console.error("Exception updating group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Delete a group (only if user is creator or admin)
   */
  static async deleteGroup(groupId: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("groups").delete().eq("id", groupId)

      if (error) {
        console.error("Error deleting group:", error)
        return { ok: false, error: "Failed to delete group" }
      }

      return { ok: true }
    } catch (error) {
      console.error("Exception deleting group:", error)
      return { ok: false, error: "An unexpected error occurred" }
    }
  }

  /**
   * Check if a user can access a group (is a member)
   */
  static async canUserAccessGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single()

      if (error) {
        return false
      }

      return !!data
    } catch (error) {
      return false
    }
  }

  /**
   * Check if a user is an admin of a group
   */
  static async isUserGroupAdmin(userId: string, groupId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single()

      if (error) {
        return false
      }

      return data?.role === "admin"
    } catch (error) {
      return false
    }
  }
}
