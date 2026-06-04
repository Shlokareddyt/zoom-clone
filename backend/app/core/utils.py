import uuid
import secrets


def generate_meeting_id() -> str:
    uid = uuid.uuid4().hex
    return f"{uid[:3]}-{uid[3:7]}-{uid[7:10]}"


def generate_invite_link(meeting_id: str, base_url: str) -> str:
    token = secrets.token_urlsafe(16)
    return f"{base_url}/meeting/join/{token}"
