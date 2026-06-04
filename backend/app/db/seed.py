from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.meeting import Meeting
from app.models.participant import Participant
from app.core.utils import generate_meeting_id, generate_invite_link
from app.core.config import settings


async def seed_database(session: AsyncSession) -> None:
    result = await session.execute(select(func.count()).select_from(Meeting))
    count = result.scalar_one()
    if count > 0:
        return

    now = datetime.utcnow()

    upcoming = [
        Meeting(
            id=generate_meeting_id(),
            title="Product Roadmap Q3",
            description="Quarterly planning session",
            host_name="Alice Johnson",
            status="scheduled",
            meeting_type="scheduled",
            invite_link=generate_invite_link("dummy1", settings.APP_BASE_URL),
            scheduled_at=now + timedelta(days=1),
            duration_min=60,
        ),
        Meeting(
            id=generate_meeting_id(),
            title="Design Review — v2 UI",
            description="Review new design mockups",
            host_name="Bob Smith",
            status="scheduled",
            meeting_type="scheduled",
            invite_link=generate_invite_link("dummy2", settings.APP_BASE_URL),
            scheduled_at=now + timedelta(days=3),
            duration_min=45,
        ),
        Meeting(
            id=generate_meeting_id(),
            title="Engineering Sync",
            description="Weekly engineering standup",
            host_name="Carol White",
            status="scheduled",
            meeting_type="scheduled",
            invite_link=generate_invite_link("dummy3", settings.APP_BASE_URL),
            scheduled_at=now + timedelta(days=5),
            duration_min=30,
        ),
    ]

    past_data = [
        ("Sprint Retrospective", "Sprint 22 retro", "David Brown", now - timedelta(days=2), ["Emma", "Frank", "Grace"]),
        ("Client Demo", "Demo for Acme Corp", "Eve Davis", now - timedelta(days=4), ["Henry", "Isla", "Jack", "Karen"]),
        ("Incident Postmortem", "DB outage review", "Frank Miller", now - timedelta(days=6), ["Liam", "Mia"]),
    ]
    past_meetings = []
    for title, desc, host, ended_at, names in past_data:
        m = Meeting(
            id=generate_meeting_id(),
            title=title,
            description=desc,
            host_name=host,
            status="ended",
            meeting_type="scheduled",
            invite_link=generate_invite_link(f"past-{title}", settings.APP_BASE_URL),
            scheduled_at=ended_at - timedelta(hours=1),
            duration_min=60,
            started_at=ended_at - timedelta(hours=1),
            ended_at=ended_at,
        )
        past_meetings.append((m, names))

    active_meeting = Meeting(
        id=generate_meeting_id(),
        title="Quick Sync — Now",
        host_name="Default User",
        status="active",
        meeting_type="instant",
        invite_link=generate_invite_link("active1", settings.APP_BASE_URL),
        duration_min=60,
        started_at=now,
    )

    for m in upcoming:
        session.add(m)
    for m, _ in past_meetings:
        session.add(m)
    session.add(active_meeting)
    await session.flush()

    for m, names in past_meetings:
        for name in names:
            p = Participant(
                meeting_id=m.id,
                display_name=name,
                joined_at=m.started_at,
                left_at=m.ended_at,
            )
            session.add(p)

    await session.commit()
