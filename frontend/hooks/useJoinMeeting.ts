"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Participant } from "@/types";

export function useJoinMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinMeeting = async (meetingId: string, displayName: string): Promise<Participant | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<Participant>(`/meetings/${meetingId}/join`, {
        display_name: displayName,
      });
      return data;
    } catch {
      setError("Failed to join meeting.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { joinMeeting, loading, error };
}
