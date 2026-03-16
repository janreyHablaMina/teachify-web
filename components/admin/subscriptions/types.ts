export type Plan = "Free" | "Basic" | "Pro" | "School";
export type SubStatus = "Active" | "Expired";
export type BillingCycle = "Monthly" | "Yearly";
export type Section = "Free users" | "Basic users" | "Pro users" | "School plans" | "Expired subscriptions";

export type SubscriptionRow = {
  id: string;
  account: string;
  email: string;
  plan: Plan;
  status: SubStatus;
  billing: BillingCycle;
  amount: number;
  renewalDate: string;
  refunded: boolean;
};
