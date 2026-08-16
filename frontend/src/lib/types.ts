export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export type FormStatus = "draft" | "published";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionSettings {
  placeholder?: string;
  min?: number;
  max?: number;
  multiple?: boolean;
  media_url?: string;
  toon_id?: string;
  [key: string]: unknown;
}

export interface Question {
  id: number;
  form_id?: number;
  type: QuestionType;
  title: string;
  description?: string | null;
  required: boolean;
  order_index: number;
  options?: QuestionOption[] | null;
  settings?: QuestionSettings | null;
}

/** A question that may not exist on the server yet (client-generated negative id). */
export interface DraftQuestion extends Omit<Question, "id"> {
  id: number;
  isNew?: boolean;
}

export interface FormSummaryFields {
  id: number;
  title: string;
  description?: string | null;
  status: FormStatus;
  share_slug: string;
  workspace_id?: string;
  welcome_title?: string | null;
  welcome_description?: string | null;
  thank_you_message?: string | null;
  theme_color?: string | null;
  theme_background?: string | null;
  response_limit?: number | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface FormListItem extends FormSummaryFields {
  response_count: number;
  question_count: number;
}

export interface FormDetail extends FormSummaryFields {
  questions: Question[];
}

export interface PublicForm {
  id: number;
  title: string;
  description?: string | null;
  share_slug: string;
  welcome_title?: string | null;
  welcome_description?: string | null;
  thank_you_message?: string | null;
  theme_color?: string | null;
  theme_background?: string | null;
  questions: Question[];
}

export interface AnswerOut {
  question_id: number;
  value: unknown;
  value_text?: string | null;
}

export interface ResponseListItem {
  id: number;
  started_at: string;
  submitted_at?: string | null;
  completed: boolean;
  answer_count: number;
}

export interface ResponseDetail {
  id: number;
  form_id: number;
  started_at: string;
  submitted_at?: string | null;
  completed: boolean;
  answers: AnswerOut[];
}

export interface QuestionSummary {
  question_id: number;
  type: QuestionType;
  title: string;
  response_count: number;
  counts?: Record<string, number> | null;
  average?: number | null;
  sample_answers?: string[] | null;
}

export interface FormSummary {
  form_id: number;
  total_responses: number;
  completed_responses: number;
  completion_rate: number;
  questions: QuestionSummary[];
}

export interface ApiValidationError {
  question_id: number;
  message: string;
}

export interface Contact {
  id: number;
  name?: string | null;
  email: string;
  source_form_id?: number | null;
  source_form_title?: string | null;
  submissions_count: number;
  tags?: string[] | null;
  last_active_at: string;
  created_at: string;
}

export interface ContactAutoSyncResult {
  synced_count: number;
  new_contacts: number;
  updated_contacts: number;
  message: string;
}

export interface Automation {
  id: number;
  name: string;
  trigger_type: string;
  form_id?: number | null;
  form_title?: string | null;
  condition_type: string;
  condition_value?: string | null;
  action_type: string;
  action_config?: Record<string, unknown> | null;
  is_active: boolean;
  execution_count: number;
  last_executed_at?: string | null;
  created_at: string;
}

export interface AutomationCreateInput {
  name: string;
  trigger_type: string;
  form_id?: number | null;
  condition_type: string;
  condition_value?: string | null;
  action_type: string;
  action_config?: Record<string, unknown> | null;
  is_active?: boolean;
}

export interface AutomationTestResult {
  success: boolean;
  status_code?: number | null;
  message: string;
  executed_at: string;
}

export interface AIInsights {
  form_id: number;
  form_title: string;
  total_responses: number;
  sentiment_score: number;
  sentiment_label: string;
  executive_summary: string;
  key_findings: string[];
  top_quotes: string[];
  action_recommendations: string[];
}
