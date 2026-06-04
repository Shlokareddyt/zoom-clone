"use client";

import { useState } from "react";
import DateTimeDisplay from "@/components/dashboard/DateTimeDisplay";
import HomeActions from "@/components/dashboard/HomeActions";
import MeetingList from "@/components/dashboard/MeetingList";

export default function HomePage() {
  const [key, setKey] = useState(0);
  const refetch = () => setKey((k) => k + 1);

  return (
    <div className="flex flex-col gap-10">
      <DateTimeDisplay />
      <HomeActions onRefetch={refetch} />
      <MeetingList key={`up-${key}`} filter="upcoming" title="Upcoming Meetings" limit={5} />
      <MeetingList key={`prev-${key}`} filter="previous" title="Recent Meetings" limit={5} />
    </div>
  );
}
