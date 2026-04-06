import Image from "next/image"

type KycStatus = "pending" | "success"

interface Props {
	status?: KycStatus
}

export default function Kyc_status_banner({ status = "pending" }: Props) {
	const isSuccess = status === "success"

	return (
		<div
			className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 ${
				isSuccess
					? "border-[#B8EBAD] bg-[#F8FDF7]"
					: "border-[#FFC299] bg-[#FFF6F0]"
			}`}>
			<div className="flex w-full flex-col gap-y-2 md:w-[80%]">
				<h1
					className={`text-[20px] font-semibold ${
						isSuccess ? "text-[#43B929]" : "text-[#F97216]"
					}`}>
					{isSuccess ? "Account upgrade successful" : "Account upgrade"}
				</h1>

				<small
					className={`text-[14px] md:max-w-[60%] ${
						isSuccess ? "text-[#2E7D32]" : "text-[#602600]"
					}`}>
					{isSuccess
						? "Your business activation request has been approved. You’re good to go 🎉"
						: "We will review your document and get back to you shortly after submission, Sit tight!"}
				</small>
			</div>

			<div className="hidden h-20 w-20 md:flex">
				<Image
					width={100}
					height={100}
					src={isSuccess ? "/images/success.svg" : "/images/pending.svg"}
					alt="status"
				/>
			</div>
		</div>
	)
}
