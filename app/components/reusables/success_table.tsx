export default function Success_table() {
  return (
    <div className="bg-background border border-(--grey-1) rounded-lg overflow-hidden">
      <div className="bg-(--grey-4) p-4">
        <p className="font-semibold text-foreground text-[14px]">
          Approval Status:
        </p>
      </div>

      <div className="px-4">
        <table className="w-full border-collapse text-[14px] text-(--text-1)">
          <tbody>
            <tr className="border-b border-b-(--grey-1)">
              <td className="py-3 pr-4">Required approvals</td>
              <td className="py-3 text-right text-foreground">
                2 of 5 multisig approvals
              </td>
            </tr>

            <tr className="border-b border-b-(--grey-1)">
              <td className="py-3 pr-4">Approved so far</td>
              <td className="py-3 text-right text-foreground">
                Funds moved to cold storage
              </td>
            </tr>

            <tr>
              <td className="py-3 pr-4">Estimated completion</td>
              <td className="py-3 text-right text-foreground">
                ~30 minutes after approval
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
