export type ClassMode = "regular" | "ss";

export interface ClassPeriod {
  id: string;
  subject: string;
  teacher?: string;
  room?: string;
  start: string;
  end: string;
}
