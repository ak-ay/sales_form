export type ReminderType = 'confirmation' | 'day5' | 'day9' | 'day10' | 'expiry';

export interface SendEmailParams {
  email: string;
  fullName: string;
  enrollmentId: string;
  reminderType: ReminderType;
  counselorName: string;
  tokenNumber?: number;
  courseName?: string;
  batchMonth?: string;
  trainingMode?: string;
  paymentModeLabel?: string;
  preferredTimeSlot?: string;
  totalFee?: number;
  discountFee?: number;
  finalFee?: number;
}
