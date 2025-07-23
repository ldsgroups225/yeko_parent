import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/types";

type PaymentPlan = Database["public"]["Tables"]["payment_plans"]["Row"];
type PaymentInstallment = Database["public"]["Tables"]["payment_installments"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

export interface PaymentData {
  stats: {
    totalAmount: number;
    remainingAmount: number;
  };
  installments: PaymentInstallment[];
  payments: Payment[];
}

export const paymentService = {
  async fetchPaymentData(studentId: string): Promise<PaymentData | null> {
    try {
      // 1. Query payment_details_view
      const { data: paymentDetails } = await supabase
        .from('payment_details_view')
        .select('enrollment_id, total_amount, remaining_amount, payment_plan_id')
        .eq('student_id', studentId)
        .order('payment_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!paymentDetails) {
        return null;
      }

      // Get installments
      const { data: installments } = await supabase
        .from('payment_installments')
        .select('*')
        .eq('payment_plan_id', paymentDetails.payment_plan_id!)
        .order('due_date', { ascending: true });

      // Get payment history
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .in('installment_id', installments?.map(i => i.id) || [])
        .order('paid_at', { ascending: false });

      return {
        stats: {
          totalAmount: paymentDetails.total_amount ?? 0,
          remainingAmount: paymentDetails.remaining_amount ?? 0,
        },
        installments: installments || [],
        payments: payments || []
      };
    } catch (error) {
      console.error('Error fetching payment data:', error);
      return null;
    }
  },

  async initiatePayment(
    studentId: string,
    amount: number,
    paymentMethod: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('process_payment', {
        _student_id: studentId,
        _amount: amount,
        _payment_method: paymentMethod
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process payment' 
      };
    }
  }
}; 
