import { FC, memo, useCallback, useMemo } from "react"
import { StyleProp, ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import type { User } from "@/services/users"

// #region Types & Interfaces
export interface UserCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  
  /**
   * The user data to display
   */
  user: User
  
  /**
   * Optional callback when component is pressed
   */
  onPress?: (user: User) => void
  
  /**
   * Test ID for testing purposes
   */
  testID?: string
}
// #endregion

// #region Component
/**
 * UserCard - A card component for displaying user information
 * 
 * Features:
 * - Displays user's full name and email
 * - Touchable for navigation/actions
 * - Memoized for performance
 * - Follows your theme system
 */
export const UserCard: FC<UserCardProps> = memo((props) => {
  // #region Props Destructuring with Defaults
  const {
    style,
    user,
    onPress,
    testID = "userCardComponent"
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

  const _joinDate = useMemo(() => {
    return new Date(user.created_at).toLocaleDateString()
  }, [user.created_at])
  // #endregion

  // #region Event Handlers
  const _handlePress = useCallback((): void => {
    if (onPress) {
      onPress(user)
    }
  }, [onPress, user])
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
      accessibilityLabel={`User ${user.full_name}`}
    >
      <View style={themed($userHeader)}>
        <Text preset="formLabel" text={user.full_name} testID={`${testID}_name`} />
      </View>
      <Text
        preset="formHelper"
        text={user.email}
        style={themed($emailText)}
        testID={`${testID}_email`}
      />
      <Text
        preset="formHelper"
        text={`Joined: ${_joinDate}`}
        testID={`${testID}_joinDate`}
      />
    </TouchableOpacity>
  )
  // #endregion
})

// Set display name for debugging
UserCard.displayName = "UserCard"
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

const $userHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $emailText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.secondary600,
  marginBottom: 4,
})
// #endregion


