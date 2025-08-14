import React, { ComponentType, FC, useRef, useState } from "react"
import { TextInput, View, ViewStyle, TextStyle, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"
import { Text } from "../Text"
import { Button } from "../Button"
import { TextField, TextFieldAccessoryProps } from "../TextField"
import { PressableIcon } from "../Icon"
import { useAppTheme } from "@/theme/context"
import { useAuth } from "@/context/AuthContext"
import { ThemedStyle } from "@/theme/types"

interface SignUpModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const SignUpModal: FC<SignUpModalProps> = ({ visible, onClose, onSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { signUp } = useAuth()
  const { themed, theme } = useAppTheme()
  
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)
  const displayNameInput = useRef<TextInput>(null)

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !displayName) {
      setErrorMessage("Please fill in all fields")
      return false
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address")
      return false
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      return false
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return false
    }
    
    return true
  }

  const handleSignUp = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrorMessage("")
    
    const result = await signUp({ email, password, displayName })
    
    setIsLoading(false)
    
    if (result.success) {
      // Clear form
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setDisplayName("")
      onSuccess?.()
      onClose()
    } else {
      setErrorMessage(result.error || "Failed to create account. Please try again.")
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
  
  const ConfirmPasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = (props) => {
    return (
      <PressableIcon
        icon={isConfirmPasswordHidden ? "view" : "hidden"}
        color={theme.colors.textSecondary}
        containerStyle={props.style}
        size={20}
        onPress={() => setIsConfirmPasswordHidden(!isConfirmPasswordHidden)}
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
              <Text text="Create Account" preset="heading" style={$headerText} />
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
              autoComplete="password-new"
              autoCorrect={false}
              secureTextEntry={isPasswordHidden}
              label="Password"
              placeholder="Create a password"
              onSubmitEditing={() => confirmPasswordInput.current?.focus()}
              RightAccessory={PasswordRightAccessory}
            />
            
            <TextField
              ref={confirmPasswordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              containerStyle={$textField}
              autoCapitalize="none"
              autoComplete="password-new"
              autoCorrect={false}
              secureTextEntry={isConfirmPasswordHidden}
              label="Confirm Password"
              placeholder="Confirm your password"
              onSubmitEditing={() => displayNameInput.current?.focus()}
              RightAccessory={ConfirmPasswordRightAccessory}
            />
            
            <TextField
              ref={displayNameInput}
              value={displayName}
              onChangeText={setDisplayName}
              containerStyle={$textField}
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect={false}
              label="Display Name"
              placeholder="Enter your display name"
              onSubmitEditing={handleSignUp}
            />
            
            <Button
              text="Create Account"
              style={$button}
              preset="reversed"
              onPress={handleSignUp}
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
