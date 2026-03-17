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
  role: "teacher";
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
