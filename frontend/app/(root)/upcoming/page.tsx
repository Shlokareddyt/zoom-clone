import MeetingList from "@/components/dashboard/MeetingList";

export default function UpcomingPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-white">Upcoming Meetings</h1>
      <MeetingList filter="upcoming" title="" />
    </div>
  );
}
