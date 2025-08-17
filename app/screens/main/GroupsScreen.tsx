import { FC, useState, useEffect } from "react"
import { ViewStyle, View, Alert, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Button } from "@/components/Button"
import { CreateGroupModal } from "@/components/groups"
import { GroupCard } from "@/components/GroupCard"
import { ScreenLayout } from "@/components/ScreenLayout"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { GroupsService, type Group } from "@/services/groups"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { GroupsStackParamList } from "@/navigation/stacks/GroupsStack"

type NavigationProp = NativeStackNavigationProp<GroupsStackParamList, "Groups">

export const GroupsScreen: FC = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NavigationProp>()
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { userId } = useAuth()

  useEffect(() => {
    if (userId) {
      loadGroups()
    }
  }, [userId])

  const loadGroups = async () => {
    setIsLoading(true)
    try {
      const result = await GroupsService.getUserGroups(userId!)
      if (result.ok && result.data) {
        setGroups(result.data)
      } else {
        console.error("Failed to load groups:", result.error)
        // Don't show error to user for now, just log it
      }
    } catch (error) {
      console.error("Error loading groups:", error)
      // Don't show error to user for now, just log it
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGroup = async (groupName: string) => {
    try {
      const result = await GroupsService.createGroup({
        group_name: groupName,
        creator_id: userId!,
      })

      if (result.ok && result.data) {
        setGroups([result.data, ...groups])
        Alert.alert("Success", "Group created successfully!")
      } else {
        Alert.alert("Error", result.error || "Failed to create group")
      }
    } catch (error) {
      console.error("Error creating group:", error)
      Alert.alert("Error", "An unexpected error occurred")
    }
  }

  const handleOpenCreateModal = () => {
    setIsCreateModalVisible(true)
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false)
  }

  const handleGroupPress = (group: Group) => {
    navigation.navigate("GroupDetails", { group })
  }

  const NewGroupButton = () => (
    <Button
      text="+ New"
      preset="filled"
      onPress={handleOpenCreateModal}
      style={themed($newButton)}
    />
  )

  const renderGroupsList = () => {
    if (isLoading) {
      return (
        <View style={themed($content)}>
          <Text preset="formHelper" text="Loading groups..." />
        </View>
      )
    }

    if (groups.length === 0) {
      return (
        <View style={themed($content)}>
          <Text
            preset="formHelper"
            text="No groups created yet. Tap '+ New' to create your first group!"
          />
        </View>
      )
    }

    // Separate groups into created and joined
    const createdGroups = groups.filter(group => group.creator_id === userId)
    const joinedGroups = groups.filter(group => group.creator_id !== userId)

    return (
      <View style={themed($groupsList)}>
        {/* Groups I Made Section */}
        {createdGroups.length > 0 && (
          <View style={themed($sectionContainer)}>
            <Text preset="formLabel" text="Groups I Made" style={themed($sectionHeader)} />
            {createdGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={handleGroupPress}
                testID={`created-group-${group.id}`}
              />
            ))}
          </View>
        )}

        {/* Divider between sections */}
        {createdGroups.length > 0 && joinedGroups.length > 0 && (
          <View style={themed($sectionDivider)} />
        )}

        {/* Groups I Joined Section */}
        {joinedGroups.length > 0 && (
          <View style={themed($sectionContainer)}>
            <Text preset="formLabel" text="Groups I Joined" style={themed($sectionHeader)} />
            {joinedGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onPress={handleGroupPress}
                testID={`joined-group-${group.id}`}
              />
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <>
      <ScreenLayout headerTitle="Groups" RightComponent={<NewGroupButton />} style={themed($root)}>
        {renderGroupsList()}
      </ScreenLayout>

      <CreateGroupModal
        visible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        onCreateGroup={handleCreateGroup}
      />
    </>
  )
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $newButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  minHeight: 36,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
})

const $groupsList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
})

const $sectionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $sectionHeader: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.primary600,
  marginBottom: spacing.xs,
})

const $sectionDivider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.palette.neutral300,
  marginVertical: spacing.md,
})
