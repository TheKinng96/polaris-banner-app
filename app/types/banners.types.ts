export interface Banner {
  id: number;
  discountId: string;
  title: string;
  source: string;
  text: string;
  theme: ThemeColor[]; // Array to follow ChoiceList format but in reality only one theme can be selected
  customThemeId?: string;
  createdAt: string;
  updatedAt: string;
  status: BannerStatus;

  // From discount
  asyncUsageCount: number;
  discountStatus: "ACTIVE" | "EXPIRED" | "SCHEDULED";
}

export type ThemeColor = "info" | "success" | "warn" | "danger" | "custom";

export type BannerStatus = "ACTIVE" | "PAUSED";

export interface CustomTheme {
  id: number;
  text: string;
  background: string;
}
