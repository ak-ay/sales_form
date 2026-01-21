export type PaymentOption = {
  value: string;
  label: string;
  price: number;
  discountedPrice?: number;
  installments?: {
    regular: string;
    discounted: string;
  };
};

export const offlinePaymentOptions: PaymentOption[] = [
  { value: 'full-payment', label: 'Full Payment', price: 47000, discountedPrice: 30000 },
  {
    value: 'part-payment',
    label: 'Part Payment',
    price: 47000,
    discountedPrice: 35600,
    installments: {
      regular: '₹23,500 Phase 1 + ₹23,500 Phase 2',
      discounted: '₹17,800 Phase 1 + ₹17,800 Phase 2',
    },
  },
];

export const onlinePaymentOptions: PaymentOption[] = [
  { value: 'full-payment', label: 'Full Payment', price: 30000, discountedPrice: 20000 },
  {
    value: 'part-payment',
    label: 'Part Payment',
    price: 36000,
    discountedPrice: 23600,
    installments: {
      regular: '₹12,000 Phase 1 + ₹12,000 Phase 2 + ₹12,000 Phase 3',
      discounted: '₹5,900 Phase 1 + ₹8,850 Phase 2 + ₹8,850 Phase 3',
    },
  },
  {
    value: 'decoding-technical-analysis',
    label: 'Only Decoding Technical Analysis (Phase 1)',
    price: 12000,
  },
];

export const getPaymentOptions = (learningMode: string): PaymentOption[] =>
  learningMode === 'offline' ? offlinePaymentOptions : onlinePaymentOptions;

export const findPaymentOption = (learningMode: string, paymentMode: string): PaymentOption | undefined =>
  getPaymentOptions(learningMode).find(option => option.value === paymentMode);
