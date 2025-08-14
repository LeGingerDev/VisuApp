import { FC } from "react"
import { View, ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = () => {
  const { logout } = useAuth()
  const { themed } = useAppTheme()

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top"]}>
      <View style={$container}>
        <Text text="Welcome to VisuApp" preset="heading" style={$title} />
        <Text text="You're successfully logged in!" preset="subheading" style={$subtitle} />
        
        <Button
          text="Log Out"
          style={themed($logoutButton)}
          onPress={logout}
        />
      </View>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  alignItems: "center",
  justifyContent: "center",
}

const $title: ViewStyle = {
  marginBottom: 10,
  textAlign: "center",
}

const $subtitle: ViewStyle = {
  marginBottom: 20,
  textAlign: "center",
}

const $logoutButton = ({ spacing }) => ({
  marginTop: spacing.lg,
})