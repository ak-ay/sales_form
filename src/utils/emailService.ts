/**
 * Email Service for TradeMax Academy Enrollment Emails
 */

export type ReminderType = 'confirmation' | 'day5' | 'day9' | 'day10' | 'expiry';

interface SendPaymentEmailParams {
  email: string;
  fullName: string;
  enrollmentId: string;
  reminderType: ReminderType;
  counselorName: string; // ✅ NEW: Added counselor name parameter
  tokenNumber?: number;
}

interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

/**
 * Sends payment urgency/reminder email via Supabase Edge Function
 */
export async function sendPaymentUrgencyEmail(
  params: SendPaymentEmailParams
): Promise<EmailResponse> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      message: 'Failed to send payment urgency email',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sends enrollment confirmation email to student
 */
export async function sendEnrollmentConfirmationEmail(
  params: Omit<SendPaymentEmailParams, 'reminderType'>
): Promise<EmailResponse> {
  return sendPaymentUrgencyEmail({
    ...params,
    reminderType: 'confirmation',
  });
}

export async function scheduleDay5Reminder(
  email: string,
  fullName: string,
  enrollmentId: string,
  counselorName: string,
  tokenNumber?: number
): Promise<EmailResponse> {
  return sendPaymentUrgencyEmail({
    email,
    fullName,
    enrollmentId,
    reminderType: 'day5',
    counselorName,
    tokenNumber,
  });
}

/**
 * Schedule Day 9 reminder email (to be called via cron job or scheduled task)
 */
export async function scheduleDay9Reminder(
  email: string,
  fullName: string,
  enrollmentId: string,
  counselorName: string,
  tokenNumber?: number
): Promise<EmailResponse> {
  return sendPaymentUrgencyEmail({
    email,
    fullName,
    enrollmentId,
    reminderType: 'day9',
    counselorName,
    tokenNumber,
  });
}

/**
 * Schedule Day 10 final reminder email (to be called via cron job or scheduled task)
 */
export async function scheduleDay10Reminder(
  email: string,
  fullName: string,
  enrollmentId: string,
  counselorName: string,
  tokenNumber?: number
): Promise<EmailResponse> {
  return sendPaymentUrgencyEmail({
    email,
    fullName,
    enrollmentId,
    reminderType: 'day10',
    counselorName,
    tokenNumber,
  });
}

export async function scheduleExpiryReminder(
  email: string,
  fullName: string,
  enrollmentId: string,
  counselorName: string,
  tokenNumber?: number
): Promise<EmailResponse> {
  return sendPaymentUrgencyEmail({
    email,
    fullName,
    enrollmentId,
    reminderType: 'expiry',
    counselorName,
    tokenNumber,
  });
}
