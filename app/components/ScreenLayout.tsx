import React, { ReactNode } from "react"
import { ViewStyle, View } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { HeaderBar, HeaderBarProps } from "./HeaderBar"
import { Screen, ScreenProps } from "./Screen"

export interface ScreenLayoutProps extends Omit<ScreenProps, "children"> {
  /**
   * Title to display in the header
   */
  headerTitle?: string
  /**
   * Left component for the header (e.g., back button)
   */
  LeftComponent?: React.ReactNode
  /**
   * Right icon for the header
   */
  headerRightIcon?: HeaderBarProps["rightIcon"]
  /**
   * Handler for right icon press
   */
  onRightPress?: HeaderBarProps["onRightPress"]
  /**
   * Right component for the header
   */
  RightComponent?: HeaderBarProps["RightComponent"]
  /**
   * Additional header props
   */
  headerBarStyle?: ViewStyle
  /**
   * Content of the screen
   */
  children?: ReactNode
}

/**
 * A consistent layout component for main screens with a header and scrollable content
 */
export function ScreenLayout(props: ScreenLayoutProps) {
  const {
    headerTitle,
    LeftComponent,
    headerRightIcon,
    onRightPress,
    RightComponent,
    headerBarStyle,
    children,
    ...screenProps
  } = props

  const { themed } = useAppTheme()

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["bottom"]}
      {...screenProps}
      style={[themed($screenContainer), screenProps.style]}
    >
      <HeaderBar
        title={headerTitle}
        LeftComponent={LeftComponent}
        rightIcon={headerRightIcon}
        onRightPress={onRightPress}
        RightComponent={RightComponent}
        style={headerBarStyle}
      />
      <View style={themed($contentContainer)}>{children}</View>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
