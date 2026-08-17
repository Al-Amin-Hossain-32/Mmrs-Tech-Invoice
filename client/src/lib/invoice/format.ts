import { format } from 'date-fns';

/**
 * Suggests a barcode/jobsheet number the same way the reference invoice does
 * (e.g. "BDPAY20260809", "BDJS20260809" — prefix + yyyyMMdd). These are
 * editable in the form; this is only a convenience default.
 *
 * NOTE: the backend does not enforce or generate these — see the code
 * review note about adding a uniqueness index / server-side generator later.
 */
export function suggestBarcodeNumber(date: Date = new Date()): string {
  return `BDPAY${format(date, 'yyyyMMdd')}${randomSuffix()}`;
}

export function suggestJobsheetOrder(date: Date = new Date()): string {
  return `BDJS${format(date, 'yyyyMMdd')}${randomSuffix()}`;
}

function randomSuffix(): string {
  return Math.floor(Math.random() * 900 + 100).toString(); // 3-digit suffix for uniqueness
}

/** Plain numeric formatting matching the reference invoice (no currency symbol in print). */
export function formatAmount(value: number): string {
  return value.toFixed(2);
}

/** Currency-prefixed formatting for on-screen list/table views. */
export function formatCurrency(value: number): string {
  return `৳ ${value.toFixed(2)}`;
}


// export function formatCurrency(amount: number, currency: string = 'BDT'): string {
//   if (isNaN(amount)) return '৳০';

//   return new Intl.NumberFormat('bn-BD', {
//     style: 'currency',
//     currency: currency,
//     maximumFractionDigits: 0, // দশমিকের পরের সংখ্যা না দেখাতে চাইলে 0 রাখুন
//   }).format(amount);
// }