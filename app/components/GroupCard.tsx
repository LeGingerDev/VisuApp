import { FC, memo, useCallback, useMemo } from "react"
import { StyleProp, ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import type { Group } from "@/services/groups"

// #region Types & Interfaces
export interface GroupCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  
  /**
   * The group data to display
   */
  group: Group
  
  /**
   * Optional callback when component is pressed
   */
  onPress?: (group: Group) => void
  
  /**
   * Test ID for testing purposes
   */
  testID?: string
}
// #endregion

// #region Component
/**
 * GroupCard - A card component for displaying group information
 * 
 * Features:
 * - Displays group name, member count, and creation date
 * - Touchable for navigation
 * - Memoized for performance
 * - Follows your theme system
 */
export const GroupCard: FC<GroupCardProps> = memo((props) => {
  // #region Props Destructuring with Defaults
  const {
    style,
    group,
    onPress,
    testID = "groupCardComponent"
  } = props
  // #endregion

  // #region Hooks & Context
  const { themed } = useAppTheme()
  // #endregion

  // #region Memoized Values
  const _containerStyles = useMemo(() => [
    themed($container),
    style
  ], [themed, style])

  const _memberCountText = useMemo(() => {
    const count = group.member_count || 0
    return `${count} member${count !== 1 ? 's' : ''}`
  }, [group.member_count])

  const _creationDate = useMemo(() => {
    return new Date(group.creation_time).toLocaleDateString()
  }, [group.creation_time])
  // #endregion

  // #region Event Handlers
  const _handlePress = useCallback((): void => {
    if (onPress) {
      onPress(group)
    }
  }, [onPress, group])
  // #endregion

  // #region Render
  return (
    <TouchableOpacity 
      style={_containerStyles} 
      onPress={_handlePress}
      activeOpacity={0.7}
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Group ${group.group_name} with ${_memberCountText}`}
    >
      <View style={themed($groupHeader)}>
        <Text preset="formLabel" text={group.group_name} testID={`${testID}_title`} />
        <View style={themed($memberCountBadge)}>
          <Text 
            preset="formHelper" 
            text={_memberCountText}
            style={themed($memberCountText)}
            testID={`${testID}_memberCount`}
          />
        </View>
      </View>
      <Text
        preset="formHelper"
        text={`Created: ${_creationDate}`}
        testID={`${testID}_creationDate`}
      />
    </TouchableOpacity>
  )
  // #endregion
})

// Set display name for debugging
GroupCard.displayName = "GroupCard"
// #endregion

// #region Styles
const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.backgroundSecondary,
  padding: spacing.md,
  borderRadius: 8,
  marginBottom: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
})

const $groupHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $memberCountBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 12,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxs,
})

const $memberCountText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
  fontSize: 12,
})
// #endregion