interface KYBStepWrapperProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function KYBStepWrapper({
  title,
  children,
  footer,
}: KYBStepWrapperProps) {
  return (
    <div className="border border-(--grey-1) space-y-6 rounded-lg">
      {/* Header */}
      <div className="bg-(--grey-4) px-4 py-4 rounded-tl-lg rounded-tr-lg">
        <p className="font-semibold text-foreground text-[14px]">{title}</p>
      </div>

      {/* Body */}
      <div className="bg-background px-6 py-8 space-y-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex gap-4 pt-6 justify-center px-6 pb-6">{footer}</div>
      )}
    </div>
  );
}
