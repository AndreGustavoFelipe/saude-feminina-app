export interface Symptom {
  id: number;
  name: string;
  icon: string;
}

export interface SymptomLog {
  id: number;
  user_id: number;
  symptom_id: number;
  symptom?: Symptom;
  log_date: string;
  intensity: 'leve' | 'moderado' | 'intenso';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSymptomLogDto {
  symptom_id: number;
  log_date: string;
  intensity: 'leve' | 'moderado' | 'intenso';
  notes?: string;
}

export interface UpdateSymptomLogDto {
  symptom_id?: number;
  log_date?: string;
  intensity?: 'leve' | 'moderado' | 'intenso';
  notes?: string;
}
