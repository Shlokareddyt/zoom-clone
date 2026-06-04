"use client";

import { useClipboard } from "@/hooks/useClipboard";
import { PERSONAL_ROOM_ID } from "@/constants";
import { useRouter } from "next/navigation";

export default function PersonalRoomPage() {
  const { copy, copied } = useClipboard();
  const router = useRouter();
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/meeting/${PERSONAL_ROOM_ID}`;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-white">Personal Meeting Room</h1>
      <div className="rounded-[14px] bg-dark-1 p-8 flex flex-col gap-6 max-w-2xl">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400 uppercase tracking-wide">Personal Meeting ID</p>
          <p className="text-2xl font-bold text-white font-mono">{PERSONAL_ROOM_ID}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400 uppercase tracking-wide">Invite Link</p>
          <p className="text-sm text-sky-300 break-all">{link}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/meeting/${PERSONAL_ROOM_ID}`)}
            className="rounded-lg bg-blue-1 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Start Meeting
          </button>
          <button
            onClick={() => copy(link)}
            className="rounded-lg bg-dark-4 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
