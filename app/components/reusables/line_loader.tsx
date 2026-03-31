"use client";

export const LineLoader = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div className="relative w-40 h-1 bg-(--grey-1) overflow-hidden rounded-full">
        <div className="absolute inset-y-0 w-1/2 bg-foreground animate-line-slide" />
      </div>
    </div>
  );
};
