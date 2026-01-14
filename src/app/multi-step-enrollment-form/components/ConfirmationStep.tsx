'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { getCounselorDisplay } from '@/utils/counselors';

interface ConfirmationStepProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    tradingExperience: string;
    learningMode: string;
    courseLevel: string;
    preferredBatchMonth: string;
    preferredTimeSlot: string;
    learningGoals: string[];
    paymentMode: string;
    selectedCounselor: string;
  };
}

const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatLearningGoals = (goals: string[]) => {
    if (!goals || goals.length === 0) return 'Not specified';
    const goalLabels: { [key: string]: string } = {
      'career-change': 'Career Change to Trading',
      'side-income': 'Generate Side Income',
      'skill-development': 'Skill Development',
      'portfolio-management': 'Portfolio Management',
      'financial-independence': 'Financial Independence',
      'investment-knowledge': 'Investment Knowledge',
    };
    return goals.map(goal => goalLabels[goal] || goal).join(', ');
  };

  const formatPaymentMode = (mode: string) => {
    if (!mode) return 'Not selected';
    const modeLabels: { [key: string]: string } = {
      'full-payment': 'Full Payment',
      'part-payment': 'Part Payment',
      'decoding-derivatives': 'Only Decoding Derivatives',
      'decoding-price-action': 'Only Decoding Price Action',
      'futures-options': 'Only Futures and Options',
    };
    return modeLabels[mode] || mode;
  };

  const getCounselorName = (id: string) => getCounselorDisplay(id, { includeSpecialization: true });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
          <Icon name="CheckCircleIcon" size={40} variant="solid" className="text-success" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-primary mb-2">
          Review Your Enrollment
        </h2>
        <p className="text-muted-foreground font-body">
          Please review your information before submitting your enrollment
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="UserIcon" size={24} variant="outline" className="text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-foreground">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Full Name</p>
              <p className="font-body font-semibold text-foreground">{formData.fullName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Email Address</p>
              <p className="font-body font-semibold text-foreground">{formData.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Phone Number</p>
              <p className="font-body font-semibold text-foreground">{formData.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Date of Birth</p>
              <p className="font-body font-semibold text-foreground">{formatDate(formData.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Gender</p>
              <p className="font-body font-semibold text-foreground capitalize">{formData.gender?.replace('-', ' ') || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="ChartBarIcon" size={24} variant="outline" className="text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-foreground">Trading Experience</h3>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-body mb-1">Experience Level</p>
            <p className="font-body font-semibold text-foreground capitalize">{formData.tradingExperience || 'Not specified'}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="BookOpenIcon" size={24} variant="outline" className="text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold text-foreground">Course Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Learning Mode</p>
              <p className="font-body font-semibold text-foreground capitalize">{formData.learningMode || 'Not selected'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Course Level</p>
              <p className="font-body font-semibold text-foreground capitalize">{formData.courseLevel?.replace('-', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-body mb-1">Preferred Batch</p>
              <p className="font-body font-semibold text-foreground capitalize">{formData.preferredBatchMonth?.replace('-', ' ') || 'Not specified'}</p>
            </div>
            {formData.learningMode === 'offline' && formData.preferredTimeSlot && (
              <div>
                <p className="text-sm text-muted-foreground font-body mb-1">Time Slot</p>
                <p className="font-body font-semibold text-foreground capitalize">{formData.preferredTimeSlot}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground font-body mb-1">Learning Goals</p>
              <p className="font-body font-semibold text-foreground">{formatLearningGoals(formData.learningGoals)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 text-primary-foreground">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary-foreground/20 rounded-lg">
              <Icon name="CreditCardIcon" size={24} variant="outline" className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-headline font-bold">Payment & Counselor</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm opacity-90 font-body mb-1">Payment Mode</p>
              <p className="font-body font-semibold text-lg">{formatPaymentMode(formData.paymentMode)}</p>
            </div>
            <div className="border-t border-primary-foreground/20 pt-3">
              <p className="text-sm opacity-90 font-body mb-1">Assigned Counselor</p>
              <p className="font-body font-semibold text-lg">{getCounselorName(formData.selectedCounselor)}</p>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={24} variant="solid" className="text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-body font-semibold text-foreground mb-2">Next Steps</h4>
              <ul className="space-y-1 text-sm text-muted-foreground font-body">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You will receive a confirmation email with enrollment details</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Your assigned counselor will contact you within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment instructions will be sent to your registered email</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access to student portal will be granted after payment confirmation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
