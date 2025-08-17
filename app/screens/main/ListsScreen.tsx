import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { ScreenLayout } from "@/components/ScreenLayout"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const ListsScreen: FC = () => {
  const { themed } = useAppTheme()

  return <ScreenLayout headerTitle="Lists" style={themed($root)} />
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
