function prepData(data: string[]): number[][] {
    return data.map((line) => line.trim().split(/\s+/).map((v) => parseInt(v, 10)));
}

export async function part1 (raw: string[]): Promise<string> {
    const data = prepData(raw);
    const safeCount = data.reduce((count, report) => {
        for (let i = 1; i < report.length; i += 1) {
            const prev = report[i - 1]
            const cur = report[i]
            const next = report[i + 1] ?? null
            const prevDiff = prev - cur
            const nextDiff = cur - next;
            // must differ by between 1 & 3
            if (Math.abs(prevDiff) < 1 || Math.abs(prevDiff) > 3) {
                return count
            }
            // if the previous change was negative, the next must be too and vice versa.
            if (next && ((prevDiff > 0 && nextDiff < 0) || (prevDiff < 0 && nextDiff > 0))) {
                return count
            }
        }
        return count + 1
    }, 0);
    return safeCount.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
    return ''
}
