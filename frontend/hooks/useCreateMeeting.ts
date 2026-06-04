"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Meeting, MeetingCreate } from "@/types";

export function useCreateMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMeeting = async (payload: MeetingCreate): Promise<Meeting | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<Meeting>("/meetings", payload);
      return data;
    } catch {
      setError("Failed to create meeting.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createMeeting, loading, error };
}
