from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.participant import ParticipantResponse
from app.services import meeting_service

router = APIRouter(prefix="/meetings", tags=["participants"])


@router.get("/{meeting_id}/participants", response_model=list[ParticipantResponse])
async def list_participants(meeting_id: str, db: AsyncSession = Depends(get_db)):
    return await meeting_service.list_participants(db, meeting_id)


@router.delete("/{meeting_id}/participants/{participant_id}", status_code=204)
async def remove_participant(meeting_id: str, participant_id: int, db: AsyncSession = Depends(get_db)):
    await meeting_service.remove_participant(db, meeting_id, participant_id)
