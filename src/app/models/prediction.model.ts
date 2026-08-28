export interface CyclePrediction {
  predicted_next_start: string | null;
  fertile_window_start: string | null;
  fertile_window_end: string | null;
  average_cycle_length: number | null;
  current_phase: string | null;
  current_day: number | null;
  message?: string;
}
