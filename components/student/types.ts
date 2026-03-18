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
}
