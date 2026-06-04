"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { avatarImages } from "@/constants";
import api from "@/lib/api";
import { Meeting } from "@/types";

const mockParticipants = [
  { name: "Default User", isSelf: true },
  { name: "Alice Johnson", isSelf: false },
  { name: "Bob Smith", isSelf: false },
  { name: "Carol White", isSelf: false },
];

interface Props {
  meeting: Meeting;
}

export default function MeetingRoom({ meeting }: Props) {
  const router = useRouter();
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [ending, setEnding] = useState(false);

  const handleEnd = async () => {
    setEnding(true);
    try {
      await api.post(`/meetings/${meeting.id}/end`);
    } catch {
      // ignore
    }
    router.push("/");
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-dark-2">
      {/* Header */}
      <div className="flex-between bg-dark-1 px-6 py-3">
        <h2 className="text-lg font-semibold text-white truncate max-w-xs">{meeting.title}</h2>
        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
          LIVE
        </span>
      </div>

      {/* Video grid */}
      <div className="flex-1 grid grid-cols-2 gap-3 p-4 lg:grid-cols-2">
        {mockParticipants.map((p, i) => (
          <div
            key={p.name}
            className="relative flex flex-col items-center justify-center rounded-[14px] bg-dark-3 min-h-[180px]"
          >
            <img
              src={avatarImages[i % avatarImages.length]}
              alt={p.name}
              className="h-16 w-16 rounded-full"
            />
            <p className="mt-2 text-sm text-white font-medium">{p.name}</p>
            {p.isSelf && muted && (
              <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                Muted
              </span>
            )}
            {p.isSelf && videoOff && (
              <span className="absolute top-2 left-2 text-xs bg-gray-600 text-white px-2 py-0.5 rounded-full">
                No Video
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Participants panel */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-16 w-64 bg-dark-1 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">
            Participants ({meeting.participant_count || mockParticipants.length})
          </h3>
          {mockParticipants.map((p) => (
            <div key={p.name} className="flex items-center gap-2 py-2 border-b border-dark-3">
              <div className="h-8 w-8 rounded-full bg-dark-4 flex-center text-white text-xs font-bold">
                {p.name[0]}
              </div>
              <span className="text-sm text-white">{p.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex-center gap-4 bg-dark-1 px-6 py-4">
        <ControlButton
          active={muted}
          onClick={() => setMuted(!muted)}
          icon={muted ? "🔇" : "🎙️"}
          label={muted ? "Unmute" : "Mute"}
        />
        <ControlButton
          active={videoOff}
          onClick={() => setVideoOff(!videoOff)}
          icon={videoOff ? "📷" : "📹"}
          label={videoOff ? "Start Video" : "Stop Video"}
        />
        <ControlButton
          active={sharing}
          onClick={() => setSharing(!sharing)}
          icon="🖥️"
          label={sharing ? "Stop Share" : "Share Screen"}
        />
        <ControlButton
          active={showParticipants}
          onClick={() => setShowParticipants(!showParticipants)}
          icon="👥"
          label="Participants"
        />
        <button
          onClick={handleEnd}
          disabled={ending}
          className="flex flex-col items-center gap-1 rounded-lg bg-red-500 px-5 py-3 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <span className="text-xl">📵</span>
          <span className="text-xs">End Call</span>
        </button>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg px-4 py-3 transition-colors ${
        active ? "bg-dark-4 text-white" : "bg-dark-3 text-gray-300 hover:bg-dark-4"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
