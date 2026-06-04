"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onClose: () => void;
}

export default function JoinMeetingModal({ onClose }: Props) {
  const [meetingId, setMeetingId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!meetingId.trim()) return;
    router.push(`/meeting/${meetingId.trim()}`);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-dark-3 border-dark-4 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Join Meeting</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-gray-400 text-sm">Enter the meeting ID or paste an invite link.</p>
          <Input
            placeholder="Meeting ID (e.g. abc-1234-xyz)"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="bg-dark-4 border-dark-4 text-white placeholder:text-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onClose} className="text-white">
              Cancel
            </Button>
            <Button onClick={handleJoin} className="bg-blue-1 hover:bg-blue-1/90">
              Join Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
