from datetime import datetime
from pydantic import BaseModel, ConfigDict


class JoinRequest(BaseModel):
    display_name: str


class ParticipantResponse(BaseModel):
    id: int
    meeting_id: str
    display_name: str
    joined_at: datetime
    left_at: datetime | None
    model_config = ConfigDict(from_attributes=True)
