'use client';

import React from 'react';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const FormProgressBar = ({ currentStep, totalSteps, stepLabels }: FormProgressBarProps) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-10">
      <div className="relative">
        <div className="flex justify-between mb-2">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-cta font-semibold text-xs mb-2 transition-all duration-300 ${
                  index + 1 < currentStep
                    ? 'bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(10,132,255,0.35)]'
                    : index + 1 === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              <span className="text-xs font-body font-medium text-center hidden sm:block">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormProgressBar;
