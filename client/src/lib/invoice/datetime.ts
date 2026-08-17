import { format, parse } from 'date-fns';

/**
 * The backend stores dates as plain strings in this exact format
 * (see Invoice.js — jobsheetDate/paymentDate/signatureDate are String fields).
 * We keep the format centralized here so it only needs to change in one place.
 */
const BACKEND_DATETIME_FORMAT = 'yyyy/MM/dd HH:mm:ss';

/** Convert a JS Date to the backend's expected string format. */
export function toBackendDateTime(date: Date): string {
  return format(date, BACKEND_DATETIME_FORMAT);
}

/** Convert an <input type="datetime-local"> value to the backend's string format. */
export function datetimeLocalToBackend(value: string): string {
  if (!value) return '';
  // datetime-local gives "yyyy-MM-ddTHH:mm" (no seconds) — treat as local time.
  const parsed = new Date(value);
  return toBackendDateTime(parsed);
}

/** Convert a backend datetime string back into <input type="datetime-local"> format. */
export function backendDateTimeToDatetimeLocal(value: string): string {
  if (!value) return '';
  try {
    const parsed = parse(value, BACKEND_DATETIME_FORMAT, new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
}

/** Current moment formatted for the backend — used to prefill new-invoice forms. */
export function nowForBackend(): string {
  return toBackendDateTime(new Date());
}

/** Current moment formatted for a datetime-local input default value. */
export function nowForDatetimeLocalInput(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
}
