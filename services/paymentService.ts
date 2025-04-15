import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/types";

type PaymentPlan = Database["public"]["Tables"]["payment_plans"]["Row"];
type PaymentInstallment = Database["public"]["Tables"]["payment_installments"]["Row"];
type Payment = Database["public"]["Tables"]["payments"]["Row"];

export interface PaymentData {
  paymentPlan: PaymentPlan;
  installments: PaymentInstallment[];
  payments: Payment[];
}

export const paymentService = {
  async fetchPaymentData(studentId: string): Promise<PaymentData | null> {
    try {
      // Get current enrollment for the student
      const { data: enrollment } = await supabase
        .from('student_school_class')
        .select('id')
        .eq('student_id', studentId)
        .eq('is_active', true)
        .single();

      if (!enrollment) {
        throw new Error('No active enrollment found');
      }

      // Get payment plan
      const { data: paymentPlan } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('enrollment_id', enrollment.id)
        .single();

      if (!paymentPlan) {
        throw new Error('No payment plan found');
      }

      // Get installments
      const { data: installments } = await supabase
        .from('payment_installments')
        .select('*')
        .eq('payment_plan_id', paymentPlan.id)
        .order('due_date', { ascending: true });

      // Get payment history
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .in('installment_id', installments?.map(i => i.id) || [])
        .order('paid_at', { ascending: false });

      return {
        paymentPlan,
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
