import { FC, useEffect } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"

interface SplashScreenProps extends AppStackScreenProps<"Splash"> {}

export const SplashScreen: FC<SplashScreenProps> = () => {
  // Pull in navigation via hook
  const navigation = useNavigation()
  const { isAuthenticated, isLoading } = useAuth()
  const { theme } = useAppTheme()

  // Handle initialization and navigation
  useEffect(() => {
    const initializeApp = async () => {
      // Add any additional initialization logic here
      // For example, load initial data, configure services, etc.

      // Wait a minimum time to show splash screen
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Navigate to the appropriate screen based on authentication status
      // The auth context already checks for existing sessions on load
      if (!isLoading) {
        if (isAuthenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainApp" as never }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" as never }],
          })
        }
      }
    }

    initializeApp()
  }, [isAuthenticated, isLoading, navigation])

  return (
    <Screen style={$root} preset="fixed" safeAreaEdges={["top", "bottom"]}>
      <View style={$container}>
        {/* You can add your app logo here */}
        {/* <Image source={require("@/assets/images/logo.png")} style={$logo} /> */}

        <Text text="VisuApp" preset="heading" style={$title} />
        <Text text="Your Visual App Experience" preset="subheading" style={$subtitle} />
        <ActivityIndicator size="large" color={theme.colors.primary} style={$loader} />
      </View>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
}

const $logo: ViewStyle = {
  width: 120,
  height: 120,
  marginBottom: 20,
}

const $title: ViewStyle = {
  marginBottom: 10,
  textAlign: "center",
}

const $subtitle: ViewStyle = {
  marginBottom: 30,
  textAlign: "center",
  opacity: 0.8,
}

const $loader: ViewStyle = {
  marginTop: 20,
}
