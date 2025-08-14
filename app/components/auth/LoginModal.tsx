import React, { ComponentType, FC, useRef, useState } from "react"
import { TextInput, View, ViewStyle, TextStyle, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"
import { Text } from "../Text"
import { Button } from "../Button"
import { TextField, TextFieldAccessoryProps } from "../TextField"
import { PressableIcon } from "../Icon"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { ThemedStyle } from "@/theme/types"

interface LoginModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const LoginModal: FC<LoginModalProps> = ({ visible, onClose, onSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn } = useAuth()
  const { themed, theme } = useAppTheme()
  
  const passwordInput = useRef<TextInput>(null)

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password")
      return
    }
    
    setIsLoading(true)
    setErrorMessage("")
    
    const result = await signIn({ email, password })
    
    setIsLoading(false)
    
    if (result.success) {
      setEmail("")
      setPassword("")
      onSuccess?.()
      onClose()
    } else {
      setErrorMessage(result.error || "Failed to login. Please check your credentials.")
    }
  }
  
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = (props) => {
    return (
      <PressableIcon
        icon={isPasswordHidden ? "view" : "hidden"}
        color={theme.colors.textSecondary}
        containerStyle={props.style}
        size={20}
        onPress={() => setIsPasswordHidden(!isPasswordHidden)}
      />
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={$keyboardAvoidingView}
      >
        <View style={$modalOverlay}>
          <TouchableOpacity style={$backdrop} onPress={onClose} />
          
          <View style={themed($modalContainer)}>
            <View style={$header}>
              <Text text="Sign In" preset="heading" style={$headerText} />
              <TouchableOpacity onPress={onClose}>
                <PressableIcon icon="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            {errorMessage ? (
              <Text text={errorMessage} style={themed($errorText)} />
            ) : null}
            
            <TextField
              value={email}
              onChangeText={setEmail}
              containerStyle={$textField}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              label="Email"
              placeholder="Enter your email address"
              onSubmitEditing={() => passwordInput.current?.focus()}
            />
            
            <TextField
              ref={passwordInput}
              value={password}
              onChangeText={setPassword}
              containerStyle={$textField}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isPasswordHidden}
              label="Password"
              placeholder="Enter your password"
              onSubmitEditing={handleLogin}
              RightAccessory={PasswordRightAccessory}
            />
            
            <Button
              text="Sign In"
              style={$button}
              preset="reversed"
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const $keyboardAvoidingView: ViewStyle = {
  flex: 1,
}

const $modalOverlay: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
}

const $backdrop: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: spacing.lg,
  paddingTop: spacing.md,
  paddingBottom: spacing.xl + (Platform.OS === "ios" ? 20 : 0),
})

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
}

const $headerText: TextStyle = {
  flex: 1,
}

const $textField: ViewStyle = {
  marginBottom: 16,
}

const $button: ViewStyle = {
  marginTop: 8,
}

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  marginBottom: 16,
})

import { StyleSheet } from "react-native"
