import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import { GroupsScreen } from "@/screens/main/GroupsScreen"
import { GroupDetailsScreen } from "@/screens/main/GroupDetailsScreen"
import type { Group } from "@/services/groups"

export type GroupsStackParamList = {
  Groups: undefined
  GroupDetails: { group: Group }
}

const Stack = createNativeStackNavigator<GroupsStackParamList>()

export function GroupsStack() {
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
      <Stack.Screen name="Groups" component={GroupsScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
    </Stack.Navigator>
  )
}
