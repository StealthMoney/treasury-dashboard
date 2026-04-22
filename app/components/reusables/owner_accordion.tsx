import { useState } from "react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa6"
import { DocumentReviewRow, ReviewRow } from "./review_generals"
import { OwnerInfo } from "@/app/types/general"
import { getMonthName } from "@/app/functions/helpers/get_month_name"

export default function OwnerAccordion({ owners }: { owners: OwnerInfo[] }) {
	const [expandedId, setExpandedId] = useState<string>(owners[0]?.id ?? "")

	const numberToWord = (num: number) => {
		const words = [
			"Zero",
			"One",
			"Two",
			"Three",
			"Four",
			"Five",
			"Six",
			"Seven",
			"Eight",
			"Nine",
			"Ten",
		]
		return words[num] ?? `${num}`
	}

	return (
		<div className="space-y-0">
			{[...owners].reverse().map((owner, index, arr) => {
				const isOpen = expandedId === owner.id
				const ownerNumber = index + 1
				const totalOwners = arr.length

				return (
					<div key={owner.id} className="border-b border-(--grey-1) last:border-b-0">
						<button
							onClick={() => setExpandedId(isOpen ? "" : owner.id)}
							className="flex w-full cursor-pointer items-center justify-between py-4 text-left">
							<div>
								<p className="text-foreground text-[16px] font-semibold">
									{owner.firstName} {owner.lastName}
								</p>
								<p className="text-[12px] text-(--text-1)">
									Owner{" "}
									{totalOwners > 1
										? `${numberToWord(ownerNumber)} (${totalOwners})`
										: "One (1)"}
								</p>
							</div>
							{isOpen ? (
								<FaChevronUp className="text-foreground h-4 w-4" />
							) : (
								<FaChevronDown className="text-foreground h-4 w-4" />
							)}
						</button>

						{isOpen && (
							<div className="pb-4">
								<ReviewRow
									label="Full Name:"
									value={`${owner.firstName} ${owner.lastName}`}
								/>
								<ReviewRow
									label="Date of Birth:"
									value={`${owner.dayOfBirth} ${getMonthName(Number(owner.monthOfBirth))} ${owner.yearOfBirth}`}
								/>
								<ReviewRow label="Identification Document:" value={owner.idDoc1} />
								<ReviewRow label="Identification Number:" value={owner.idNumber1} />
								<DocumentReviewRow label="Document:" file={owner.idUpload} />
								<ReviewRow label="State of Origin:" value={owner.homeState} />
								<ReviewRow label="City:" value={owner.homeCity} />
								<ReviewRow label="Postal Code:" value={owner.homePostalCode} />
								<ReviewRow label="Street Address:" value={owner.homeStreet} />
								<DocumentReviewRow
									label="Proof of Address:"
									file={owner.homeProofUpload}
								/>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
