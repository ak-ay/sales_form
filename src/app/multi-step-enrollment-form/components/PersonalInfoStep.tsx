'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  };
  errors: {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoStep = ({ formData, errors, onInputChange }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Personal Information
        </h2>
        <p className="text-muted-foreground font-body">
          Let's start with your basic details to personalize your learning journey
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-body font-semibold text-foreground mb-2">
            Full Name <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="UserIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onInputChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.fullName
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              placeholder="Enter your full name"
              aria-label="Full Name"
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
          </div>
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-body font-semibold text-foreground mb-2">
            Email Address <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="EnvelopeIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              placeholder="your.email@example.com"
              aria-label="Email Address"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-body font-semibold text-foreground mb-2">
            Phone Number <span className="text-error">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="PhoneIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.phone
                  ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
              }`}
              placeholder="+91 98765 43210"
              aria-label="Phone Number"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
          </div>
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-error font-body flex items-center">
              <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-body font-semibold text-foreground mb-2">
              Date of Birth <span className="text-error">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
              <input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.dateOfBirth
                    ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
                }`}
                aria-label="Date of Birth"
                aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
              />
            </div>
            {errors.dateOfBirth && (
              <p id="dateOfBirth-error" className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-body font-semibold text-foreground mb-2">
              Gender <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => onInputChange('gender', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md font-body focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                  errors.gender
                    ? 'border-error focus:ring-error/20' :'border-input focus:ring-accent/20'
                }`}
                aria-label="Gender"
                aria-describedby={errors.gender ? 'gender-error' : undefined}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="ChevronDownIcon" size={20} variant="outline" className="text-muted-foreground" />
              </div>
            </div>
            {errors.gender && (
              <p id="gender-error" className="mt-1 text-sm text-error font-body flex items-center">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                {errors.gender}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;