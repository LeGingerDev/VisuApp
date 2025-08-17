import { FC, useState } from "react"
import { Image, TextStyle, View, ViewStyle } from "react-native"

import { LoginModal } from "@/components/auth/LoginModal"
import { SignUpModal } from "@/components/auth/SignUpModal"
import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false)
  const [signUpModalVisible, setSignUpModalVisible] = useState(false)

  const { themed } = useAppTheme()

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$logoContainer}>
        {/* Replace with your app logo */}
        {/* <Image source={require("@/assets/images/logo.png")} style={$logo} /> */}
        <Text text="VisuApp" preset="heading" style={$appTitle} />
      </View>

      <View style={$welcomeContainer}>
        <Text text="Welcome" preset="heading" style={$welcomeText} />
        <Text text="Create visualizations with ease" preset="subheading" style={$subtitleText} />
      </View>

      <View style={$buttonContainer}>
        <Button
          text="Sign In"
          style={themed($signInButton)}
          preset="reversed"
          onPress={() => setLoginModalVisible(true)}
        />

        <Button
          text="Create Account"
          style={themed($createAccountButton)}
          preset="default"
          onPress={() => setSignUpModalVisible(true)}
        />
      </View>

      <LoginModal visible={loginModalVisible} onClose={() => setLoginModalVisible(false)} />

      <SignUpModal visible={signUpModalVisible} onClose={() => setSignUpModalVisible(false)} />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-between",
})

const $logoContainer: ViewStyle = {
  alignItems: "center",
  marginTop: 40,
}

const $logo: ViewStyle = {
  width: 120,
  height: 120,
  marginBottom: 16,
}

const $appTitle: TextStyle = {
  fontSize: 32,
}

const $welcomeContainer: ViewStyle = {
  alignItems: "center",
  marginTop: 40,
}

const $welcomeText: TextStyle = {
  fontSize: 28,
  textAlign: "center",
  marginBottom: 8,
}

const $subtitleText: TextStyle = {
  textAlign: "center",
  marginBottom: 24,
  opacity: 0.8,
}

const $buttonContainer: ViewStyle = {
  marginTop: 40,
}

const $signInButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $createAccountButton: ThemedStyle<ViewStyle> = () => ({
  // Styles for the create account button
})
