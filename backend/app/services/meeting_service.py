from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException

from app.models.meeting import Meeting
from app.models.participant import Participant
from app.schemas.meeting import MeetingCreate, MeetingResponse
from app.schemas.participant import JoinRequest, ParticipantResponse
from app.core.utils import generate_meeting_id, generate_invite_link
from app.core.config import settings


async def _participant_count(session: AsyncSession, meeting_id: str) -> int:
    result = await session.execute(
        select(func.count()).where(
            Participant.meeting_id == meeting_id,
            Participant.left_at.is_(None),
        )
    )
    return result.scalar_one()


async def _to_response(session: AsyncSession, meeting: Meeting) -> MeetingResponse:
    count = await _participant_count(session, meeting.id)
    data = MeetingResponse.model_validate(meeting)
    data.participant_count = count
    return data


async def create_meeting(session: AsyncSession, payload: MeetingCreate) -> MeetingResponse:
    meeting_id = generate_meeting_id()
    invite_link = generate_invite_link(meeting_id, settings.APP_BASE_URL)
    status = "active" if payload.meeting_type == "instant" else "scheduled"
    started_at = datetime.utcnow() if payload.meeting_type == "instant" else None

    meeting = Meeting(
        id=meeting_id,
        title=payload.title,
        description=payload.description,
        host_name=payload.host_name,
        status=status,
        meeting_type=payload.meeting_type,
        invite_link=invite_link,
        scheduled_at=payload.scheduled_at,
        duration_min=payload.duration_min,
        started_at=started_at,
    )
    session.add(meeting)
    await session.commit()
    await session.refresh(meeting)
    return await _to_response(session, meeting)


async def get_meeting(session: AsyncSession, meeting_id: str) -> MeetingResponse:
    result = await session.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return await _to_response(session, meeting)


async def list_meetings(session: AsyncSession, filter_type: str | None) -> list[MeetingResponse]:
    query = select(Meeting)
    now = datetime.utcnow()
    if filter_type == "upcoming":
        query = query.where(
            Meeting.status.in_(["scheduled", "active"]),
            Meeting.ended_at.is_(None),
        ).order_by(Meeting.scheduled_at.asc().nullsfirst(), Meeting.created_at.asc())
    elif filter_type == "previous":
        query = query.where(Meeting.status == "ended").order_by(Meeting.ended_at.desc())
    else:
        query = query.order_by(Meeting.created_at.desc())

    result = await session.execute(query)
    meetings = result.scalars().all()
    return [await _to_response(session, m) for m in meetings]


async def join_meeting(session: AsyncSession, meeting_id: str, payload: JoinRequest) -> ParticipantResponse:
    result = await session.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.status == "ended":
        raise HTTPException(status_code=400, detail="Meeting has ended")

    participant = Participant(meeting_id=meeting_id, display_name=payload.display_name)
    session.add(participant)
    await session.commit()
    await session.refresh(participant)
    return ParticipantResponse.model_validate(participant)


async def end_meeting(session: AsyncSession, meeting_id: str) -> MeetingResponse:
    result = await session.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = "ended"
    meeting.ended_at = datetime.utcnow()
    await session.commit()
    await session.refresh(meeting)
    return await _to_response(session, meeting)


async def get_meeting_by_link(session: AsyncSession, token: str) -> MeetingResponse:
    result = await session.execute(
        select(Meeting).where(Meeting.invite_link.contains(token))
    )
    meeting = result.scalar_one_or_none()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return await _to_response(session, meeting)


async def list_participants(session: AsyncSession, meeting_id: str) -> list[ParticipantResponse]:
    result = await session.execute(
        select(Participant).where(
            Participant.meeting_id == meeting_id,
            Participant.left_at.is_(None),
        )
    )
    return [ParticipantResponse.model_validate(p) for p in result.scalars().all()]


async def remove_participant(session: AsyncSession, meeting_id: str, participant_id: int) -> None:
    result = await session.execute(
        select(Participant).where(
            Participant.id == participant_id,
            Participant.meeting_id == meeting_id,
        )
    )
    participant = result.scalar_one_or_none()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    participant.left_at = datetime.utcnow()
    await session.commit()
