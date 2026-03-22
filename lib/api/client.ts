const DEFAULT_API_BASE_URL = "https://teachify-api-production.up.railway.app";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, "");

type JsonObject = Record<string, unknown>;

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

export async function apiGetSummaries(token?: string): Promise<{ response: Response; data: any }> {
  const response = await fetch(`${API_BASE_URL}/api/summaries`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiStoreSummary(
  token: string | undefined,
  payload: { topic: string; content: any }
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

export async function apiGenerateSummary(payload: {
  prompt: string;
  task?: "summary" | "questions";
}): Promise<{ response: Response; data: JsonObject }> {
  const response = await fetch("/api/teacher/summary", {
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

export async function apiGenerateQuizFromFile(payload: {
  title: string;
  file: File;
  types: string[];
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  enumerationCount?: number;
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
  });

  const data = await parseJson(response);
  return { response, data };
}

export async function apiGetClassrooms(token?: string): Promise<{ response: Response; data: any }> {
  const response = await fetch(`${API_BASE_URL}/api/classrooms`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const data = await parseJson(response);
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
  const response = await fetch(`${API_BASE_URL}/api/classrooms/join-by-code`, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ join_code: joinCode }),
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
    (typeof data.message === "string" ? data.message : null) ||
    fallback;

  return requestId ? `${message} (req: ${requestId})` : message;
}
