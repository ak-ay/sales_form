'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentDetailsStepProps {
  formData: {
    paymentPlan: string;
    promoCode: string;
    agreeToTerms: boolean;
    agreeToMarketing: boolean;
  };
  errors: {
    paymentPlan?: string;
    agreeToTerms?: string;
  };
  onInputChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
  coursePrice: number;
  discount: number;
}

const PaymentDetailsStep = ({
  formData,
  errors,
  onInputChange,
  onCheckboxChange,
  coursePrice,
  discount,
}: PaymentDetailsStepProps) => {
  const finalPrice = coursePrice - discount;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Payment Details
        </h2>
        <p className="text-muted-foreground font-body">
          Choose your payment plan and complete your enrollment
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-lg text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 font-body">Course Fee</p>
              <p className="text-3xl font-headline font-bold">₹{coursePrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 font-body">Discount Applied</p>
              <p className="text-2xl font-headline font-bold text-accent">-₹{discount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-body font-semibold">Total Amount</p>
              <p className="text-3xl font-headline font-bold">₹{finalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-3">
            Payment Plan <span className="text-error">*</span>
          </label>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onInputChange('paymentPlan', 'full')}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                formData.paymentPlan === 'full' ?'border-accent bg-accent/5 shadow-md' :'border-input hover:border-accent/50'
              }`}
              aria-label="Select Full Payment Plan"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${formData.paymentPlan === 'full' ? 'bg-accent' : 'bg-muted'}`}>
                    <Icon
                      name="BanknotesIcon"
                      size={24}
                      variant="outline"
                      className={formData.paymentPlan === 'full' ? 'text-accent-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground mb-1">Full Payment</h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Pay the entire amount upfront and save 10%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-headline font-bold text-foreground">₹{(finalPrice * 0.9).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-success font-body font-semibold">Save ₹{(finalPrice * 0.1).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onInputChange('paymentPlan', 'installment')}
              className={`w-full p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                formData.paymentPlan === 'installment' ?'border-accent bg-accent/5 shadow-md' :'border-input hover:border-accent/50'
              }`}
              aria-label="Select Installment Payment Plan"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${formData.paymentPlan === 'installment' ? 'bg-accent' : 'bg-muted'}`}>
                    <Icon
                      name="CreditCardIcon"
                      size={24}
                      variant="outline"
                      className={formData.paymentPlan === 'installment' ? 'text-accent-foreground' : 'text-muted-foreground'}
                    />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground mb-1">3 Monthly Installments</h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Split payment into 3 equal monthly installments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-headline font-bold text-foreground">₹{(finalPrice / 3).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground font-body">per month</p>
                </div>
              </div>
            </button>
          </div>
          {errors.paymentPlan && (
            <p className="mt-2 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.paymentPlan}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="promoCode" className="block text-sm font-body font-semibold text-foreground mb-2">
            Promo Code <span className="text-muted-foreground font-normal">(Optional)</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="TicketIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
              <input
                type="text"
                id="promoCode"
                value={formData.promoCode}
                onChange={(e) => onInputChange('promoCode', e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-md font-body focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                placeholder="Enter promo code"
                aria-label="Promo Code"
              />
            </div>
            <button
              type="button"
              className="px-6 py-3 bg-muted text-foreground rounded-md font-cta font-semibold hover:bg-muted/80 transition-all duration-200"
              aria-label="Apply Promo Code"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => onCheckboxChange('agreeToTerms', 'true', e.target.checked)}
              className="w-5 h-5 text-accent border-input rounded focus:ring-2 focus:ring-accent/20 mt-0.5"
              aria-label="Agree to Terms and Conditions"
            />
            <span className="text-sm font-body text-foreground">
              I agree to the <a href="#" className="text-accent hover:underline font-semibold">Terms and Conditions</a> and <a href="#" className="text-accent hover:underline font-semibold">Privacy Policy</a> <span className="text-error">*</span>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="ml-8 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.agreeToTerms}
            </p>
          )}

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeToMarketing}
              onChange={(e) => onCheckboxChange('agreeToMarketing', 'true', e.target.checked)}
              className="w-5 h-5 text-accent border-input rounded focus:ring-2 focus:ring-accent/20 mt-0.5"
              aria-label="Agree to Marketing Communications"
            />
            <span className="text-sm font-body text-foreground">
              I agree to receive marketing communications and updates about courses
            </span>
          </label>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="ShieldCheckIcon" size={24} variant="solid" className="text-success flex-shrink-0" />
            <div>
              <h4 className="font-body font-semibold text-foreground mb-1">Secure Payment</h4>
              <p className="text-sm text-muted-foreground font-body">
                Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsStep;