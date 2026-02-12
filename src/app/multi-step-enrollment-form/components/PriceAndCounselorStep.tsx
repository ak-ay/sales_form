'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { counselors } from '@/utils/counselors';
import { getPaymentOptions, isEarlyBirdWindow } from '@/utils/pricing';

interface PriceAndCounselorStepProps {
  formData: {
    learningMode: string;
    paymentMode: string;
    selectedCounselor: string;
  };
  errors: {
    selectedCounselor?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PriceAndCounselorStep = ({ formData, errors, onInputChange }: PriceAndCounselorStepProps) => {
  const [availableCounselors, setAvailableCounselors] = useState<typeof counselors>([]);
  const [counselorLoadError, setCounselorLoadError] = useState('');
  const [counselorSearch, setCounselorSearch] = useState('');
  const [isLoadingCounselors, setIsLoadingCounselors] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCounselors = async () => {
      try {
        const response = await fetch('/api/counselors');
        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(result?.error || 'Failed to load counselors');
        }

        if (isMounted && Array.isArray(result.counselors)) {
          setAvailableCounselors(result.counselors);
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : 'Failed to load counselors';
          setCounselorLoadError(message);
          if (message.includes('COUNSELORS_SHEET_CSV_URL')) {
            setAvailableCounselors(counselors);
          } else {
            setAvailableCounselors([]);
          }
        }
      } finally {
        if (isMounted) setIsLoadingCounselors(false);
      }
    };

    loadCounselors();

    return () => {
      isMounted = false;
    };
  }, []);
  const earlyBirdActive = isEarlyBirdWindow();
  const paymentOptions = getPaymentOptions(formData.learningMode);
  const selectedOption = paymentOptions.find(opt => opt.value === formData.paymentMode);

  const filteredCounselors = useMemo(() => {
    const query = counselorSearch.trim().toLowerCase();
    if (!query) return availableCounselors;
    return availableCounselors.filter((counselor) =>
      counselor.name.toLowerCase().includes(query)
    );
  }, [availableCounselors, counselorSearch]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body mb-3">
          Pricing
        </p>
        <h2 className="text-3xl font-headline font-semibold text-foreground mb-2">
          Course Price & Discount
        </h2>
        <p className="text-muted-foreground font-body">
          Review your price and select a counselor
        </p>
      </div>

      {/* Price Display Section */}
      <div className="bg-white/70 border border-white/60 rounded-3xl p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className={`mb-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ${
          earlyBirdActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {earlyBirdActive
            ? 'Early Bird pricing is active (19th - 27th)'
            : 'Early Bird pricing is closed (opens 19th - 27th)'}
        </div>
        <div className="mb-4">
          <Icon name="CreditCardIcon" size={42} variant="outline" className="text-primary mx-auto" />
        </div>
        <h3 className="text-lg font-body font-semibold text-foreground mb-2">
          {selectedOption?.label}
        </h3>
        
        {selectedOption && 'price' in selectedOption && (
          <div className="space-y-2">
            {earlyBirdActive && 'discountedPrice' in selectedOption && typeof selectedOption.discountedPrice === 'number' ? (
              <>
                <div className="text-2xl text-muted-foreground line-through font-body">
                  ₹{selectedOption.price.toLocaleString()}
                </div>
                <div className="text-5xl font-semibold text-primary font-headline">
                  ₹{selectedOption.discountedPrice.toLocaleString()}
                </div>
                <div className="inline-flex items-center bg-success/10 text-success px-4 py-2 rounded-full text-sm font-semibold font-body mt-2">
                  <Icon name="CheckCircleIcon" size={16} variant="solid" className="inline mr-1" />
                  Discount Applied!
                </div>
              </>
            ) : (
              <div className="text-5xl font-semibold text-foreground font-headline">
                ₹{selectedOption.price.toLocaleString()}
              </div>
            )}
            
            {selectedOption.value === 'part-payment' && selectedOption.installments && (
              <p className="text-sm text-muted-foreground font-body mt-3">
                {earlyBirdActive ? selectedOption.installments.discounted : selectedOption.installments.regular}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Counselor Selection Section */}
      <div className="bg-white/75 border border-white/60 rounded-3xl p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="mb-4">
          <h3 className="text-xl font-headline font-semibold text-foreground mb-2 flex items-center">
            <Icon name="UserGroupIcon" size={22} variant="outline" className="mr-2 text-primary" />
            Select Counselor
          </h3>
          <p className="text-sm text-muted-foreground font-body">
            Choose your counselor for enrollment support
          </p>
        </div>

        <div>
          <label htmlFor="selectedCounselor" className="block text-sm font-body font-semibold text-foreground mb-2">
            Counselor <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              id="selectedCounselor"
              value={counselorSearch}
              onChange={(e) => setCounselorSearch(e.target.value)}
              placeholder="Search counselor name..."
              className={`w-full px-4 py-3 border rounded-2xl font-body focus:outline-none focus:ring-2 transition-all duration-200 bg-white/80 ${
                errors.selectedCounselor
                  ? 'border-error focus:ring-error/20' : 'border-input focus:ring-accent/20'
              }`}
              aria-label="Search counselor"
              aria-describedby={errors.selectedCounselor ? 'counselor-error' : undefined}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="MagnifyingGlassIcon" size={18} variant="outline" className="text-muted-foreground" />
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/60 bg-white/80 max-h-64 overflow-y-auto shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            {isLoadingCounselors && (
              <div className="px-4 py-3 text-sm text-muted-foreground font-body">
                Loading counselors...
              </div>
            )}
            {!isLoadingCounselors && filteredCounselors.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground font-body">
                No counselors found. Try a different search.
              </div>
            )}
            {filteredCounselors.map((counselor) => {
              const displayName = counselor.name;
              const displayLabel = counselor.name.toUpperCase();
              const isSelected = formData.selectedCounselor === displayName;
              return (
                <button
                  key={counselor.id || counselor.name}
                  type="button"
                  onClick={() => {
                    onInputChange('selectedCounselor', displayName);
                    setCounselorSearch(displayName);
                  }}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 border-border/60 font-body text-sm sm:text-base ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-black/5'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
          {errors.selectedCounselor && (
            <p id="counselor-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.selectedCounselor}
            </p>
          )}
          {counselorLoadError && (
            <p className="mt-1 text-xs text-muted-foreground font-body">
              {counselorLoadError.includes('COUNSELORS_SHEET_CSV_URL')
                ? `Showing default counselor list. ${counselorLoadError}`
                : counselorLoadError}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground font-body flex items-start">
            <Icon name="InformationCircleIcon" size={16} variant="outline" className="mr-1 mt-0.5 flex-shrink-0" />
            <span>Your selected counselor will guide you through the enrollment process and provide exclusive discount</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceAndCounselorStep;
