'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TradingExperienceStepProps {
  formData: {
    tradingExperience: string;
  };
  errors: {
    tradingExperience?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const TradingExperienceStep = ({ formData, errors, onInputChange }: TradingExperienceStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Trading Experience
        </h2>
        <p className="text-muted-foreground font-body">
          Help us understand your trading background to recommend the best course for you
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="tradingExperience" className="block text-sm font-body font-semibold text-foreground mb-2">
            Trading Experience Level <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="tradingExperience"
              value={formData.tradingExperience}
              onChange={(e) => onInputChange('tradingExperience', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                errors.tradingExperience
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              aria-label="Trading Experience"
              aria-describedby={errors.tradingExperience ? 'trading-error' : undefined}
            >
              <option value="">Select Trading Experience</option>
              <option value="beginner">Complete Beginner (No Experience)</option>
              <option value="novice">Novice (Less than 1 year)</option>
              <option value="intermediate">Intermediate (1-3 years)</option>
              <option value="advanced">Advanced (3-5 years)</option>
              <option value="expert">Expert (5+ years)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
          </div>
          {errors.tradingExperience && (
            <p id="trading-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.tradingExperience}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground font-body flex items-start">
            <Icon name="InformationCircleIcon" size={16} variant="outline" className="mr-1 mt-0.5 flex-shrink-0" />
            <span>This helps us recommend the most suitable course level for you</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingExperienceStep;