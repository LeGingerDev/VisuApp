import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { ScreenLayout } from "@/components/ScreenLayout"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const ProfileScreen: FC = () => {
  const { themed } = useAppTheme()

  return <ScreenLayout headerTitle="Profile" style={themed($root)} />
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
