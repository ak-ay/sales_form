# 📧 TradeMax Academy - Enrollment Email System

## Overview

This app sends enrollment emails directly from a Next.js API route using SMTP.

## Architecture

- **Next.js API Route**: `src/app/api/send-email/route.ts`
- **Client Service**: `src/utils/emailService.ts`
- **Email Provider**: Gmail SMTP (App Password)

## Setup

1. Add your SMTP credentials to `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=info@trademaxacademy.com
   SMTP_PASS=your_app_password_here
   SMTP_FROM=info@trademaxacademy.com
   ```
2. Restart the dev server.

## What Gets Sent

- **Confirmation email** is sent immediately after successful enrollment (server-side in `/api/submit-enrollment`).
- **Reminders** (`day5`, `day9`, `day10`, `expiry`) are supported by the API route and can be auto-triggered via the scheduler endpoint.

## Testing

Run a local test once the dev server is running:

```bash
curl -X POST http://localhost:4028/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test Student",
    "enrollmentId": "TMA2026TEST",
    "reminderType": "confirmation",
    "counselorName": "Priya Sharma",
    "tokenNumber": 1
  }'
```

### Reminder Examples

```bash
curl -X POST http://localhost:4028/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test Student",
    "enrollmentId": "TMA2026TEST",
    "reminderType": "day5",
    "counselorName": "Priya Sharma"
  }'
```

## Scheduler (Recommended)

Call this endpoint daily (cron):

```
POST /api/schedule-reminders
```

It reads the enrollments CSV (set `ENROLLMENTS_SHEET_CSV_URL`) and sends day 5/9/10/expiry reminders. It also marks the reminder columns in the sheet so emails are not repeated.

```bash
curl -X POST http://localhost:4028/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test Student",
    "enrollmentId": "TMA2026TEST",
    "reminderType": "expiry",
    "counselorName": "Priya Sharma"
  }'
```

## Sender Email

The sender is controlled by `SMTP_FROM`. For Gmail, use the same address as `SMTP_USER`.
