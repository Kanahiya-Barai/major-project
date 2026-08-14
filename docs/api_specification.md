## API v1 (FastAPI)

Base URL (local dev): `http://127.0.0.1:8000/api/v1`

All endpoints below require `Authorization: Bearer <token>` (user login) unless noted.

### Payment

#### Create payment

`POST /payment/create`

Body:
- `amount` (number, > 0)
- `receiver_name` (string)
- `receiver_account` (string)
- `failed_attempts` (int, optional)
- `transaction_frequency` (int, optional)
- `device_change` (bool, optional)
- `location_change` (bool, optional)
- `hour_of_day` (int 0-23, optional)

Response:
- `decision`: `ALLOW | OTP_REQUIRED | BLOCK`
- If `decision=OTP_REQUIRED`, the UI should call `POST /payment/otp/send` to deliver the OTP email.

#### Send / resend OTP (only when decision is OTP_REQUIRED)

`POST /payment/otp/send`

Body:
- `transaction_id` (string)

Response:
- `decision=OTP_REQUIRED`
- `message` indicates delivery status

#### Verify OTP

`POST /payment/otp/verify`

Body:
- `transaction_id` (string)
- `otp_code` (string, 6 digits)

Response:
- `decision=ALLOW` on success

### OTP Email (SMTP)

To deliver OTPs via email, set these environment variables for the backend (example in `.env`):
- `SMTP_HOST`
- `SMTP_PORT` (default `587`)
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_USE_TLS` (default `true`)
- `SMTP_USE_SSL` (default `false`)

If SMTP is not configured, `/payment/otp/send` returns `503`.
