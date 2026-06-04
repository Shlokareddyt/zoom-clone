"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Meeting } from "@/types";

export function useMeetings(filter?: "upcoming" | "previous") {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter ? { type: filter } : {};
      const { data } = await api.get<Meeting[]>("/meetings", { params });
      setMeetings(data);
    } catch {
      setError("Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { meetings, loading, error, refetch: fetch };
}
