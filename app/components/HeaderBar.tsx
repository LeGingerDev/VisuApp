import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { PressableIcon, IconTypes } from "./Icon"
import { Text } from "./Text"

export interface HeaderBarProps {
  /**
   * Title to display in the header
   */
  title?: string
  /**
   * Left component for the header (e.g., back button)
   */
  LeftComponent?: React.ReactNode
  /**
   * Right icon for the header
   */
  rightIcon?: IconTypes
  /**
   * Handler for right icon press
   */
  onRightPress?: () => void
  /**
   * Custom right component
   */
  RightComponent?: React.ReactNode
  /**
   * Style override for the container
   */
  style?: ViewStyle
}

/**
 * A header bar component with title on the left and optional right button
 */
export function HeaderBar(props: HeaderBarProps) {
  const { title, LeftComponent, rightIcon, onRightPress, RightComponent, style } = props
  const { themed } = useAppTheme()

  return (
    <View style={[themed($container), style]}>
      <View style={themed($leftSection)}>
        {LeftComponent && (
          <View style={themed($leftComponentContainer)}>
            {LeftComponent}
          </View>
        )}
        <Text preset="heading" text={title} style={themed($title)} />
      </View>
      <View style={themed($middleSection)} />
      <View style={themed($rightSection)}>
        {rightIcon && onRightPress ? (
          <PressableIcon icon={rightIcon} onPress={onRightPress} />
        ) : RightComponent ? (
          RightComponent
        ) : null}
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  paddingTop: 40,
  height: 90,
  backgroundColor: colors.backgroundSecondary,
})

const $leftSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
})

const $leftComponentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.sm,
})

const $middleSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "center",
})

const $rightSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "flex-end",
})

const $title: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontFamily: typography.primary.bold,
  fontSize: 20,
  color: colors.text,
})
