export interface Discount {
  id: string;
  title: string;
  status: "ACTIVE" | "SCHEDULED" | "EXPIRED";
  summary: string;
  asyncUsageCount: number;
}
