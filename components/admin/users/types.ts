export type UserPlan = "Free" | "Basic" | "Pro" | "School";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  plan: UserPlan;
  quizzesGenerated: number;
  status: "Active";
  joinedDate: string;
};
