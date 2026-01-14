'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CoursePreferencesStepProps {
  formData: {
    learningMode: string;
    preferredBatchMonth: string;
    preferredTimeSlot: string;
    learningGoals: string[];
  };
  errors: {
    learningMode?: string;
    preferredBatchMonth?: string;
    preferredTimeSlot?: string;
    learningGoals?: string;
  };
  onInputChange: (field: string, value: string) => void;
  onCheckboxChange: (field: string, value: string, checked: boolean) => void;
}

const CoursePreferencesStep = ({ formData, errors, onInputChange, onCheckboxChange }: CoursePreferencesStepProps) => {
  const learningGoalsOptions = [
    { value: 'career-change', label: 'Career Change to Trading', icon: 'BriefcaseIcon' },
    { value: 'side-income', label: 'Generate Side Income', icon: 'CurrencyRupeeIcon' },
    { value: 'skill-development', label: 'Skill Development', icon: 'AcademicCapIcon' },
    { value: 'portfolio-management', label: 'Portfolio Management', icon: 'ChartBarIcon' },
    { value: 'financial-independence', label: 'Financial Independence', icon: 'BanknotesIcon' },
    { value: 'investment-knowledge', label: 'Investment Knowledge', icon: 'LightBulbIcon' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Course Preferences
        </h2>
        <p className="text-muted-foreground font-body">
          Customize your learning experience based on your preferences and goals
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-3">
            Learning Mode <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onInputChange('learningMode', 'online')}
              className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                formData.learningMode === 'online' ?'border-accent bg-accent/5 shadow-md' :'border-input hover:border-accent/50'
              }`}
              aria-label="Select Online Learning Mode"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${formData.learningMode === 'online' ? 'bg-accent' : 'bg-muted'}`}>
                  <Icon
                    name="ComputerDesktopIcon"
                    size={24}
                    variant="outline"
                    className={formData.learningMode === 'online' ? 'text-accent-foreground' : 'text-muted-foreground'}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-foreground mb-1">Online Learning</h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Learn from anywhere with live sessions and recorded content
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onInputChange('learningMode', 'offline')}
              className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                formData.learningMode === 'offline' ?'border-accent bg-accent/5 shadow-md' :'border-input hover:border-accent/50'
              }`}
              aria-label="Select Offline Learning Mode"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${formData.learningMode === 'offline' ? 'bg-accent' : 'bg-muted'}`}>
                  <Icon
                    name="BuildingOffice2Icon"
                    size={24}
                    variant="outline"
                    className={formData.learningMode === 'offline' ? 'text-accent-foreground' : 'text-muted-foreground'}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-body font-semibold text-foreground mb-1">Offline Learning</h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Attend in-person classes with direct instructor interaction
                  </p>
                </div>
              </div>
            </button>
          </div>
          {errors.learningMode && (
            <p className="mt-2 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.learningMode}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="preferredBatchMonth" className="block text-sm font-body font-semibold text-foreground mb-2">
            Preferred Batch Month <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="preferredBatchMonth"
              value={formData.preferredBatchMonth}
              onChange={(e) => onInputChange('preferredBatchMonth', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                errors.preferredBatchMonth
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              aria-label="Preferred Batch Month"
              aria-describedby={errors.preferredBatchMonth ? 'batch-error' : undefined}
            >
              <option value="">Select Month</option>
              <option value="february-2026">February 2026</option>
              <option value="march-2026">March 2026 (Popular)</option>
              <option value="april-2026">April 2026</option>
              <option value="may-2026">May 2026</option>
              <option value="june-2026">June 2026</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
          </div>
          {errors.preferredBatchMonth && (
            <p id="batch-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.preferredBatchMonth}
            </p>
          )}
        </div>

        {formData.learningMode === 'offline' && (
          <div>
            <label htmlFor="preferredTimeSlot" className="block text-sm font-body font-semibold text-foreground mb-2">
              Preferred Time Slot <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="preferredTimeSlot"
                value={formData.preferredTimeSlot}
                onChange={(e) => onInputChange('preferredTimeSlot', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                  errors.preferredTimeSlot
                    ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
                }`}
                aria-label="Preferred Time Slot"
                aria-describedby={errors.preferredTimeSlot ? 'time-error' : undefined}
              >
                <option value="">Select Time Slot</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
            </div>
            {errors.preferredTimeSlot && (
              <p id="time-error" className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                {errors.preferredTimeSlot}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-body font-semibold text-foreground mb-3">
            Learning Goals <span className="text-error">*</span> <span className="text-muted-foreground font-normal">(Select all that apply)</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {learningGoalsOptions.map((goal) => (
              <label
                key={goal.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.learningGoals.includes(goal.value)
                    ? 'border-accent bg-accent/5' :'border-input hover:border-accent/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.learningGoals.includes(goal.value)}
                  onChange={(e) => onCheckboxChange('learningGoals', goal.value, e.target.checked)}
                  className="w-5 h-5 text-accent border-input rounded focus:ring-2 focus:ring-accent/20"
                  aria-label={goal.label}
                />
                <Icon
                  name={goal.icon as any}
                  size={20}
                  variant="outline"
                  className="ml-3 mr-2 text-muted-foreground"
                />
                <span className="font-body text-sm text-foreground">{goal.label}</span>
              </label>
            ))}
          </div>
          {errors.learningGoals && (
            <p className="mt-2 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.learningGoals}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreferencesStep;