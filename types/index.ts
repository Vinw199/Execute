export type Category = 'Physical' | 'Professional' | 'Mental';

export interface Task {
  id: string;
  category: Category;
  title: string;
  why: string;
  goal: string;
}

export interface Task {
  id: string;
  title: string;
  why_text: string | null;
  goal_text: string | null;
  // Optional fields depending on if you fetch them or not
  user_id?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CompletedTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_date: string;
  created_at: string;
}