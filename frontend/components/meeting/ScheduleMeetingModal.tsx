"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateMeeting } from "@/hooks/useCreateMeeting";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function ScheduleMeetingModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMin, setDurationMin] = useState(60);
  const { createMeeting, loading } = useCreateMeeting();

  const handleSubmit = async () => {
    if (!title.trim() || !scheduledAt) return;
    const meeting = await createMeeting({
      title: title.trim(),
      description: description || undefined,
      meeting_type: "scheduled",
      scheduled_at: new Date(scheduledAt).toISOString(),
      duration_min: durationMin,
    });
    if (meeting) {
      onCreated();
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-dark-3 border-dark-4 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Schedule Meeting</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Meeting title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-dark-4 border-dark-4 text-white placeholder:text-gray-500"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-dark-4 border-dark-4 text-white placeholder:text-gray-500"
          />
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="bg-dark-4 border-dark-4 text-white"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400 whitespace-nowrap">Duration (min):</label>
            <Input
              type="number"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              className="bg-dark-4 border-dark-4 text-white w-24"
              min={15}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onClose} className="text-white">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-purple-1 hover:bg-purple-1/90"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
