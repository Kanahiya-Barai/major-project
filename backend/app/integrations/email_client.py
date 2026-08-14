from __future__ import annotations

import smtplib
from email.mime.text import MIMEText

from app.core.config import settings


class EmailNotConfiguredError(RuntimeError):
    pass


def send_email(*, to_email: str, subject: str, body: str) -> None:
    host = settings.smtp_host.strip()
    if not host:
        raise EmailNotConfiguredError(
            "SMTP is not configured. Set SMTP_HOST (and optionally SMTP_USERNAME/SMTP_PASSWORD/SMTP_FROM_EMAIL)."
        )

    from_email = (settings.smtp_from_email or settings.smtp_username).strip()
    if not from_email:
        raise EmailNotConfiguredError("SMTP_FROM_EMAIL is not configured (or SMTP_USERNAME is empty).")

    message = MIMEText(body, "plain", "utf-8")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email

    port = int(settings.smtp_port)
    if settings.smtp_use_ssl:
        server: smtplib.SMTP = smtplib.SMTP_SSL(host=host, port=port, timeout=10)
    else:
        server = smtplib.SMTP(host=host, port=port, timeout=10)

    try:
        if settings.smtp_use_tls and not settings.smtp_use_ssl:
            server.starttls()
        username = settings.smtp_username.strip()
        password = settings.smtp_password
        if username and password:
            server.login(username, password)
        server.sendmail(from_email, [to_email], message.as_string())
    finally:
        try:
            server.quit()
        except Exception:
            # Avoid masking the primary exception.
            pass
