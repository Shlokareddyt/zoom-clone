from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.meeting import MeetingCreate, MeetingResponse
from app.schemas.participant import JoinRequest, ParticipantResponse
from app.services import meeting_service

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.get("", response_model=list[MeetingResponse])
async def list_meetings(
    type: str | None = Query(None, description="upcoming | previous"),
    db: AsyncSession = Depends(get_db),
):
    return await meeting_service.list_meetings(db, type)


@router.post("", response_model=MeetingResponse, status_code=201)
async def create_meeting(payload: MeetingCreate, db: AsyncSession = Depends(get_db)):
    return await meeting_service.create_meeting(db, payload)


@router.get("/by-link/{token}", response_model=MeetingResponse)
async def get_by_link(token: str, db: AsyncSession = Depends(get_db)):
    return await meeting_service.get_meeting_by_link(db, token)


@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    return await meeting_service.get_meeting(db, meeting_id)


@router.post("/{meeting_id}/join", response_model=ParticipantResponse, status_code=201)
async def join_meeting(meeting_id: str, payload: JoinRequest, db: AsyncSession = Depends(get_db)):
    return await meeting_service.join_meeting(db, meeting_id, payload)


@router.post("/{meeting_id}/end", response_model=MeetingResponse)
async def end_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    return await meeting_service.end_meeting(db, meeting_id)
