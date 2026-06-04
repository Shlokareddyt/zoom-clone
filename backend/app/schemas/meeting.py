from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict


class MeetingCreate(BaseModel):
    title: str
    description: str | None = None
    meeting_type: Literal["instant", "scheduled"] = "instant"
    scheduled_at: datetime | None = None
    duration_min: int = 60
    host_name: str = "Default User"


class MeetingResponse(BaseModel):
    id: str
    title: str
    description: str | None
    host_name: str
    status: str
    meeting_type: str
    invite_link: str
    scheduled_at: datetime | None
    duration_min: int
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime
    participant_count: int = 0
    model_config = ConfigDict(from_attributes=True)
