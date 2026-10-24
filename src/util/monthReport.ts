// month_report is "MM/YYYY", optionally followed by a suffix for extra payroll runs
// in the same month (e.g. "12/2022/1", "12/2025-bonus").
export interface MonthReportKey {
    year: number;
    month: number;
    suffix: string;
}

export const parseMonthReport = (monthReport: string): MonthReportKey => {
    const match = /^(\d{1,2})\/(\d{4})(.*)$/.exec(monthReport || '')
    if (!match) return { year: 0, month: 0, suffix: monthReport || '' }
    return { year: Number(match[2]), month: Number(match[1]), suffix: match[3] }
}

// Sort by year, then month; the regular report comes before its extra runs.
export const compareMonthReport = (a: string, b: string) => {
    const ka = parseMonthReport(a)
    const kb = parseMonthReport(b)
    if (ka.year !== kb.year) return ka.year - kb.year
    if (ka.month !== kb.month) return ka.month - kb.month
    if (ka.suffix === kb.suffix) return 0
    if (ka.suffix === '') return -1
    if (kb.suffix === '') return 1
    return ka.suffix < kb.suffix ? -1 : 1
}
