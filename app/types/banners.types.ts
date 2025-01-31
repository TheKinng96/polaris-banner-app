export interface Banner {
  id: number;
  discountId: string;
  title: string;
  text: string;
  theme: ThemeColor[]; // Array to follow ChoiceList format but in reality only one theme can be selected
  customThemeId?: string;
  createdAt: string;
  updatedAt: string;
  status: BannerStatus;

  // From discount
  asyncUsageCount: number;
  discountStatus: "ACTIVE" | "EXPIRED" | "SCHEDULED";
  themeDetails?: ThemeDetails;
}

export type ThemeColor = "info" | "success" | "warn" | "danger" | "custom";

export type BannerStatus = "ACTIVE" | "PAUSED";

export interface ThemeDetails {
  text: string;
  background: string;
}

export interface CustomTheme extends ThemeDetails {
  id: number;
}

export const defaultColors = {
  info: {
    text: "rgba(48, 48, 48, 1)",
    background: "rgba(81, 192, 255, 1)",
  },
  success: {
    text: "rgba(48, 48, 48, 1)",
    background: "rgba(4, 123, 93, 1)",
  },
  warn: {
    text: "rgba(48, 48, 48, 1)",
    background: "rgba(255, 184, 0, 1)",
  },
  danger: {
    text: "rgba(48, 48, 48, 1)",
    background: "rgba(255, 0, 0, 1)",
  },
} as Record<ThemeColor, ThemeDetails>;
