export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  host_name: string;
  status: "scheduled" | "active" | "ended";
  meeting_type: "instant" | "scheduled";
  invite_link: string;
  scheduled_at: string | null;
  duration_min: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  participant_count: number;
}

export interface Participant {
  id: number;
  meeting_id: string;
  display_name: string;
  joined_at: string;
  left_at: string | null;
}

export interface MeetingCreate {
  title: string;
  description?: string;
  meeting_type: "instant" | "scheduled";
  scheduled_at?: string;
  duration_min?: number;
  host_name?: string;
}

export interface JoinRequest {
  display_name: string;
}
