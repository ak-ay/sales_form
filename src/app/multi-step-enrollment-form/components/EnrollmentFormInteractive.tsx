'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import FormProgressBar from './FormProgressBar';
import PersonalInfoStep from './PersonalInfoStep';
import TradingExperienceStep from './TradingExperienceStep';
import CoursePreferencesStep from './CoursePreferencesStep';
import PaymentModeStep from './PaymentModeStep';
import PriceAndCounselorStep from './PriceAndCounselorStep';
import { submitToGoogleSheets } from '@/utils/googleSheetsService';
import { createEnrollmentRecord, isSupabaseConfigured } from '@/utils/enrollmentService';
import { getCounselorDisplay } from '@/utils/counselors';
import { findPaymentOption } from '@/utils/pricing';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  tradingExperience: string;
  learningMode: string;
  preferredBatchMonth: string;
  preferredTimeSlot: string;
  learningGoals: string[];
  paymentMode: string;
  selectedCounselor: string;
}

interface FormErrors {
  [key: string]: string;
}

const EnrollmentFormInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    tradingExperience: '',
    learningMode: '',
    preferredBatchMonth: '',
    preferredTimeSlot: '',
    learningGoals: [],
    paymentMode: '',
    selectedCounselor: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState<string>('');

  const totalSteps = 5;
  const stepLabels = ['Personal', 'Experience', 'Preferences', 'Payment', 'Price'];
  const coursePrice = 49999;
  const discount = 5000;

  useEffect(() => {
    setIsHydrated(true);
    const savedData = localStorage.getItem('enrollmentFormData');
    const savedStep = localStorage.getItem('enrollmentFormStep');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('enrollmentFormData', JSON.stringify(formData));
      localStorage.setItem('enrollmentFormStep', currentStep.toString());
    }
  }, [formData, currentStep, isHydrated]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (field === 'learningGoals') {
      setFormData(prev => ({
        ...prev,
        learningGoals: checked
          ? [...prev.learningGoals, value]
          : prev.learningGoals.filter(goal => goal !== value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: checked }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }

    if (step === 2) {
      if (!formData.tradingExperience) newErrors.tradingExperience = 'Trading experience is required';
    }

    if (step === 3) {
      if (!formData.learningMode) newErrors.learningMode = 'Please select a learning mode';
      if (!formData.preferredBatchMonth) newErrors.preferredBatchMonth = 'Please select a batch month';
      if (formData.learningMode === 'offline' && !formData.preferredTimeSlot) {
        newErrors.preferredTimeSlot = 'Please select a time slot';
      }
      if (formData.learningGoals.length === 0) newErrors.learningGoals = 'Please select at least one learning goal';
    }

    if (step === 4) {
      if (!formData.paymentMode) newErrors.paymentMode = 'Please select a payment mode';
    }

    if (step === 5) {
      if (!formData.selectedCounselor) newErrors.selectedCounselor = 'Please select a counselor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    // Reset counselor selection when navigating back from price step
    if (currentStep === 5) {
      setFormData(prev => ({ ...prev, selectedCounselor: '' }));
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // Generate enrollment ID
      const enrollmentId = `TMA${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const counselorName = getCounselorDisplay(formData.selectedCounselor, { includeSpecialization: false });
      const paymentOption = findPaymentOption(formData.learningMode, formData.paymentMode);
      const hasDiscount = Boolean(formData.selectedCounselor && paymentOption?.discountedPrice);
      const totalFee = paymentOption?.price;
      const finalFee = hasDiscount ? paymentOption?.discountedPrice : paymentOption?.price;
      const discountFee = hasDiscount && typeof paymentOption?.price === 'number' && typeof paymentOption?.discountedPrice === 'number'
        ? paymentOption.price - paymentOption.discountedPrice
        : 0;
      const paymentModeLabel = paymentOption?.label;
      
      // CRITICAL: Submit to Google Sheets - enrollment will fail if this fails
      console.log('📊 Submitting enrollment data to Google Sheets...');
      
      const sheetsResult = await submitToGoogleSheets({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        learningMode: formData.learningMode,
        preferredBatchMonth: formData.preferredBatchMonth,
        preferredTimeSlot: formData.preferredTimeSlot,
        paymentMode: formData.paymentMode,
        selectedCounselor: counselorName,
        courseName: formData.learningMode,
        batchMonth: formData.preferredBatchMonth,
        trainingMode: formData.learningMode,
        paymentModeLabel,
        totalFee,
        discountFee,
        finalFee,
        timestamp: new Date().toISOString(),
        enrollmentId: enrollmentId,
      });
      
      setTokenNumber(typeof sheetsResult.tokenNumber === 'number' ? sheetsResult.tokenNumber : null);
      console.log('✅ Data successfully submitted to Google Sheets');

      // 🚨 NEW: Create enrollment record in Supabase for tracking reminders
      if (isSupabaseConfigured()) {
        console.log('💾 Creating enrollment record in database...');
        const enrollmentResult = await createEnrollmentRecord({
          enrollmentId: enrollmentId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          paymentMode: formData.paymentMode,
          selectedCounselor: counselorName,
        });

        if (!enrollmentResult.success) {
          console.warn('⚠️ Failed to create enrollment record:', enrollmentResult.error);
          // Continue with email sending even if database insert fails
        } else {
          console.log('✅ Enrollment record created successfully');
        }
      } else {
        console.warn('⚠️ Supabase not configured. Skipping enrollment record creation.');
      }

      setIsSubmitting(false);
      setShowSuccessModal(true);
      localStorage.removeItem('enrollmentFormData');
      localStorage.removeItem('enrollmentFormStep');
    } catch (error) {
      setIsSubmitting(false);
      
      // Display the error message to the user
      if (error instanceof Error) {
        setSubmissionError(error.message);
      } else {
        setSubmissionError('❌ CRITICAL ERROR: Failed to submit enrollment data to Google Sheets. Please try again or contact support.');
      }
      
      console.error('❌ ENROLLMENT FAILED - Google Sheets submission error:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTokenNumber(null);
    setCurrentStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      tradingExperience: '',
      learningMode: '',
      preferredBatchMonth: '',
      preferredTimeSlot: '',
      learningGoals: [],
      paymentMode: '',
      selectedCounselor: '',
    });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground font-body">Loading enrollment form...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-6 sm:p-8 border border-white/60">
            <FormProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />

            {/* Error Alert */}
            {submissionError && (
              <div className="mt-6 bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start space-x-3">
                <Icon name="ExclamationTriangleIcon" size={20} variant="outline" className="text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-destructive mb-1">Submission Error</p>
                  <p className="text-sm text-destructive/80">{submissionError}</p>
                  <button
                    type="button"
                    onClick={() => setSubmissionError('')}
                    className="mt-2 text-sm font-semibold text-destructive hover:text-destructive/80 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8">
              {currentStep === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}
              {currentStep === 2 && (
                <TradingExperienceStep
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}
              {currentStep === 3 && (
                <CoursePreferencesStep
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onCheckboxChange={handleCheckboxChange}
                />
              )}
              {currentStep === 4 && (
                <PaymentModeStep
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}
              {currentStep === 5 && (
                <PriceAndCounselorStep
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                />
              )}
            </div>

            {currentStep < totalSteps && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border/60">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-3 border border-border text-foreground/80 rounded-full font-cta font-semibold hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Icon name="ArrowLeftIcon" size={20} variant="outline" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all"
                >
                  <span>Continue</span>
                  <Icon name="ArrowRightIcon" size={20} variant="outline" />
                </button>
              </div>
            )}

            {currentStep === totalSteps && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border/60">
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-6 py-3 border border-border text-foreground/80 rounded-full font-cta font-semibold hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Icon name="ArrowLeftIcon" size={20} variant="outline" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Enroll Now'}</span>
                  <Icon name="ArrowRightIcon" size={20} variant="outline" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 rounded-3xl shadow-[0_30px_80px_rgba(15,23,42,0.25)] max-w-md w-full p-8 animate-fade-in border border-white/60">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/15 rounded-full mb-4">
                <Icon name="CheckCircleIcon" size={40} variant="solid" className="text-success" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-slate-900 mb-2">
                Pre-Booking Successful
              </h3>
              <p className="text-slate-600 font-body">
                You have successfully pre-booked your seat. Pay the remaining amount within 10 days.
              </p>
              {tokenNumber !== null && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm text-emerald-800 font-body">
                    Your token number has been emailed to you.
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setTokenNumber(null);
                  localStorage.removeItem('enrollmentFormData');
                  localStorage.removeItem('enrollmentFormStep');
                  window.location.href = '/';
                }}
                className="mt-6 w-full px-6 py-3 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnrollmentFormInteractive;
