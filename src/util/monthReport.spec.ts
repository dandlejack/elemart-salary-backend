import { compareMonthReport, parseMonthReport } from './monthReport'

describe('parseMonthReport', () => {
    it('parses regular and extra-run reports', () => {
        expect(parseMonthReport('03/2026')).toEqual({ year: 2026, month: 3, suffix: '' })
        expect(parseMonthReport('12/2022/1')).toEqual({ year: 2022, month: 12, suffix: '/1' })
        expect(parseMonthReport('12/2025-bonus')).toEqual({ year: 2025, month: 12, suffix: '-bonus' })
    })
})

describe('compareMonthReport', () => {
    it('sorts by year, then month, regular report before extra runs', () => {
        const months = ['01/2022', '12/2025-bonus', '12/2021', '12/2025', '02/2021', '12/2022/1', '12/2022']
        expect(months.sort(compareMonthReport)).toEqual(['02/2021', '12/2021', '01/2022', '12/2022', '12/2022/1', '12/2025', '12/2025-bonus'])
    })
})
