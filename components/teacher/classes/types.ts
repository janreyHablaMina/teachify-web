export type Student = {
  id: number;
  fullname: string;
  email: string;
  enrolled_at: string;
  avatar_url?: string;
  enrollment_status?: "pending" | "approved" | "suspended" | "rejected";
};

export type Classroom = {
  id: number;
  name: string;
  room: string;
  schedule: string;
  join_code: string;
  students_count: number;
  is_active: boolean;
  students?: Student[];
};
