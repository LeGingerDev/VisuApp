import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from "@/components"
import { AddScreen } from "@/screens/main/AddScreen"
import { GroupsScreen } from "@/screens/main/GroupsScreen"
import { HomeScreen } from "@/screens/main/HomeScreen"
import { ListsScreen } from "@/screens/main/ListsScreen"
import { ProfileScreen } from "@/screens/main/ProfileScreen"
import { useAppTheme } from "@/theme/context"

export type MainTabsParamList = {
  HomeTab: undefined
  ListsTab: undefined
  AddTab: undefined
  GroupsTab: undefined
  ProfileTab: undefined
}

const Tab = createBottomTabNavigator<MainTabsParamList>()

export function MainTabs() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Icon icon="bell" color={color} />,
        }}
      />
      <Tab.Screen
        name="ListsTab"
        component={ListsScreen}
        options={{
          tabBarLabel: "Lists",
          tabBarIcon: ({ color }) => <Icon icon="view" color={color} />,
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={AddScreen}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color }) => <Icon icon="check" color={color} />,
        }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={GroupsScreen}
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color }) => <Icon icon="settings" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Icon icon="lock" color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}
