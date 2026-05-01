// theme/colors.js
export const COLORS = {
  // Backgrounds - ungu muda
  bgPrimary: "#f3eeff", // latar utama ungu muda
  bgSecondary: "#ede3ff", // surface cards
  bgTertiary: "#e4d4ff", // input fields
  bgCard: "#ffffff", // kartu putih bersih

  // Purple scale
  purple50: "#f3eeff",
  purple100: "#e4d4ff",
  purple200: "#c9a9ff",
  purple300: "#ae7eff",
  purple400: "#9254fe",
  purple500: "#7c3aed", // primary
  purple600: "#6d28d9",
  purple700: "#5b21b6",
  purple800: "#4c1d95",
  purple900: "#2e1065",

  // Accents
  accent: "#7c3aed",
  accentSoft: "#ede3ff",
  accentMid: "#a855f7",
  accentLight: "#c084fc",

  // Semantic
  success: "#059669",
  successBg: "#d1fae5",
  warning: "#d97706",
  warningBg: "#fef3c7",
  danger: "#dc2626",
  dangerBg: "#fee2e2",

  // Text
  textPrimary: "#1e1b4b",
  textSecondary: "#6b5fa6",
  textMuted: "#9d8ec4",
  textWhite: "#ffffff",

  // Border
  border: "#d8c5ff",
  borderDark: "#b39ddb",

  // Priority
  prioHigh: "#dc2626",
  prioHighBg: "#fee2e2",
  prioMid: "#d97706",
  prioMidBg: "#fef3c7",
  prioLow: "#059669",
  prioLowBg: "#d1fae5",
};

export const FONTS = {
  regular: "System",
  weight: {
    normal: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
  },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
};
