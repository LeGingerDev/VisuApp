import React, { FC } from "react"
import { ViewStyle } from "react-native"

import { ScreenLayout } from "@/components/ScreenLayout"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const AddScreen: FC = () => {
  const { themed } = useAppTheme()

  return <ScreenLayout headerTitle="Add" style={themed($root)} />
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
