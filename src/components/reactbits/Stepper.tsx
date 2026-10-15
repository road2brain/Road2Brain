import React, { useState, Children, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/Button';

export interface StepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Step: React.FC<StepProps> = ({ children }) => {
  return <div className="py-2">{children}</div>;
};

export interface StepperProps {
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  finishButtonText?: string;
  className?: string;
  children: React.ReactNode;
}

export const Stepper: React.FC<StepperProps> = ({
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  finishButtonText = 'Finish Tour',
  className = '',
  children,
}) => {
  const steps = Children.toArray(children).filter(isValidElement) as React.ReactElement<StepProps>[];
  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState(Math.max(1, Math.min(initialStep, totalSteps)));
  const [direction, setDirection] = useState(1);

  const goToStep = (stepNumber: number) => {
    const target = Math.max(1, Math.min(stepNumber, totalSteps));
    setDirection(target > currentStep ? 1 : -1);
    setCurrentStep(target);
    onStepChange?.(target);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      onFinalStepCompleted?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const activeChild = steps[currentStep - 1];

  return (
    <div className={cn('bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 sm:p-8', className)}>
      {/* 1. Header Step Tracker */}
      <div className="flex items-center justify-between relative mb-8">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
        
        {/* Active Progress Fill Line */}
        <motion.div
          className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-brand-blue to-brand-teal -z-0"
          initial={false}
          animate={{
            width: totalSteps > 1 ? `${((currentStep - 1) / (totalSteps - 1)) * 100}%` : '0%',
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => goToStep(stepNum)}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm',
                  isDone && 'bg-emerald-500 text-white shadow-emerald-500/20',
                  isCurrent && 'bg-brand-blue text-white ring-4 ring-blue-100 shadow-blue-500/30 scale-110',
                  !isDone && !isCurrent && 'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-300'
                )}
                aria-label={`Step ${stepNum}: ${step.props.title}`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </button>
              <span
                className={cn(
                  'text-[11px] font-semibold mt-2 hidden sm:block transition-colors',
                  isCurrent ? 'text-brand-blue font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                )}
              >
                {step.props.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. Step Content Body */}
      <div className="relative min-h-[220px] overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            {activeChild}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Action Controls */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="font-bold text-xs rounded-xl"
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          {backButtonText}
        </Button>

        <span className="text-xs font-semibold text-slate-400">
          Step {currentStep} of {totalSteps}
        </span>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleNext}
          className="font-bold text-xs rounded-xl"
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {currentStep === totalSteps ? finishButtonText : nextButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Stepper;
