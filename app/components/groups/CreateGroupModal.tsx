import { useState } from "react"
import { Modal, View, ViewStyle, TextStyle, KeyboardAvoidingView, Platform } from "react-native"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface CreateGroupModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean
  /**
   * Callback when the modal should be closed
   */
  onClose: () => void
  /**
   * Callback when a group is created
   */
  onCreateGroup: (groupName: string) => void
}

/**
 * Modal for creating a new group
 */
export function CreateGroupModal(props: CreateGroupModalProps) {
  const { visible, onClose, onCreateGroup } = props
  const [groupName, setGroupName] = useState("")
  const { themed } = useAppTheme()

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      onCreateGroup(groupName.trim())
      setGroupName("")
      onClose()
    }
  }

  const handleClose = () => {
    setGroupName("")
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={themed($overlay)}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={themed($modalContainer)}>
          <View style={themed($header)}>
            <Text preset="heading" text="Create New Group" style={themed($title)} />
          </View>

          <View style={themed($content)}>
            <TextField
              label="Group Name"
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreateGroup}
            />
          </View>

          <View style={themed($footer)}>
            <Button
              text="Cancel"
              preset="default"
              onPress={handleClose}
              style={themed($cancelButton)}
            />
            <Button
              text="Create Group"
              preset="filled"
              onPress={handleCreateGroup}
              disabled={!groupName.trim()}
              style={themed($createButton)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const $overlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay50,
  justifyContent: "center",
  alignItems: "center",
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 12,
  padding: spacing.lg,
  margin: spacing.lg,
  minWidth: 300,
  maxWidth: 400,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  alignItems: "center",
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $cancelButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $createButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
