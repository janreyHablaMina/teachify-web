export type SchoolPlan = "Basic" | "Pro" | "School";
export type SchoolStatus = "Active" | "Disabled";

export type Teacher = {
  id: string;
  name: string;
  email: string;
};

export type School = {
  id: string;
  name: string;
  students: number;
  quizzesGenerated: number;
  plan: SchoolPlan;
  status: SchoolStatus;
  teachers: Teacher[];
  joinedDate: string;
};
