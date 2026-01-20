/**
 * Google Sheets Integration Service
 * Handles submission of enrollment data to Google Sheets via Next.js API route
 */

import { getCounselorDisplay } from './counselors';

interface EnrollmentData {
  fullName: string;
  email: string;
  phone: string;
  learningMode: string;
  preferredBatchMonth: string;
  preferredTimeSlot: string;
  paymentMode: string;
  selectedCounselor: string;
  courseName?: string;
  batchMonth?: string;
  trainingMode?: string;
  paymentModeLabel?: string;
  preferredTimeSlot?: string;
  totalFee?: number;
  discountFee?: number;
  finalFee?: number;
  timestamp?: string;
  enrollmentId?: string;
}

interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  rowNumber?: number;
  tokenNumber?: number;
  error?: string;
  details?: string;
}

/**
 * Submits enrollment data to Google Sheets via Next.js API route (server-side)
 * This avoids CORS issues by routing the request through our own API
 * @param data - Enrollment form data to submit
 * @returns Promise with submission result
 */
export async function submitToGoogleSheets(
  data: EnrollmentData
): Promise<GoogleSheetsResponse> {
  const timestamp = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

  // Add timestamp and format data for Google Sheets
  const payload = {
    name: data.fullName,
    email: data.email,
    mobile: data.phone,
    mode: data.learningMode,
    batch_month: data.preferredBatchMonth,
    time_slot: data.preferredTimeSlot || 'N/A',
    payment_mode: data.paymentMode,
    counselor: getCounselorDisplay(data.selectedCounselor, { includeSpecialization: false }) || 'Not selected',
    courseName: data.courseName,
    batchMonth: data.batchMonth,
    trainingMode: data.trainingMode,
    paymentModeLabel: data.paymentModeLabel,
    preferredTimeSlot: data.preferredTimeSlot,
    totalFee: data.totalFee,
    discountFee: data.discountFee,
    finalFee: data.finalFee,
    timestamp: data.timestamp || `${timestamp} IST`,
    enrollmentId: data.enrollmentId || '',
  };

  console.log('📊 Submitting enrollment data to Google Sheets...');
  console.log('📦 Payload:', JSON.stringify(payload, null, 2));

  try {
    // Call our own API route instead of directly calling Google Apps Script
    // This avoids CORS issues since the API route runs server-side
    const response = await fetch('/api/submit-enrollment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('✅ Response received from API');
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);

    const result = await response.json();
    console.log('📋 API response:', result);

    if (!response.ok || result.success === false) {
      const errorMessage = result.error || 'Failed to submit enrollment data';
      const errorDetails = result.details ? `\n\nDetails: ${result.details}` : '';
      
      throw new Error(
        `❌ Google Sheets Submission Failed\n\n${errorMessage}${errorDetails}\n\n` +
        `Please check:\n` +
        `1. Your Google Apps Script is deployed correctly\n` +
        `2. The webhook URL in .env is correct\n` +
        `3. The script has proper permissions\n` +
        `4. Your Google Sheet is accessible\n\n` +
        `If the webhook URL works in a browser but fails here, check your Apps Script "Executions" tab for detailed error logs.`
      );
    }

    console.log('✅ Data successfully submitted to Google Sheets');
    return {
      success: true,
      message: result.message || 'Enrollment data submitted successfully',
      rowNumber: result.rowNumber,
      tokenNumber: typeof result.tokenNumber === 'number'
        ? result.tokenNumber
        : typeof result.rowNumber === 'number'
          ? Math.max(result.rowNumber - 1, 1)
          : undefined,
    };

  } catch (error) {
    console.error('❌ Error submitting to Google Sheets:', error);
    
    if (error instanceof Error) {
      // Re-throw formatted errors
      if (error.message.startsWith('❌')) {
        throw error;
      }
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(
          '🌐 NETWORK ERROR: Cannot connect to the enrollment API.\n\n' + 'This usually means:\n'+ '• Your internet connection is unstable\n'+ '• The application server is not responding\n'+ '• A firewall is blocking the request\n\n'+ 'Please:\n'+ '1. Check your internet connection\n'+ '2. Try refreshing the page and submitting again\n'+ '3. Contact support if the issue persists'
        );
      }
      
      throw new Error(
        '❌ UNEXPECTED ERROR: ' + error.message + '\n\n' + 'Please try again or contact support if the issue persists.'
      );
    }
    
    throw new Error(
      '❌ CRITICAL ERROR: Failed to submit enrollment data.\n\n' + 'Error details: ' + String(error) + '\n\n' +
      'Please refresh the page and try again.'
    );
  }
}

/**
 * Validates Google Sheets webhook configuration
 * @returns boolean indicating if webhook is properly configured
 */
export function isGoogleSheetsConfigured(): boolean {
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
  return !!(webhookUrl && webhookUrl !== 'your-apps-script-webhook-url-here');
}

/**
 * Tests the Google Sheets webhook connection
 * @returns Promise with test result
 */
export async function testGoogleSheetsConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!isGoogleSheetsConfigured()) {
    return {
      success: false,
      message: 'Google Sheets webhook URL is not configured',
    };
  }

  try {
    const testData: EnrollmentData = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      preferredBatchMonth: 'Test Month',
      paymentMode: 'Test',
      timestamp: new Date().toISOString(),
      enrollmentId: 'TEST-001',
    };

    await submitToGoogleSheets(testData);
    
    return {
      success: true,
      message: 'Connection to Google Sheets successful',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection test failed',
    };
  }
}
