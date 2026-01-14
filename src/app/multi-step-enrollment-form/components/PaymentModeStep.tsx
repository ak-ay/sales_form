'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentModeStepProps {
  formData: {
    learningMode: string;
    paymentMode: string;
  };
  errors: {
    paymentMode?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PaymentModeStep = ({ formData, errors, onInputChange }: PaymentModeStepProps) => {
  const offlinePaymentOptions = [
    { value: 'full-payment', label: 'Full Payment', description: 'Pay the complete course fee upfront' },
  ];

  const onlinePaymentOptions = [
    { value: 'full-payment', label: 'Full Payment', description: 'Pay the complete course fee upfront' },
    { 
      value: 'part-payment', 
      label: 'Part Payment', 
      description: 'Pay in installments over time'
    },
    { 
      value: 'decoding-technical-analysis', 
      label: 'Only Decoding Technical Analysis (Phase 1)', 
      description: 'Access only technical analysis module'
    },
  ];

  const paymentOptions = formData.learningMode === 'offline' ? offlinePaymentOptions : onlinePaymentOptions;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body mb-3">
          Payment
        </p>
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-2">
          Payment Mode
        </h2>
        <p className="text-muted-foreground font-body">
          Choose your preferred payment option
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-3">
            Payment Mode <span className="text-error">*</span>
          </label>
          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onInputChange('paymentMode', option.value)}
                className={`w-full p-4 border rounded-2xl transition-all duration-200 text-left bg-white/70 ${
                  formData.paymentMode === option.value
                    ? 'border-primary bg-primary/5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]'
                    : 'border-border/60 hover:border-primary/40'
                }`}
                aria-label={`Select ${option.label}`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-2xl ${formData.paymentMode === option.value ? 'bg-primary' : 'bg-muted'}`}>
                    <Icon
                      name="CreditCardIcon"
                      size={24}
                      variant="outline"
                      className={formData.paymentMode === option.value ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-foreground mb-1">{option.label}</h3>
                    <p className="text-sm text-muted-foreground font-body">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.paymentMode && (
            <p className="mt-2 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.paymentMode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModeStep;
