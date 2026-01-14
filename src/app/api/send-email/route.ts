import { NextRequest, NextResponse } from 'next/server';
import { buildEmailContent } from '@/utils/emailTemplates';
import { sendEmail } from '@/utils/emailSender';
import type { SendEmailParams } from '@/utils/emailTypes';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SendEmailParams;

    if (!body?.email || !body?.fullName || !body?.enrollmentId || !body?.reminderType) {
      return NextResponse.json(
        { success: false, error: 'Missing required email fields' },
        { status: 400 }
      );
    }

    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
    if (!smtpFrom) {
      return NextResponse.json(
        { success: false, error: 'SMTP is not configured' },
        { status: 500 }
      );
    }

    const content = buildEmailContent(body);
    const info = await sendEmail({
      from: smtpFrom,
      to: body.email,
      subject: content.subject,
      html: content.html,
    });

    return NextResponse.json({
      success: true,
      message: `${body.reminderType} email sent successfully`,
      emailId: info.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
