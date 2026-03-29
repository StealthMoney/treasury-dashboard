import Image from "next/image";

type KybStatus = "unverified" | "inreview" | "failed";

interface KybBannerProps {
  kybStatus: KybStatus;
  onAction: () => void;
}

export default function KybBanner({ kybStatus, onAction }: KybBannerProps) {
  const contentMap = {
    unverified: {
      header: "Upgrade Your Account",
      text: "Upgrade your account by verifying your business (KYB) to unlock all platform features.",
      button: "Upgrade your account",
    },
    inreview: {
      header: "Your verification is under review",
      text: "We’re reviewing your business details. This usually takes 24–48 hours. You’ll be notified once your account is approved.",
      button: null,
    },
    failed: {
      header: "Verification failed.",
      text: "We couldn’t verify your business details. Please review your information and try again.",
      button: "Retry verification",
    },
  };

  const current = contentMap[kybStatus];

  if (!current) return null;

  return (
    <div className="w-full rounded-2xl mb-8 border bg-[#FFF6F0] border-[#FFC299] px-6 flex md:flex-row flex-col justify-between items-center">
      <div className="md:max-w-[40%] w-full space-y-1">
        <h1 className="text-foreground font-semibold text-[20px]">
          {current.header}
        </h1>

        <p className="text-[#602600] text-[14px]">{current.text}</p>

        {current.button && (
          <button
            onClick={onAction}
            className="bg-foreground text-background px-2 py-2 rounded-lg mt-1"
          >
            {current.button}
          </button>
        )}
      </div>

      <div className="md:flex hidden">
        <Image
          src={
            kybStatus === "unverified"
              ? "/images/prompt.svg"
              : kybStatus === "inreview"
                ? "/images/under_review.svg"
                : "/images/failed.svg"
          }
          alt="kyb_status"
          className="w-full"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
