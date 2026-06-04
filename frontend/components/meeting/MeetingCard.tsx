"use client";

import { Meeting } from "@/types";
import { formatDate } from "@/lib/utils";
import { useClipboard } from "@/hooks/useClipboard";
import { useRouter } from "next/navigation";

interface Props {
  meeting: Meeting;
  variant: "upcoming" | "previous";
}

export default function MeetingCard({ meeting, variant }: Props) {
  const { copy, copied } = useClipboard();
  const router = useRouter();

  return (
    <div className="flex min-h-[258px] flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              meeting.status === "active"
                ? "bg-green-500/20 text-green-400"
                : meeting.status === "scheduled"
                ? "bg-blue-1/20 text-blue-1"
                : "bg-gray-600/20 text-gray-400"
            }`}
          >
            {meeting.status}
          </span>
          <span className="text-xs text-gray-500">{meeting.meeting_type}</span>
        </div>
        <h2 className="text-2xl font-bold text-white">{meeting.title}</h2>
        {meeting.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{meeting.description}</p>
        )}
        <p className="text-base font-normal text-sky-200">
          {formatDate(meeting.scheduled_at || meeting.started_at || meeting.created_at)}
        </p>
        <p className="text-sm text-gray-400">
          Host: {meeting.host_name} · {meeting.duration_min} min
          {variant === "previous" && ` · ${meeting.participant_count} participant(s)`}
        </p>
      </article>

      {variant === "upcoming" && (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/meeting/${meeting.id}`)}
            className="rounded-lg bg-blue-1 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Start
          </button>
          <button
            onClick={() => copy(meeting.invite_link)}
            className="rounded-lg bg-dark-4 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}
    </div>
  );
}
