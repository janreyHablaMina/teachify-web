const DEFAULT_API_BASE_URL = "/backend";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");

type JsonObject = Record<string, unknown>;
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "enumeration"
  | "matching"
  | "identification"
  | "fill_in_the_blanks"
  | "short_answer"
  | "essay";
export type QuestionGenerationOptions = {
  itemCount: number;
  difficulty: QuestionDifficulty;
  questionTypes: QuestionType[];
  questionTypeCounts?: Partial<Record<QuestionType, number>>;
};
type JoinByCodePayload = {
  join_code: string;
  join_method: "code";
  source: "code";
  ignore_invite_expiration: true;
};

function buildHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseJson(response: Response): Promise<JsonObject> {
  return response.json().catch(() => ({}));
}

export async function apiMe(token?: string): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    credentials: "include",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiRegister(payload: {
  fullname: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "teacher" | "student";
}): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiLogin(payload: {
  email: string;
  password: string;
}): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiLogout(token?: string): Promise<Response> {
  return fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    headers: buildHeaders(token),
  });
}

export async function apiGetSummaries<T = unknown>(token?: string): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/summaries`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiGetQuizzes<T = unknown>(token?: string): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiDeleteQuiz(
  token: string | undefined,
  quizId: number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiStoreQuiz(
  token: string | undefined,
  payload: JsonObject
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiStoreSummary(
  token: string | undefined,
  payload: { topic: string; content: unknown }
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/summaries`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdateAvatar(token: string | undefined, file: File) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
    method: "POST",
    headers: buildHeaders(token),
    body: formData,
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdateProfile(
  token: string | undefined,
  payload: JsonObject
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdatePassword(
  token: string | undefined,
  payload: JsonObject
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/profile/password`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiDeleteSummary(
  token: string | undefined,
  summaryId: number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/summaries/${summaryId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiConsumeGenerationUsage(
  token: string | undefined
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/generation-usage/consume`, {
    method: "POST",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiRegisterStudent(payload: {
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  join_code: string;
}): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/register-student`, {
    method: "POST",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGenerateSummary(payload: {
  prompt: string;
  task?: "summary" | "questions";
  questionOptions?: QuestionGenerationOptions;
}, options?: { signal?: AbortSignal }): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch("/api/teacher/summary", {
    method: "POST",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: options?.signal,
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGenerateQuizFromFile(payload: {
  title: string;
  file: File;
  types: string[];
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  enumerationCount?: number;
  signal?: AbortSignal;
}): Promise<{ response: Response; data: JsonObject }> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("file", payload.file);
  formData.append("types", payload.types.join(","));
  formData.append("difficulty", payload.difficulty);
  formData.append("questionCount", String(payload.questionCount));
  if (typeof payload.enumerationCount === "number") {
    formData.append("enumerationCount", String(payload.enumerationCount));
  }

  const response = await fetch("/api/teacher/quiz-generate", {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
    signal: payload.signal,
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGetClassrooms<T = unknown>(token?: string): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiGetNotifications<T = unknown>(token?: string): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiMarkNotificationRead(
  token: string | undefined,
  notificationId: string | number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiMarkAllNotificationsRead(
  token: string | undefined
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiDeleteNotification(
  token: string | undefined,
  notificationId: string | number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGetAssignments<T = unknown>(token?: string): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/assignments`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiGetAssignment<T = unknown>(
  token: string | undefined,
  assignmentId: string | number
): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiSubmitAssignment(
  token: string | undefined,
  assignmentId: string | number,
  payload: { answers: Record<string, string> }
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/submit`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiCreateAssignment(
  token: string | undefined,
  payload: {
    classroom_id: number;
    quiz_id?: number;
    deadline_at?: string | null;
    quiz_payload?: {
      title: string;
      topic?: string;
      type?: string;
      questions: Array<{
        type: string;
        question: string;
        choices?: string[];
        answer?: string;
        explanation?: string;
        points?: number;
      }>;
    };
  }
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/assignments`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdateQuizQuestions(
  token: string | undefined,
  quizId: string | number,
  payload: {
    questions: Array<{
      type: string;
      question: string;
      choices?: string[];
      answer?: string;
      explanation?: string;
      points?: number;
    }>;
  }
): Promise<{ response: Response; data: JsonObject }> {
  const request = {
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  // Preferred update route.
  let response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
    ...request,
    method: "PATCH",
  });

  // Backward-compatible fallback for servers that use PUT for updates.
  if (response.status === 404 || response.status === 405) {
    response = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}`, {
      ...request,
      method: "PUT",
    });
  }

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGetClassroom<T = unknown>(
  token: string | undefined,
  classId: string | number
): Promise<{ response: Response; data: T }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = (await parseJson(response)) as T;
  return { response, data };
}

export async function apiCreateClassroom(
  token: string | undefined,
  payload: { name: string; room?: string; schedule?: string }
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiDeleteClassroom(
  token: string | undefined,
  classId: string | number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdateInviteExpiration(
  token: string | undefined,
  classId: string | number,
  expiresAt: string | null
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}/invite-expiration`, {
    method: "PATCH",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expires_at: expiresAt }),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiJoinClassByCode(token: string | undefined, joinCode: string): Promise<{ response: Response; data: JsonObject }> {
  const payload: JoinByCodePayload = {
    join_code: joinCode,
    join_method: "code",
    source: "code",
    ignore_invite_expiration: true,
  };

  const response = await fetch(`${API_BASE_URL}/api/classrooms/join-by-code`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    // Explicitly identify this as code-based join. Backend may use this to bypass invite-link expiry checks.
    body: JSON.stringify(payload),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiApproveClassroomStudent(
  token: string | undefined,
  classId: string | number,
  studentId: string | number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}/students/${studentId}/approve`, {
    method: "POST",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiRejectClassroomStudent(
  token: string | undefined,
  classId: string | number,
  studentId: string | number
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}/students/${studentId}/reject`, {
    method: "POST",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiUpdateClassroomStudentStatus(
  token: string | undefined,
  classId: string | number,
  studentId: string | number,
  status: "pending" | "approved" | "suspended" | "rejected"
): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms/${classId}/students/${studentId}/status`, {
    method: "PATCH",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await parseJson(response);
  return { response, data };
}

export function getApiErrorMessage(
  response: Response,
  data: JsonObject,
  fallback: string
): string {
  const requestId = response.headers.get("x-railway-request-id");
  const errors = data.errors as Record<string, string[] | string> | undefined;
  const validationMessages = errors
    ? Object.values(errors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .join(" ")
    : null;

  const message =
    validationMessages ||
    (typeof data.error === "string" ? data.error : null) ||
    (typeof data.message === "string" ? data.message : null) ||
    fallback;

  return requestId ? `${message} (req: ${requestId})` : message;
}
