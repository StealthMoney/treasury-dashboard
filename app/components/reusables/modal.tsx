"use client";

import React, { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";
import Image from "next/image";

export interface StepConfig {
  title: string;
  description?: string;
  content: ReactNode;
  actionLabel?: string;
  showBackButton?: boolean;
}

export interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  steps: StepConfig[];
  currentStep: number;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onSubmit?: () => void;
  isSuccess?: boolean;
  successTitle?: string;
  successMessage?: string | ReactNode;
  successButtonLabel?: string;
  successtable?: ReactNode;
}

export const StepModal: React.FC<StepModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  steps,
  currentStep,
  onNextStep,
  onPreviousStep,
  onSubmit,
  isSuccess,
  successTitle,
  successMessage,
  successButtonLabel,
  successtable,
}) => {
  if (!isOpen) return null;

  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right-side Panel Modal */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-lg bg-white shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 shrink-0">
          <div>
            <h2 className="text-[20px] font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-[14px] text-(--text-1) mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition shrink-0"
            aria-label="Close modal"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            /* Success Screen */
            <>
              <div className="flex flex-col items-center justify-center py-8">
                <Image
                  src={"/images/success.svg"}
                  width={100}
                  height={100}
                  alt="success"
                  className="w-24 h-24 mb-6"
                />

                <h3 className="text-[20px] font-bold text-foreground text-center mb-2">
                  {successTitle}
                </h3>
                <p className="text-[14px] text-(--text-1) text-center">
                  {successMessage}
                </p>
              </div>

              {successtable}
            </>
          ) : (
            /* Step Content */
            <>
              <div className="mb-6">
                <p className="text-[16px] font-semibold text-center tracking-wide">
                  <span className="text-foreground">
                    STEP {currentStep + 1}
                  </span>
                  <span className="text-(--text-1)">
                    /{steps.length} - {currentStepConfig.title}{" "}
                  </span>
                </p>
              </div>
              <div>{currentStepConfig.content}</div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className=" p-6 flex gap-3 shrink-0 bg-background">
          {!isSuccess && (
            <button
              onClick={onPreviousStep}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-3 text-gray-900 font-semibold border border-(--grey-1) rounded-lg hover:bg-(--grey-1) transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go Back
            </button>
          )}
          <button
            onClick={
              isSuccess
                ? onClose
                : isLastStep
                  ? onSubmit || onNextStep
                  : onNextStep
            }
            className={`flex-1 px-4 py-3 rounded-lg transition cursor-pointer ${
              isSuccess
                ? "bg-foreground text-background hover:bg-foreground/85"
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
          >
            {isSuccess
              ? successButtonLabel || "Close"
              : isLastStep
                ? "Submit"
                : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
