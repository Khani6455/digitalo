
import React from 'react';
import { CheckCircle2 } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
  steps: string[];
}

const CheckoutSteps = ({ currentStep, steps }: CheckoutStepsProps) => {
  return (
    <div className="my-8 flex animate-fade-in items-center justify-center">
      <nav className="flex items-center space-x-1">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className={`h-px w-12 ${index < currentStep ? 'bg-black' : 'bg-gray-200'}`} />
            )}
            <div className="flex flex-col items-center">
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium ${
                  index < currentStep 
                    ? 'border-black bg-black text-white'
                    : index === currentStep
                    ? 'border-black bg-white text-black'
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <span 
                className={`mt-1 text-xs ${
                  index <= currentStep ? 'font-medium text-black' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default CheckoutSteps;
