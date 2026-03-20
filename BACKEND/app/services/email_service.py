from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
import smtplib

from app.core.config import settings


def send_email(*, to_email: str, subject: str, body_text: str) -> None:
    if settings.smtp_host and settings.smtp_from_email:
        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = (
            f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
            if settings.smtp_from_name
            else settings.smtp_from_email
        )
        message["To"] = to_email
        message.set_content(body_text)

        if settings.smtp_use_ssl:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=20) as server:
                if settings.smtp_username and settings.smtp_password:
                    server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)
            return

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            if settings.smtp_starttls:
                server.starttls()
            if settings.smtp_username and settings.smtp_password:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
        return

    debug_dir = Path(settings.smtp_debug_dir)
    debug_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    safe_email = to_email.replace("@", "_at_").replace(".", "_")
    preview_path = debug_dir / f"{timestamp}_{safe_email}.txt"
    preview_path.write_text(
        f"TO: {to_email}\nSUBJECT: {subject}\n\n{body_text}",
        encoding="utf-8",
    )
