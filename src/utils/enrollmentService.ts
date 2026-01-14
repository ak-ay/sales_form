import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

interface CreateEnrollmentParams {
  enrollmentId: string;
  fullName: string;
  email: string;
  phone: string;
  paymentMode: string;
  selectedCounselor: string;
}

/**
 * Creates enrollment record in Supabase database
 * This is required for tracking payment reminder emails
 */
export async function createEnrollmentRecord(
  params: CreateEnrollmentParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('Supabase not configured. Skipping enrollment record creation.');
      return { success: false, error: 'Supabase not configured' };
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          enrollment_id: params.enrollmentId,
          full_name: params.fullName,
          email: params.email,
          phone: params.phone,
          payment_status: 'pending',
          payment_mode: params.paymentMode,
          selected_counselor: params.selectedCounselor,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase enrollment insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Enrollment service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Updates enrollment payment status
 */
export async function updatePaymentStatus(
  enrollmentId: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('Supabase not configured. Skipping payment status update.');
      return { success: false, error: 'Supabase not configured' };
    }

    const { error } = await supabase
      .from('enrollments')
      .update({ payment_status: status })
      .eq('enrollment_id', enrollmentId);

    if (error) {
      console.error('Payment status update error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update payment status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}
