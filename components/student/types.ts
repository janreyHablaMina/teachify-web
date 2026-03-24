import { Classroom } from "@/components/teacher/classes/types";

export interface StudentSession {
  id: number;
  fullname: string;
  email: string;
  role: string;
}

export interface EnrolledClassroom extends Classroom {
  teacher?: {
    id: number;
    fullname: string;
  };
  pivot?: {
    status?: "pending" | "approved" | "suspended" | "rejected";
    created_at?: string;
  };
  enrollment_status?: "pending" | "approved" | "suspended" | "rejected";
}
