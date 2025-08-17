import { NavigatorScreenParams } from "@react-navigation/native"

import { MainTabsParamList } from "../tabs/MainTabs"

// Define the param lists for each navigator
export type RootStackParamList = {
  // Auth flow
  Splash: undefined
  Login: undefined

  // Main app (contains tabs)
  MainApp: NavigatorScreenParams<MainTabsParamList>
}
