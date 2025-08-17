import { FC } from "react"
import { ViewStyle, View, TouchableOpacity, TextStyle } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import { ScreenLayout } from "@/components/ScreenLayout"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { GroupsStackParamList } from "@/navigation/stacks/GroupsStack"

type Props = NativeStackScreenProps<GroupsStackParamList, "GroupDetails">

export const GroupDetailsScreen: FC<Props> = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation()
  const route = useRoute<Props["route"]>()
  const { group } = route.params

  const handleBackPress = () => {
    navigation.goBack()
  }

  return (
    <ScreenLayout 
      headerTitle={group.group_name}
      LeftComponent={
        <TouchableOpacity style={themed($backButton)} onPress={handleBackPress}>
          <Text preset="formLabel" text="←" style={themed($backArrowText)} />
        </TouchableOpacity>
      }
      style={themed($root)}
    >
      <View style={themed($content)}>
        <Text preset="formLabel" text="Group Details Screen" />
        <Text preset="formHelper" text={`Group ID: ${group.id}`} />
        <Text preset="formHelper" text={`Created: ${new Date(group.creation_time).toLocaleDateString()}`} />
        <Text preset="formHelper" text={`Members: ${group.member_count || 0}`} />
      </View>
    </ScreenLayout>
  )
}

const $root: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $backButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  minWidth: 40,
  alignItems: "center",
  justifyContent: "center",
})

const $backArrowText: ThemedStyle<TextStyle> = () => ({
  fontSize: 24,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
})
