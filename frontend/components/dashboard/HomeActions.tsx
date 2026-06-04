"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";
import JoinMeetingModal from "@/components/meeting/JoinMeetingModal";
import ScheduleMeetingModal from "@/components/meeting/ScheduleMeetingModal";

const actions = [
  { label: "New Meeting", description: "Start an instant meeting", color: "bg-orange-1", icon: "📹" },
  { label: "Join Meeting", description: "via invitation link", color: "bg-blue-1", icon: "➕" },
  { label: "Schedule Meeting", description: "Plan your meeting", color: "bg-purple-1", icon: "🗓️" },
  { label: "Personal Room", description: "Use personal meeting ID", color: "bg-yellow-1", icon: "👤" },
];

export default function HomeActions({ onRefetch }: { onRefetch: () => void }) {
  const router = useRouter();
  const [modal, setModal] = useState<"new" | "join" | "schedule" | null>(null);
  const { createMeeting, loading } = useCreateMeeting();

  const handleNewMeeting = async () => {
    const meeting = await createMeeting({ title: "Instant Meeting", meeting_type: "instant" });
    if (meeting) {
      onRefetch();
      router.push(`/meeting/${meeting.id}`);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              if (action.label === "New Meeting") handleNewMeeting();
              else if (action.label === "Join Meeting") setModal("join");
              else if (action.label === "Schedule Meeting") setModal("schedule");
              else router.push("/personal-room");
            }}
            disabled={loading && action.label === "New Meeting"}
            className={`${action.color} flex min-h-[260px] flex-col justify-between rounded-[14px] p-6 text-left transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer`}
          >
            <div className="flex-center glassmorphism size-12 rounded-[10px]">
              <span className="text-2xl">{action.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{action.label}</h2>
              <p className="text-lg font-normal text-white/80">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {modal === "join" && <JoinMeetingModal onClose={() => setModal(null)} />}
      {modal === "schedule" && (
        <ScheduleMeetingModal onClose={() => setModal(null)} onCreated={onRefetch} />
      )}
    </>
  );
}
