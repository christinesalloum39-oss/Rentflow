/** Money with cents — taxes & fees need the precision. */
export function money(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Whole rental days between two yyyy-mm-dd dates, minimum 1 once both set. */
export function rentalDays(fromDate: string, toDate: string): number {
  if (!fromDate || !toDate) return 0;
  const a = new Date(fromDate).getTime();
  const b = new Date(toDate).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.max(1, Math.round((b - a) / 86_400_000) || 1);
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function ord(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** "Wednesday, June 24th, 2026 @ 09:00 AM" */
export function longDateTime(dateStr: string, time: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${ord(d.getUTCDate())}, ${d.getUTCFullYear()}${time ? ` @ ${time}` : ""}`;
}

/** "06/24/2026" */
export function shortDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return y && m && d ? `${m}/${d}/${y}` : dateStr;
}
