import { NextRequest, NextResponse } from 'next/server';
import { buildEmailContent } from '@/utils/emailTemplates';
import { sendEmail } from '@/utils/emailSender';
import type { SendEmailParams, ReminderType } from '@/utils/emailTypes';

type RowRecord = string[];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseCsv(csvText: string) {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  const row: string[] = [];

  const pushCell = () => {
    row.push(current.trim());
    current = '';
  };

  const pushRow = () => {
    rows.push([...row]);
    row.length = 0;
  };

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      pushCell();
      if (row.some(cell => cell.length > 0)) {
        pushRow();
      } else {
        row.length = 0;
      }
      continue;
    }

    current += char;
  }

  if (current.length || row.length) {
    pushCell();
    if (row.some(cell => cell.length > 0)) {
      pushRow();
    }
  }

  return rows;
}

function parseIstDate(value: string) {
  if (!value) return null;
  const trimmed = value.replace('IST', '').trim();
  if (trimmed.includes('T')) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const match = trimmed.match(
    /(\d{2})\/(\d{2})\/(\d{4}),?\s*(\d{2}):(\d{2}):(\d{2})/
  );
  if (!match) return null;

  const [, dd, mm, yyyy, hh, min, ss] = match;
  const iso = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+05:30`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getIstNow() {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );
}

function getHeaderMap(headers: string[]) {
  return headers.reduce<Record<string, number>>((acc, header, index) => {
    acc[normalizeHeader(header)] = index;
    return acc;
  }, {});
}

function getValue(row: RowRecord, map: Record<string, number>, keys: string[]) {
  for (const key of keys) {
    const index = map[key];
    if (index !== undefined) return row[index]?.trim() || '';
  }
  return '';
}

function isTruthy(value: string) {
  return ['true', 'yes', '1', 'y', 'sent', 'done'].includes(value.toLowerCase());
}

function isPaid(value: string) {
  return ['paid', 'completed', 'success', 'done', 'yes', 'true'].includes(
    value.toLowerCase()
  );
}

function resolveReminderType(daysSince: number): ReminderType | null {
  if (daysSince >= 11) return 'expiry';
  if (daysSince >= 10) return 'day10';
  if (daysSince >= 9) return 'day9';
  if (daysSince >= 5) return 'day5';
  return null;
}

async function markReminderSent(enrollmentId: string, reminderType: ReminderType) {
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'updateReminder',
      enrollmentId,
      reminderType,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const csvUrl = process.env.ENROLLMENTS_SHEET_CSV_URL;
    if (!csvUrl) {
      return NextResponse.json(
        { success: false, error: 'ENROLLMENTS_SHEET_CSV_URL is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(csvUrl, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch enrollments (${response.status})` },
        { status: response.status }
      );
    }

    const rows = parseCsv(await response.text());
    if (rows.length <= 1) {
      return NextResponse.json({ success: true, sent: 0, skipped: 0 });
    }

    const headerMap = getHeaderMap(rows[0]);
    const nowIst = getIstNow();
    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows.slice(1)) {
      const email = getValue(row, headerMap, ['email']);
      const fullName = getValue(row, headerMap, ['fullname', 'name']);
      const enrollmentId = getValue(row, headerMap, ['enrollmentid']);
      const timestamp = getValue(row, headerMap, ['timestamp']);
      const paymentStatus = getValue(row, headerMap, ['paymentstatus', 'payment_status', 'status']);
      const day5Sent = getValue(row, headerMap, ['day5sent', 'reminderday5', 'day5reminder']);
      const day9Sent = getValue(row, headerMap, ['day9sent', 'reminderday9', 'day9reminder']);
      const day10Sent = getValue(row, headerMap, ['day10sent', 'reminderday10', 'day10reminder']);
      const expirySent = getValue(row, headerMap, ['expirysent', 'reminderexpiry', 'day11sent', 'day11reminder']);
      const counselorName = getValue(row, headerMap, ['counselor']);
      const tokenNumberValue = getValue(row, headerMap, ['tokennumber', 'token']);
      const tokenNumber = tokenNumberValue ? Number(tokenNumberValue) : undefined;

      if (!email || !fullName || !enrollmentId || !timestamp) {
        skipped += 1;
        continue;
      }

      if (isPaid(paymentStatus)) {
        skipped += 1;
        continue;
      }

      const enrollmentDate = parseIstDate(timestamp);
      if (!enrollmentDate) {
        skipped += 1;
        continue;
      }

      const daysSince = Math.floor((nowIst.getTime() - enrollmentDate.getTime()) / MS_PER_DAY);
      const reminderType = resolveReminderType(daysSince);
      if (!reminderType) {
        skipped += 1;
        continue;
      }

      const alreadySent = {
        day5: isTruthy(day5Sent),
        day9: isTruthy(day9Sent),
        day10: isTruthy(day10Sent),
        expiry: isTruthy(expirySent),
      }[reminderType];

      if (alreadySent) {
        skipped += 1;
        continue;
      }

      const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
      if (!smtpFrom) {
        return NextResponse.json(
          { success: false, error: 'SMTP is not configured' },
          { status: 500 }
        );
      }

      const emailPayload: SendEmailParams = {
        email,
        fullName,
        enrollmentId,
        reminderType,
        counselorName: counselorName || 'Not Selected',
        tokenNumber,
      };

      const content = buildEmailContent(emailPayload);
      try {
        await sendEmail({
          from: smtpFrom,
          to: email,
          subject: content.subject,
          html: content.html,
        });
        await markReminderSent(enrollmentId, reminderType);
        sent += 1;
      } catch (error) {
        errors.push(`${enrollmentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      errors,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
