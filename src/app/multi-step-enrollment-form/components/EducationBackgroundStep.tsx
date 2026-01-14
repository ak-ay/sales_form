'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface EducationBackgroundStepProps {
  formData: {
    highestQualification: string;
    fieldOfStudy: string;
    currentOccupation: string;
    yearsOfExperience: string;
    tradingExperience: string;
  };
  errors: {
    highestQualification?: string;
    fieldOfStudy?: string;
    currentOccupation?: string;
    yearsOfExperience?: string;
    tradingExperience?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const EducationBackgroundStep = ({ formData, errors, onInputChange }: EducationBackgroundStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Education & Background
        </h2>
        <p className="text-muted-foreground font-body">
          Help us understand your educational background and professional experience
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="highestQualification" className="block text-sm font-body font-semibold text-foreground mb-2">
            Highest Qualification <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="highestQualification"
              value={formData.highestQualification}
              onChange={(e) => onInputChange('highestQualification', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                errors.highestQualification
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              aria-label="Highest Qualification"
              aria-describedby={errors.highestQualification ? 'qualification-error' : undefined}
            >
              <option value="">Select Qualification</option>
              <option value="high-school">High School (10th/12th)</option>
              <option value="diploma">Diploma</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="doctorate">Doctorate/PhD</option>
              <option value="professional">Professional Certification</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
          </div>
          {errors.highestQualification && (
            <p id="qualification-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.highestQualification}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="fieldOfStudy" className="block text-sm font-body font-semibold text-foreground mb-2">
            Field of Study <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="AcademicCapIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              type="text"
              id="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={(e) => onInputChange('fieldOfStudy', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.fieldOfStudy
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              placeholder="e.g., Computer Science, Finance, Engineering"
              aria-label="Field of Study"
              aria-describedby={errors.fieldOfStudy ? 'field-error' : undefined}
            />
          </div>
          {errors.fieldOfStudy && (
            <p id="field-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.fieldOfStudy}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currentOccupation" className="block text-sm font-body font-semibold text-foreground mb-2">
            Current Occupation <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="BriefcaseIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              type="text"
              id="currentOccupation"
              value={formData.currentOccupation}
              onChange={(e) => onInputChange('currentOccupation', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.currentOccupation
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              placeholder="e.g., Software Engineer, Business Analyst"
              aria-label="Current Occupation"
              aria-describedby={errors.currentOccupation ? 'occupation-error' : undefined}
            />
          </div>
          {errors.currentOccupation && (
            <p id="occupation-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.currentOccupation}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-body font-semibold text-foreground mb-2">
            Years of Professional Experience <span className="text-error">*</span>
          </label>
          <div className="relative">
            <select
              id="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={(e) => onInputChange('yearsOfExperience', e.target.value)}
              className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                errors.yearsOfExperience
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              aria-label="Years of Experience"
              aria-describedby={errors.yearsOfExperience ? 'experience-error' : undefined}
            >
              <option value="">Select Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
          </div>
          {errors.yearsOfExperience && (
            <p id="experience-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.yearsOfExperience}
            </p>
          )}
        </div>

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

export default EducationBackgroundStep;