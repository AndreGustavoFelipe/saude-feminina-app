export interface MenstrualCycle {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
