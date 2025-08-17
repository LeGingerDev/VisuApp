import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"

import { RootStackParamList } from "../routes/params"
import { MainTabs } from "../tabs/MainTabs"

const Stack = createNativeStackNavigator<RootStackParamList>()

export function MainStack() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  )
}
