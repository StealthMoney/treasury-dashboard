import { Transaction2 } from "@/app/types/general"
import { formatDateWithSuffix } from "./formatted_date"
import { formatNaira } from "./formatNaira"

export function generateReceiptHTML(tx: Transaction2): string {
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Transaction Receipt - ${tx.transactionId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111; padding: 48px 40px; max-width: 600px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .header p { font-size: 13px; color: #666; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-top: 12px; }
    .status-REPAID { background: #f3e8ff; color: #7c3aed; }
    .status-APPROVED { background: #dcfce7; color: #16a34a; }
    .status-REJECTED { background: #fee2e2; color: #dc2626; }
    .status-REVIEW { background: #fef9c3; color: #ca8a04; }
    .status-DISBURSED { background: #dbeafe; color: #2563eb; }
    .amount-box { background: #f9fafb; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px; }
    .amount-box .label { font-size: 12px; color: #888; margin-bottom: 6px; }
    .amount-box .amount { font-size: 32px; font-weight: 800; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 0; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #f3f4f6; gap: 16px; }
    .row:last-child { border-bottom: none; }
    .row .key { font-size: 13px; color: #888; flex-shrink: 0; }
    .row .val { font-size: 13px; font-weight: 500; text-align: right; word-break: break-all; }
    .section-title { font-size: 11px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; padding: 20px 0 6px; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #aaa; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Transaction Receipt</h1>
    <p>Generated on ${formatDateWithSuffix(new Date().toISOString())}</p>
    <div class="status-badge status-${tx.status}">${tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}</div>
  </div>

  <div class="amount-box">
    <div class="label">Amount</div>
    <div class="amount">${formatNaira(tx.amount)}</div>
  </div>

  <div class="section-title">Transaction Details</div>
  <div class="row"><span class="key">Transaction ID</span><span class="val">${tx.transactionId}</span></div>
  <div class="row"><span class="key">Date</span><span class="val">${formatDateWithSuffix(tx.date)}</span></div>
  <div class="row"><span class="key">Type</span><span class="val">${tx.transactionType.replace(/_/g, " ")}</span></div>
  <div class="row"><span class="key">Initiated By</span><span class="val">${tx.initiatedBy}</span></div>
  <div class="row"><span class="key">Notes</span><span class="val">${tx.notes}</span></div>

  <div class="section-title">Business</div>
  <div class="row"><span class="key">Business Name</span><span class="val">${tx.business.name}</span></div>
  <div class="row"><span class="key">RC Number</span><span class="val">${tx.business.rcNumber}</span></div>

  <div class="section-title">Bank Account</div>
  <div class="row"><span class="key">Bank</span><span class="val">${tx.bankAccount.bankName}</span></div>
  <div class="row"><span class="key">Account Name</span><span class="val">${tx.bankAccount.accountName}</span></div>
  <div class="row"><span class="key">Account Number</span><span class="val">${tx.bankAccount.accountNumber}</span></div>

  <div class="footer">This is an automatically generated receipt.</div>
</body>
</html>`
}
