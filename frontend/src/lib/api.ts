import type {
  FormDetail,
  FormListItem,
  FormSummary,
  PublicForm,
  Question,
  ResponseDetail,
  ResponseListItem,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // no body
    }
    const message =
      (payload as { detail?: unknown })?.detail && typeof (payload as { detail?: unknown }).detail === "string"
        ? ((payload as { detail: string }).detail)
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, payload);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listForms: () => request<FormListItem[]>("/api/forms"),
  createForm: (title: string) =>
    request<FormDetail>("/api/forms", { method: "POST", body: JSON.stringify({ title }) }),
  getForm: (id: number) => request<FormDetail>(`/api/forms/${id}`),
  patchForm: (id: number, data: Partial<FormDetail>) =>
    request<FormDetail>(`/api/forms/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  saveFormFull: (id: number, data: { meta: Partial<FormDetail>; questions: Question[] }) =>
    request<FormDetail>(`/api/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...data.meta,
        questions: data.questions.map((q) => ({
          id: q.id < 0 ? undefined : q.id,
          type: q.type,
          title: q.title,
          description: q.description,
          required: q.required,
          options: q.options,
          settings: q.settings,
        })),
      }),
    }),
  saveQuestions: (id: number, questions: Question[]) =>
    request<FormDetail>(`/api/forms/${id}/questions`, {
      method: "PUT",
      body: JSON.stringify({
        questions: questions.map((q) => ({
          id: q.id < 0 ? undefined : q.id,
          type: q.type,
          title: q.title,
          description: q.description,
          required: q.required,
          options: q.options,
          settings: q.settings,
        })),
      }),
    }),
  deleteForm: (id: number) => request<void>(`/api/forms/${id}`, { method: "DELETE" }),
  duplicateForm: (id: number) => request<FormDetail>(`/api/forms/${id}/duplicate`, { method: "POST" }),
  publishForm: (id: number) => request<FormDetail>(`/api/forms/${id}/publish`, { method: "POST" }),
  unpublishForm: (id: number) => request<FormDetail>(`/api/forms/${id}/unpublish`, { method: "POST" }),
  listResponses: (id: number) => request<ResponseListItem[]>(`/api/forms/${id}/responses`),
  getResponse: (id: number, responseId: number) =>
    request<ResponseDetail>(`/api/forms/${id}/responses/${responseId}`),
  getSummary: (id: number) => request<FormSummary>(`/api/forms/${id}/summary`),
  exportCsvUrl: (id: number) => `${API_URL}/api/forms/${id}/responses/export.csv`,

  getPublicForm: (slug: string) => request<PublicForm>(`/api/public/forms/${slug}`),
  saveResponseProgress: (
    slug: string,
    payload: { response_id?: number | null; answers: { question_id: number; value: unknown }[] }
  ) =>
    request<ResponseDetail>(`/api/public/forms/${slug}/responses/progress`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  submitResponse: (
    slug: string,
    answers: { question_id: number; value: unknown }[],
    completed = true,
    responseId?: number | null
  ) =>
    request<ResponseDetail>(`/api/public/forms/${slug}/responses`, {
      method: "POST",
      body: JSON.stringify({ answers, completed, response_id: responseId ?? undefined }),
    }),

  // Contacts
  listContacts: (search?: string, formId?: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (formId) params.set("form_id", formId.toString());
    const qs = params.toString();
    return request<import("./types").Contact[]>(`/api/contacts${qs ? `?${qs}` : ""}`);
  },
  createContact: (data: { name?: string; email: string; source_form_id?: number; tags?: string[] }) =>
    request<import("./types").Contact>("/api/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  autoSyncContacts: () =>
    request<import("./types").ContactAutoSyncResult>("/api/contacts/auto-sync", { method: "POST" }),
  deleteContact: (id: number) => request<void>(`/api/contacts/${id}`, { method: "DELETE" }),

  // Automations
  listAutomations: () => request<import("./types").Automation[]>("/api/automations"),
  createAutomation: (data: import("./types").AutomationCreateInput) =>
    request<import("./types").Automation>("/api/automations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateAutomation: (id: number, data: Partial<import("./types").AutomationCreateInput>) =>
    request<import("./types").Automation>(`/api/automations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteAutomation: (id: number) => request<void>(`/api/automations/${id}`, { method: "DELETE" }),
  testAutomation: (id: number) =>
    request<import("./types").AutomationTestResult>(`/api/automations/${id}/test`, { method: "POST" }),

  // AI Assistant
  generateFormWithAI: (prompt: string) =>
    request<FormDetail>("/api/ai/generate-form", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
  getAIInsights: (formId: number, query?: string) =>
    request<import("./types").AIInsights>("/api/ai/ask-insights", {
      method: "POST",
      body: JSON.stringify({ form_id: formId, query }),
    }),
};
