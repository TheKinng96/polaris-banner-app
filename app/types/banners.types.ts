export interface Banner {
  id: number;
  discountId: string;
  title: string;
  source: string;
  text: string;
  theme: string;
  customThemeId?: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "PAUSED";

  // From discount
  asyncUsageCount: number;
  discountStatus: "ACTIVE" | "EXPIRED" | "SCHEDULED";
}

export interface CustomTheme {
  id: number;
  text: string;
  background: string;
}
