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

const EARLY_BIRD_START_DAY = 19;
const EARLY_BIRD_END_DAY = 27;

function getISTDayOfMonth(date: Date): number {
  const dayPart = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
  }).format(date);
  return parseInt(dayPart, 10);
}

export function isEarlyBirdWindow(date: Date = new Date()): boolean {
  const day = getISTDayOfMonth(date);
  return day >= EARLY_BIRD_START_DAY && day <= EARLY_BIRD_END_DAY;
}

export const offlinePaymentOptions: PaymentOption[] = [
  { value: 'full-payment', label: 'Full Payment', price: 47000, discountedPrice: 27500 },
  {
    value: 'part-payment',
    label: 'Part Payment',
    price: 47000,
    installments: {
      regular: '₹23,500 Phase 1 + ₹23,500 Phase 2',
      discounted: '₹23,500 Phase 1 + ₹23,500 Phase 2',
    },
  },
];

export const onlinePaymentOptions: PaymentOption[] = [
  { value: 'full-payment', label: 'Full Payment', price: 30000, discountedPrice: 17500 },
  {
    value: 'part-payment',
    label: 'Part Payment',
    price: 36000,
    installments: {
      regular: '₹12,000 Phase 1 + ₹12,000 Phase 2 + ₹12,000 Phase 3',
      discounted: '₹12,000 Phase 1 + ₹12,000 Phase 2 + ₹12,000 Phase 3',
    },
  },
  {
    value: 'decoding-technical-analysis',
    label: 'Only Decoding Technical Analysis (Phase 1)',
    price: 12000,
  },
];

export const getPaymentOptions = (
  learningMode: string,
  referenceDate: Date = new Date()
): PaymentOption[] => {
  const options = learningMode === 'offline' ? offlinePaymentOptions : onlinePaymentOptions;
  if (isEarlyBirdWindow(referenceDate)) {
    return options;
  }

  // Outside early-bird window, hide reduced pricing while keeping base prices available.
  return options.map((option) => ({
    ...option,
    discountedPrice: undefined,
    installments: option.installments
      ? { regular: option.installments.regular, discounted: option.installments.regular }
      : undefined,
  }));
};

export const findPaymentOption = (
  learningMode: string,
  paymentMode: string,
  referenceDate: Date = new Date()
): PaymentOption | undefined =>
  getPaymentOptions(learningMode, referenceDate).find(option => option.value === paymentMode);
