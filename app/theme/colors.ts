// Reduced palette - keeping essential colors only
const palette = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",

  // Brand colors - Blue/Purple theme
  blue: "#4338CA",
  blueLight: "#C7CCFF",
  blueDark: "#3730A3",

  purple: "#8B5CF6",
  purpleLight: "#E9E5FF",

  orange: "#F97316",
  orangeLight: "#FFEDD5",

  // Neutrals
  gray50: "#F8F9FA",
  gray100: "#E9ECEF",
  gray300: "#CED4DA",
  gray500: "#6C757D",
  gray700: "#495057",
  gray900: "#212529",

  // Status colors
  green: "#16A34A",
  greenLight: "#DCFCE7",
  red: "#DC2626",
  redLight: "#FEE2E2",

  // Overlays
  overlay20: "rgba(33, 37, 41, 0.2)",
  overlay50: "rgba(33, 37, 41, 0.5)",

  // Legacy palette values - KEEPING THESE TO NOT BREAK EXISTING CODE
  neutral100: "#FFFFFF",
  neutral200: "#F8F9FA",
  neutral300: "#E9ECEF",
  neutral400: "#CED4DA",
  neutral500: "#6C757D",
  neutral600: "#495057",
  neutral700: "#343A40",
  neutral800: "#212529",
  neutral900: "#000000",

  primary100: "#C7CCFF",
  primary200: "#C7CCFF",
  primary300: "#9CA3FF",
  primary400: "#6B73FF",
  primary500: "#4338CA",
  primary600: "#3730A3",

  secondary100: "#E9E5FF",
  secondary200: "#E9E5FF",
  secondary300: "#C4B5FD",
  secondary400: "#A78BFA",
  secondary500: "#8B5CF6",

  accent100: "#FFEDD5",
  accent200: "#FFEDD5",
  accent300: "#FED7AA",
  accent400: "#FDBA74",
  accent500: "#F97316",

  angry100: "#FEE2E2",
  angry500: "#DC2626",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the semantic names below.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,

  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",

  // ===================
  // SEMANTIC COLORS - USE THESE!
  // ===================

  // Text hierarchy
  text: palette.gray900, // Primary text
  textSecondary: palette.gray700, // Secondary text
  textMuted: palette.gray500, // Muted/disabled text
  textInverse: palette.white, // Text on dark backgrounds

  // Backgrounds
  background: palette.white, // Main app background
  backgroundSecondary: palette.gray50, // Secondary background
  surface: palette.white, // Card/modal surfaces
  surfaceSecondary: palette.gray50, // Subtle surface variation

  // Interactive elements
  primary: palette.blue, // Main brand actions
  primaryPressed: palette.blueDark, // Pressed state
  primarySubtle: palette.blueLight, // Subtle primary elements

  secondary: palette.purple, // Secondary actions
  secondarySubtle: palette.purpleLight,

  accent: palette.orange, // Call-to-action elements
  accentSubtle: palette.orangeLight,

  // Borders & dividers
  border: palette.gray300, // Default borders
  borderSubtle: palette.gray100, // Subtle borders
  separator: palette.gray100, // Divider lines

  // Status & feedback
  success: palette.green,
  successBackground: palette.greenLight,
  error: palette.red,
  errorBackground: palette.redLight,

  // ===================
  // LEGACY SUPPORT - These maintain existing functionality
  // Gradually replace these with semantic names above
  // ===================

  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
} as const
