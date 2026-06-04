"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Meeting } from "@/types";
import MeetingRoom from "@/components/meeting/MeetingRoom";

export default function MeetingPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const startPersonalRoom = async () => {
  try {
    const { data } = await api.post("/meetings", {
      title: "Personal Meeting Room",
      description: "Personal room",
      meeting_type: "instant",
      duration_min: 60,
      host_name: "Default User",
    });
    
    router.push(`/meeting/${data.id}`);
    } catch (error) {
          console.error("Failed to create personal room:", error);
          }
  };

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Meeting>(`/meetings/${id}`);
        setMeeting(data);
      } catch {
        setError("Meeting not found or has ended.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center h-screen bg-dark-2">
        <p className="text-white text-lg">Loading meeting...</p>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex-center h-screen flex-col gap-4 bg-dark-2">
        <p className="text-red-400 text-lg">{error ?? "Meeting not found."}</p>
        <button
          onClick={startPersonalRoom}
          className="rounded-lg bg-blue-1 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go Home
        </button>
      </div>
    );
  }

  return <MeetingRoom meeting={meeting} />;
}
