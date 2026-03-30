"use client";

import { useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { Spinner } from "../reusables/spinner";

export interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: ReactNode;
  title: string;
  description: string;
  buttonCount?: 1 | 2;
  buttons?: ModalButton[];
}

export function FeedbackModal({
  isOpen,
  onClose,
  icon,
  title,
  description,
  buttonCount = 1,
  buttons = [],
}: FeedbackModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const resolvedButtons = buttons.slice(0, buttonCount);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-50 backdrop-blur-sm bg-[#D1D4DB80]/50"
      />

      {/* Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-130 bg-background shadow-lg overflow-hidden"
          style={{ animation: "modalIn 0.2s ease-out both" }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 flex items-center rounded-lg cursor-pointer justify-center border border-(--grey-1) hover:bg-(--grey-4) transition-colors"
          >
            <AiOutlineClose className="w-4 h-4 text-(--text-1)" />
          </button>

          <div className="flex flex-col items-center text-center px-8 pt-14 pb-2 gap-4">
            {icon && <div className="mb-1">{icon}</div>}

            <h2 className="text-lg font-bold text-foreground">{title}</h2>

            <p className="text-sm text-(--text-1) leading-relaxed max-w-85">
              {description}
            </p>
          </div>

          {resolvedButtons.length > 0 && (
            <div
              className={`flex gap-3 p-6 pt-8 ${
                buttonCount === 2 ? "flex-row" : "flex-col"
              }`}
            >
              {resolvedButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.onClick}
                  disabled={btn.disabled || btn.loading}
                  className={`
                    flex-1 flex items-center justify-center gap-2
                    py-4 px-6 rounded-xl font-medium text-sm
                    transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                    ${
                      btn.variant === "outline"
                        ? "border border-(--grey-1) bg-background text-foreground"
                        : "bg-foreground text-background"
                    }
                  `}
                >
                  {btn.loading && <Spinner />}
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>,
    document.body,
  );
}
