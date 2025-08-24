import { FC, useState, useEffect } from "react"
import { ViewStyle, View, TouchableOpacity, TextStyle, ScrollView, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import { ScreenLayout } from "@/components/ScreenLayout"
import { Text } from "@/components/Text"
import { UserCard } from "@/components/UserCard"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { GroupsStackParamList } from "@/navigation/stacks/GroupsStack"
import { GroupsService, type GroupMember } from "@/services/groups"
import { UsersService, type User } from "@/services/users"
import { useAuth } from "@/context/AuthContext"

type Props = NativeStackScreenProps<GroupsStackParamList, "GroupDetails">

export const GroupDetailsScreen: FC<Props> = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const route = useRoute<Props["route"]>()
  const { group } = route.params
  const { userId } = useAuth()

  const [members, setMembers] = useState<GroupMember[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (group.id) {
      loadGroupMembers()
    }
  }, [group.id])

  const loadGroupMembers = async () => {
    setIsLoading(true)
    try {
      const result = await GroupsService.getGroupMembers(group.id)
      if (result.ok && result.data) {
        setMembers(result.data)
        
        // Extract user IDs from members to fetch user details
        const userIds = result.data.map(member => member.user_id)
        if (userIds.length > 0) {
          const usersResult = await UsersService.getUsersByIds(userIds)
          if (usersResult.ok && usersResult.data) {
            setUsers(usersResult.data)
          }
        }
      } else {
        console.error("Failed to load group members:", result.error)
      }
    } catch (error) {
      console.error("Error loading group members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleUserPress = (user: User) => {
    // Handle user press action (e.g., navigate to user profile)
    console.log("User pressed:", user)
  }

  const renderMembers = () => {
    if (isLoading) {
      return (
        <View style={themed($loadingContainer)}>
          <ActivityIndicator size="large" color={themed($loadingIndicator).color} />
          <Text preset="formHelper" text="Loading members..." style={themed($loadingText)} />
        </View>
      )
    }

    if (users.length === 0) {
      return (
        <View style={themed($emptyContainer)}>
          <Text preset="formHelper" text="No members found in this group." />
        </View>
      )
    }

    return (
      <View style={themed($membersContainer)}>
        <Text preset="formLabel" text="Group Members" style={themed($sectionHeader)} />
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onPress={handleUserPress}
            testID={`group-member-${user.id}`}
          />
        ))}
      </View>
    )
  }

  return (
    <ScreenLayout 
      headerTitle={group.group_name}
      LeftComponent={
        <TouchableOpacity style={themed($backButton)} onPress={handleBackPress}>
          <Text preset="formLabel" text="←" style={themed($backArrowText)} />
        </TouchableOpacity>
      }
      style={themed($root)}
    >
      <ScrollView 
        style={themed($scrollView)} 
        contentContainerStyle={themed($contentContainer)}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed($groupInfoContainer)}>
          <Text preset="formLabel" text="Group Info" style={themed($sectionHeader)} />
          <View style={themed($infoCard)}>
            <Text preset="formHelper" text={`Created: ${new Date(group.creation_time).toLocaleDateString()}`} />
            <Text preset="formHelper" text={`Members: ${group.member_count || 0}`} />
            <Text preset="formHelper" text={`Group ID: ${group.id}`} />
          </View>
        </View>
        
        {renderMembers()}
      </ScrollView>
    </ScreenLayout>
  )
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $backButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  minWidth: 40,
  alignItems: "center",
  justifyContent: "center",
})

const $backArrowText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
})

const $scrollView: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $groupInfoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $infoCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.backgroundSecondary,
  padding: spacing.md,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
})

const $sectionHeader: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.primary600,
  marginBottom: spacing.xs,
})

const $membersContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.xl,
})

const $loadingIndicator: ThemedStyle<{ color: string }> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.xl,
})
