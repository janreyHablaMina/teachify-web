export type SystemMetric = {
  label: string;
  value: string;
  note: string;
};

export type SystemAlert = {
  title: string;
  detail: string;
  tone: "warn" | "high";
};
