"use client";

import { useMeetings } from "@/hooks/useMeetings";
import MeetingCard from "@/components/meeting/MeetingCard";

interface Props {
  filter: "upcoming" | "previous";
  title: string;
  limit?: number;
}

export default function MeetingList({ filter, title, limit }: Props) {
  const { meetings, loading, error } = useMeetings(filter);
  const displayed = limit ? meetings.slice(0, limit) : meetings;

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && displayed.length === 0 && (
        <p className="text-gray-400">No meetings found.</p>
      )}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {displayed.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} variant={filter} />
        ))}
      </div>
    </section>
  );
}
