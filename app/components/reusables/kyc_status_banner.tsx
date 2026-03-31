import Image from "next/image";

type KycStatus = "pending" | "success";

interface Props {
  status?: KycStatus;
}

export default function Kyc_status_banner({ status = "pending" }: Props) {
  const isSuccess = status === "success";

  return (
    <div
      className={`w-full rounded-2xl flex justify-between items-center px-4 py-4 border ${
        isSuccess
          ? "border-[#B8EBAD] bg-[#F8FDF7]"
          : "border-[#FFC299] bg-[#FFF6F0]"
      }`}
    >
      <div className="flex flex-col gap-y-2 md:w-[80%] w-full">
        <h1
          className={`font-semibold text-[20px] ${
            isSuccess ? "text-[#43B929]" : "text-[#F97216]"
          }`}
        >
          {isSuccess ? "Account upgrade successful" : "Account upgrade"}
        </h1>

        <small
          className={`md:max-w-[60%] text-[14px] ${
            isSuccess ? "text-[#2E7D32]" : "text-[#602600]"
          }`}
        >
          {isSuccess
            ? "Your business activation request has been approved. You’re good to go 🎉"
            : "We will review your document and get back to you shortly after submission, Sit tight!"}
        </small>
      </div>

      <div className="md:flex hidden w-20 h-20">
        <Image
          width={100}
          height={100}
          src={isSuccess ? "/images/success.svg" : "/images/pending.svg"}
          alt="status"
        />
      </div>
    </div>
  );
}
