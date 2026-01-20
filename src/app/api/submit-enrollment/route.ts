import { NextRequest, NextResponse } from 'next/server';
import { buildEmailContent } from '@/utils/emailTemplates';
import { sendEmail } from '@/utils/emailSender';
import type { SendEmailParams } from '@/utils/emailTypes';

/**
 * API Route for submitting enrollment data to Google Sheets
 * Acts as a server-side proxy to avoid CORS issues with Google Apps Script
 */
export async function POST(request: NextRequest) {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

    // Validate webhook configuration
    if (!webhookUrl || webhookUrl === 'your-apps-script-webhook-url-here') {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Sheets webhook is not configured',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();

    console.log('[Server] Submitting enrollment data to Google Sheets...');
    console.log('[Server] Webhook URL:', webhookUrl);
    console.log('[Server] Payload:', JSON.stringify(body, null, 2));

    // Make server-side request to Google Apps Script (no CORS issues)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('[Server] Response status:', response.status);
    console.log('[Server] Response ok:', response.ok);

    // Check response status
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error('[Server] Google Sheets Error Response:', errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Google Sheets request failed with status ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // Parse response
    const responseText = await response.text();
    console.log('[Server] Raw response text:', responseText);

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('[Server] Parsed response:', result);
    } catch (parseError) {
      console.error('[Server] Failed to parse response as JSON:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from Google Apps Script',
          details: responseText.substring(0, 200),
        },
        { status: 500 }
      );
    }

    // Check Apps Script response
    if (result.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || result.error || 'Google Apps Script reported a failure',
        },
        { status: 500 }
      );
    }

    const tokenNumber = typeof result.tokenNumber === 'number'
      ? result.tokenNumber
      : typeof result.rowNumber === 'number'
        ? Math.max(result.rowNumber - 1, 1)
        : undefined;

    let emailSent = false;
    let emailError: string | null = null;
    try {
      const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
      if (!smtpFrom) {
        throw new Error('SMTP is not configured');
      }

      const emailPayload: SendEmailParams = {
        email: body.email,
        fullName: body.name,
        enrollmentId: body.enrollmentId || '',
        reminderType: 'confirmation',
        counselorName: body.counselor || 'Not Selected',
        tokenNumber: tokenNumber,
        courseName: body.courseName,
        batchMonth: body.batchMonth || body.batch_month,
        trainingMode: body.trainingMode || body.mode,
        paymentModeLabel: body.paymentModeLabel,
        preferredTimeSlot: body.preferredTimeSlot || body.time_slot,
        totalFee: body.totalFee,
        discountFee: body.discountFee,
        finalFee: body.finalFee,
      };

      const content = buildEmailContent(emailPayload);
      await sendEmail({
        from: smtpFrom,
        to: body.email,
        subject: content.subject,
        html: content.html,
      });
      emailSent = true;
    } catch (error) {
      emailError = error instanceof Error ? error.message : 'Unknown email error';
      console.error('[Server] ❌ Email send failed:', emailError);
    }

    console.log('[Server] ✅ Data successfully submitted to Google Sheets');
    return NextResponse.json({
      success: true,
      message: 'Enrollment data submitted successfully',
      rowNumber: result.rowNumber,
      tokenNumber: tokenNumber,
      emailSent: emailSent,
      emailError: emailError,
    });

  } catch (error) {
    console.error('[Server] ❌ Error submitting to Google Sheets:', error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          {
            success: false,
            error: 'Request timeout - Google Sheets is not responding',
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit to Google Sheets',
      },
      { status: 500 }
    );
  }
}
