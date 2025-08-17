// Dark theme palette - adjusted colors for dark mode
const palette = {
  // Base colors
  white: "#FFFFFF",
  black: "#000000",

  // Brand colors - lighter variants for dark theme
  blue: "#5A67D8", // Lighter blue for dark
  blueLight: "#9CA3FF",
  blueDark: "#4C51BF",

  purple: "#A78BFA", // Lighter purple
  purpleLight: "#C4B5FD",

  orange: "#EA580C", // Slightly muted orange
  orangeLight: "#FED7AA",

  // Dark neutrals
  gray50: "#1A1D23", // Dark background
  gray100: "#0F1117", // Darker background
  gray300: "#343A40",
  gray500: "#6C757D",
  gray700: "#CED4DA", // Light text on dark
  gray900: "#F8F9FA", // Primary text on dark

  // Status colors
  green: "#22C55E",
  greenLight: "#DCFCE7",
  red: "#EF4444",
  redLight: "#FEE2E2",

  // Overlays
  overlay20: "rgba(255, 255, 255, 0.1)",
  overlay50: "rgba(255, 255, 255, 0.2)",

  // Legacy palette values - MAPPED TO DARK EQUIVALENTS
  neutral900: "#F8F9FA", // Light text
  neutral800: "#CED4DA", // Secondary light text
  neutral700: "#6C757D", // Muted text
  neutral600: "#495057", //
  neutral500: "#6C757D", //
  neutral400: "#343A40", // Borders
  neutral300: "#495057", // Inactive elements
  neutral200: "#1A1D23", // Secondary background
  neutral100: "#0F1117", // Main background

  primary600: "#9CA3FF", // Light primary
  primary500: "#5A67D8", // Main primary
  primary400: "#6B73FF", //
  primary300: "#9CA3FF", //
  primary200: "#C7CCFF", // Light primary variant
  primary100: "#4C51BF", // Dark primary

  secondary500: "#A78BFA", // Main secondary
  secondary400: "#C4B5FD", // Light secondary
  secondary300: "#9196B9", //
  secondary200: "#626894", //
  secondary100: "#41476E", //

  accent500: "#EA580C", // Main accent
  accent400: "#FED7AA", // Light accent
  accent300: "#FDD495", //
  accent200: "#FBC878", //
  accent100: "#FFBB50", //

  angry100: "#FEE2E2",
  angry500: "#EF4444",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the semantic names below.
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
  text: palette.gray900, // Light text on dark
  textSecondary: palette.gray700, // Secondary light text
  textMuted: palette.gray500, // Muted text
  textInverse: palette.black, // Dark text on light backgrounds

  // Backgrounds
  background: palette.gray100, // Dark app background
  backgroundSecondary: palette.gray50, // Secondary dark background
  surface: palette.gray50, // Dark card/modal surfaces
  surfaceSecondary: palette.gray300, // Subtle surface variation

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
  borderSubtle: palette.gray50, // Subtle borders
  separator: palette.gray300, // Divider lines

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
