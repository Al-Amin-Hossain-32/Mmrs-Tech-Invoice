import { Barcode } from '@/components/invoices/Barcode';
import { formatAmount } from '@/lib/invoice/format';
import type { Invoice } from '@/types/invoice';
import type { UserProfile } from '@/types/user';
import './heading.css'
interface InvoicePrintViewProps {
  invoice: Invoice;
  /** The dealer's business profile — Invoice documents don't snapshot this, it's rendered live. */
  profile: Pick<
    UserProfile,
    'companyName' | 'dutyParagraph' | 'businessRegNo' | 'bankAccount' | 'serviceCenter'
  >;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-2 py-1 text-[13px] leading-snug">
      <span className="w-[150px] shrink-0 text-neutral-700">{label}</span>
      <span className="flex-1 text-neutral-900">{value || '\u00A0'}</span>
    </div>
  );
}

/**
 * Renders the invoice exactly as the reference document: bordered box,
 * two-column business/customer info, line-item table with a highlighted
 * subtotal row, and a signature footer.
 *
 * This component is intentionally framework-agnostic in styling (plain
 * Tailwind, no shadcn primitives) since it doubles as the print target —
 * see the `invoice-print` id used by the print stylesheet in [id]/page.tsx.
 */
export function InvoicePrintView({ invoice, profile }: InvoicePrintViewProps) {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      id="invoice-print"
      className=" main-invoice mx-auto w-full max-w-[720px] border border-neutral-800 bg-white text-neutral-900"
    >
      {/* Header */}
     <div className="relative flex items-center justify-end border-b border-neutral-800 p-5">
  {/* Center Title */}
  <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl whitespace-nowrap">
    {invoice.invoiceType || 'Retail Invoice'}
  </h1>

  {/* Right Barcode */}
  <div className="text-right">
    <Barcode value={invoice.barcodeNumber} />
  </div>
</div>
      {/* <div className='heading-container d-flex  flex-row '>
        <div className="heading   align-self-center ">
            <h2 className='text-center' >Retail Invoice</h2>
        </div>
        <div className="barcode ">
        <Barcode value={invoice.barcodeNumber} width={1.3} height={75} margin={5} />
        </div>
    </div> */}

      {/* Business / customer info grid */}
      <div className="grid grid-cols-2 gap-x-6 border-b border-neutral-800 p-5">
        <div>
          <InfoRow label="Company Name :" value={profile.companyName} />
          <InfoRow label="Duty Paragraph:" value={profile.dutyParagraph} />
          <div className="h-2" />
          <InfoRow label="Business Registration No:" value={profile.businessRegNo} />
          <InfoRow label="Bank Account:" value={profile.bankAccount} />
          <InfoRow label="Service Center Name :" value={profile.serviceCenter?.name} />
          <InfoRow label="Service Center Address :" value={profile.serviceCenter?.address} />
          <InfoRow label="Service Center Contact :" value={profile.serviceCenter?.contact} />
        </div>
        <div>
          <InfoRow label="Jobsheet Order :" value={invoice.jobsheetOrder} />
          <InfoRow label="Jobsheet Date :" value={invoice.jobsheetDate} />
          <div className="h-2" />
          <InfoRow label="Payment Date:" value={invoice.paymentDate} />
          <InfoRow label="Customer Name:" value={invoice.customerDetails.name} />
          <InfoRow label="Customer Address:" value={invoice.customerDetails.address} />
          <InfoRow label="Customer Mobile No:" value={invoice.customerDetails.mobileNo} />
          <InfoRow label="E-Mail ID:" value={invoice.customerDetails.email} />
        </div>
      </div>

      {/* Line items */}
      <div className="p-5">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-sky-100">
              <th className="border border-neutral-300 px-3 py-2 text-left font-medium">
                Payment Date
              </th>
              <th className="border border-neutral-300 px-3 py-2 text-left font-medium">
                Service Fee
              </th>
              <th className="border border-neutral-300 px-3 py-2 text-left font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className={index % 2 === 1 ? 'bg-sky-50/60' : undefined}>
                <td className="border border-neutral-300 px-3 py-3">{item.paymentDate}</td>
                <td className="border border-neutral-300 px-3 py-3">{item.serviceFee}</td>
                <td className="border border-neutral-300 px-3 py-3">
                  {formatAmount(item.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-sky-100 font-medium">
              <td className="border border-neutral-300 px-3 py-2" colSpan={2}>
                Subtotal
              </td>
              <td className="border border-neutral-300 px-3 py-2">
                {formatAmount(invoice.subtotal ?? subtotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 border-t border-neutral-800 p-5 pt-16">
        <div className="border-t border-neutral-400 pt-1 text-[13px]">
          Customer Signature with Name
        </div>
        <div className="border-t border-neutral-400 pt-1 text-right text-[13px]">
          Signature of Service Center
        </div>
      </div>
      <div className="flex items-center justify-between px-5 pb-5 text-[13px]">
        <span>Signature Date: {invoice.signatureDate || '\u00A0'}</span>
        <span>{profile.serviceCenter?.sealName}</span>
      </div>
    </div>
  );
}
