-- Create enrollments table to track payment reminders
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_mode TEXT,
    selected_counselor TEXT,
    day9_reminder_sent BOOLEAN DEFAULT FALSE,
    day9_reminder_sent_at TIMESTAMPTZ,
    day10_reminder_sent BOOLEAN DEFAULT FALSE,
    day10_reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on enrollment_id for fast lookups
CREATE INDEX idx_enrollments_enrollment_id ON enrollments(enrollment_id);

-- Create index on payment_status and created_at for reminder queries
CREATE INDEX idx_enrollments_payment_reminders ON enrollments(payment_status, created_at) 
WHERE payment_status = 'pending';

-- Create index on reminder flags for scheduled jobs
CREATE INDEX idx_enrollments_day9_reminders ON enrollments(day9_reminder_sent, created_at)
WHERE payment_status = 'pending' AND day9_reminder_sent = FALSE;

CREATE INDEX idx_enrollments_day10_reminders ON enrollments(day10_reminder_sent, created_at)
WHERE payment_status = 'pending' AND day10_reminder_sent = FALSE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE enrollments IS 'Tracks student enrollments and automated payment reminder emails';
COMMENT ON COLUMN enrollments.day9_reminder_sent IS 'Flag indicating if Day 9 payment reminder was sent';
COMMENT ON COLUMN enrollments.day10_reminder_sent IS 'Flag indicating if Day 10 final payment reminder was sent';