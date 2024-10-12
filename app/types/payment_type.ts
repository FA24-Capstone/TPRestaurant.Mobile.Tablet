// src/app/types/payment_type.ts
export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: number;
}

export interface CreatePaymentResponse {
  result: any;
  isSuccess: boolean;
  messages: string[];
}
