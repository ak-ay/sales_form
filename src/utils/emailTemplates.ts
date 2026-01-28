import type { SendEmailParams } from './emailTypes';

export function buildEmailContent(params: SendEmailParams) {
  const deadline = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const counselorName = params.counselorName || 'Not Selected';
  const formatText = (value?: string) => value?.trim() ? value : 'Not specified';
  const formatName = (value?: string) => value?.trim() ? value.trim() : 'Student';
  const formatBatchMonth = (value?: string) => {
    if (!value) return 'Not specified';
    return value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, match => match.toUpperCase());
  };
  const formatTrainingMode = (value?: string) => {
    if (!value) return 'Not specified';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const formatTimeSlot = (value?: string) => {
    if (!value) return 'Not specified';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
  const formatCurrency = (value?: number) =>
    typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : 'Not specified';

  if (params.reminderType === 'confirmation') {
    return {
      subject: 'Registration Confirmation & Course Details – TradeMax Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #0f766e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .section-title { margin: 24px 0 8px; font-size: 18px; }
            .details { width: 100%; border-collapse: collapse; margin: 10px 0 6px; }
            .details td { padding: 8px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
            .note { font-size: 12px; color: #555; margin-top: 8px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="margin-bottom: 12px;">
                <img
                  src="https://www.trademaxadmissions.com/assets/images/Logo_icon-35__1_-1768362587986.png"
                  alt="TradeMax Academy Logo"
                  width="140"
                  style="display: block; margin: 0 auto; max-width: 100%; height: auto;"
                />
              </div>
              <h1>TradeMax Academy</h1>
              <p>Registration Confirmation</p>
            </div>
            <div class="content">
              <p><strong>Dear ${formatName(params.fullName)},</strong></p>
              <p>Greetings from TradeMax Academy 👋</p>
              <p>Thank you for completing your registration with us. Your seat reservation is successful. We’re excited to have you onboard and are pleased to share the details of your selected program.</p>

              <h3 class="section-title">📌 Registration Details</h3>
              ${
                typeof params.tokenNumber === 'number'
                  ? `<div style="margin: 18px 0;">
                      <div style="font-size: 12px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.08em;">Token Number</div>
                      <div style="font-size: 28px; font-weight: bold; color: #111827;">#${params.tokenNumber}</div>
                    </div>`
                  : ''
              }
              <div style="margin: 10px 0 18px;">
                <div style="font-size: 12px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.08em;">Assigned Counselor</div>
                <div style="font-size: 22px; font-weight: bold; color: #0ea5e9;">${counselorName}</div>
              </div>
              <table class="details">
                <tr>
                  <td>Selected Course:</td>
                  <td><strong>${formatTrainingMode(params.trainingMode)} Batch</strong></td>
                </tr>
                <tr>
                  <td>Selected Batch:</td>
                  <td><strong>${formatBatchMonth(params.batchMonth)}</strong></td>
                </tr>
                <tr>
                  <td>Mode of Payment:</td>
                  <td><strong>${formatText(params.paymentModeLabel)}</strong></td>
                </tr>
                ${
                  params.trainingMode === 'offline'
                    ? `<tr>
                  <td>Time Slot:</td>
                  <td><strong>${formatTimeSlot(params.preferredTimeSlot)}</strong></td>
                </tr>`
                    : ''
                }
                <tr>
                  <td>Total Course Fee:</td>
                  <td><strong>${formatCurrency(params.totalFee)}</strong></td>
                </tr>
                <tr>
                  <td>Special Registration Discount:</td>
                  <td><strong>${formatCurrency(params.discountFee)}</strong></td>
                </tr>
                <tr>
                  <td>Final Payable Amount:</td>
                  <td><strong>${formatCurrency(params.finalFee)}</strong></td>
                </tr>
              </table>
              <p class="note">(The above discount has been applied based on counselor approval as part of our registration offer.)</p>

              <h3 class="section-title">🎓 What Happens Next?</h3>
              <p>To help you make a confident decision, we offer a 3-Day Trial Period:</p>
              <ul>
                <li>Attend live sessions</li>
                <li>Experience our teaching methodology</li>
                <li>Interact with trainers and counselors</li>
                <li>Evaluate course content and delivery</li>
              </ul>

              <h3 class="section-title">💳 Payment Terms (Important)</h3>
              <p>A registration fee of <strong>₹1,000</strong> should be paid within <strong>3 hours</strong> to reserve your seat.</p>
              <p>The remaining balance course fee must be paid within <strong>10 days</strong> from the date of registration.</p>
              <p>If the balance payment is not completed within this timeline:</p>
              <ul>
                <li>The seat reservation may be cancelled, and</li>
                <li>The applied discount may be withdrawn, subject to seat availability.</li>
              </ul>

              <h3 class="section-title">💯 Refund &amp; Satisfaction Policy</h3>
              <p>Your satisfaction is our priority.</p>
              <ul>
                <li>If you feel the program is not suitable, you may opt out within the first 3 days</li>
                <li>A refund will be processed as per our refund policy</li>
                <li>No hidden conditions — complete transparency</li>
              </ul>

              <h3 class="section-title">📞 Need Help or Clarification?</h3>
              <p>Our team is always available to support you. Feel free to reach out to your assigned counselor, <strong>${counselorName}</strong>, for any assistance regarding:</p>
              <ul>
                <li>Batch details</li>
                <li>Payment process</li>
                <li>Course curriculum</li>
                <li>Trial session access</li>
              </ul>
              <p>We look forward to helping you achieve your learning and career goals with TradeMax Academy 🚀</p>

              <p>Warm regards,<br><strong>Admissions Team<br>TradeMax Academy</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 TradeMax Academy. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  if (params.reminderType === 'day5') {
    return {
      subject: '⏳ Reminder: Payment Due in 5 Days - TradeMax Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0A84FF 0%, #0f766e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .counselor-box { background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TradeMax Academy</h1>
              <p>Payment Reminder</p>
            </div>
            <div class="content">
              <h2>Dear ${params.fullName},</h2>
              <p>This is a gentle reminder that your payment deadline is <strong>${deadline}</strong>.</p>

              <div class="counselor-box">
                <p style="margin: 0;"><strong>👤 Your Assigned Counselor:</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 18px; color: #0ea5e9;"><strong>${counselorName}</strong></p>
              </div>

              <p><strong>Enrollment Details:</strong></p>
              <ul>
                <li>Enrollment ID: <strong>${params.enrollmentId}</strong></li>
                <li>Student Name: <strong>${params.fullName}</strong></li>
                <li>Payment Deadline: <strong>${deadline}</strong></li>
              </ul>

              <p><strong>NB:</strong> Please ignore this email if payment is already completed.</p>
              <p>Best regards,<br><strong>TradeMax Academy Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 TradeMax Academy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  if (params.reminderType === 'day9') {
    return {
      subject: '⚠️ Reminder: Payment Due Tomorrow - TradeMax Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .urgent { background: #dc2626; color: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; font-weight: bold; font-size: 18px; }
            .counselor-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Payment Reminder</h1>
              <p>Enrollment ID: ${params.enrollmentId}</p>
            </div>
            <div class="content">
              <h2>Dear ${params.fullName},</h2>

              <div class="urgent">
                🚨 ONLY 1 DAY LEFT TO COMPLETE PAYMENT! 🚨
              </div>

              <p>This is a friendly reminder that your payment deadline is <strong>TOMORROW (${deadline})</strong>.</p>

              <div class="counselor-box">
                <p style="margin: 0;"><strong>👤 Your Counselor:</strong> <span style="font-size: 16px; color: #f59e0b;">${counselorName}</span></p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Contact your counselor if you need assistance with payment.</p>
              </div>

              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Complete your full payment to secure your batch seat</li>
                <li>Avoid losing your enrollment spot</li>
                <li>Start your trading education journey on time</li>
              </ul>

              <p><strong>NB:</strong> Please ignore this email if payment is already completed.</p>
              <p>Best regards,<br><strong>TradeMax Academy Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2026 TradeMax Academy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  if (params.reminderType === 'day10') {
    return {
      subject: '🚨 FINAL REMINDER: Payment Deadline TODAY - TradeMax Academy',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent { background: #dc2626; color: white; padding: 25px; border-radius: 5px; margin: 20px 0; text-align: center; font-weight: bold; font-size: 20px; border: 3px solid #991b1b; }
          .counselor-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 FINAL PAYMENT REMINDER</h1>
            <p>Enrollment ID: ${params.enrollmentId}</p>
          </div>
          <div class="content">
            <h2>Dear ${params.fullName},</h2>

            <div class="urgent">
              ⚠️ PAYMENT DEADLINE IS TODAY! ⚠️<br>
              Last Day to Complete Payment
            </div>

            <p><strong>This is your FINAL reminder.</strong></p>

            <p>Your payment deadline expires <strong>TODAY (${deadline})</strong>. After today, your enrollment will be automatically cancelled and your batch seat will be allocated to the next student on the waitlist.</p>

            <div class="counselor-box">
              <p style="margin: 0;"><strong>👤 Your Counselor:</strong> <span style="font-size: 16px; color: #dc2626;">${counselorName}</span></p>
              <p style="margin: 10px 0 0 0; font-size: 14px; font-weight: bold;">URGENT: Contact your counselor NOW for immediate payment assistance!</p>
            </div>

            <p><strong>Don't Lose Your Spot!</strong></p>
            <ul>
              <li>✅ Complete payment TODAY to secure your enrollment</li>
              <li>✅ Avoid re-enrollment hassles and delays</li>
              <li>✅ Start your trading journey as scheduled</li>
            </ul>

            <p><strong>NB:</strong> Please ignore this email if payment is already completed.</p>

            <p><strong>⚠️ What Happens After Deadline:</strong></p>
            <ul>
              <li>❌ Enrollment will be cancelled</li>
              <li>❌ Batch seat will be released</li>
              <li>❌ New enrollment process required</li>
            </ul>

            <p><strong>Need Immediate Assistance?</strong></p>
            <p>Contact <strong>${counselorName}</strong> RIGHT NOW if you're experiencing any issues with payment.</p>

            <p>Best regards,<br><strong>TradeMax Academy Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 TradeMax Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };
  }

  return {
    subject: '✅ Enrollment Expired - TradeMax Academy',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #64748b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .notice { background: #e2e8f0; color: #1f2937; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold; }
          .counselor-box { background: #e2e8f0; border-left: 4px solid #64748b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enrollment Expired</h1>
            <p>Enrollment ID: ${params.enrollmentId}</p>
          </div>
          <div class="content">
            <h2>Dear ${params.fullName},</h2>
            <div class="notice">
              Your pre-booked seat has expired due to non-payment.
            </div>
            <p>Since the payment was not completed by <strong>${deadline}</strong>, your enrollment has been cancelled and your seat has been released.</p>

            <div class="counselor-box">
              <p style="margin: 0;"><strong>👤 Your Counselor:</strong> <span style="font-size: 16px; color: #334155;">${counselorName}</span></p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">If you wish to enroll again, please contact your counselor for next steps.</p>
            </div>

            <p><strong>NB:</strong> Please ignore this email if payment is already completed.</p>

            <p>Best regards,<br><strong>TradeMax Academy Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 TradeMax Academy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
