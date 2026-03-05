export function calculateWPM(correctChars: number, timeSeconds: number): number {
    if (timeSeconds <= 0) return 0;
    const minutes = timeSeconds / 60;
    return Math.round((correctChars / 5) / minutes);
}

export function calculateRawWPM(totalCharsTyped: number, timeSeconds: number): number {
    if (timeSeconds <= 0) return 0;
    const minutes = timeSeconds / 60;
    return Math.round((totalCharsTyped / 5) / minutes);
}

export function calculateAccuracy(correctChars: number, totalCharsTyped: number): number {
    if (totalCharsTyped <= 0) return 0;
    return Math.round((correctChars / totalCharsTyped) * 10000) / 100;
}

export function calculateConsistency(wpmHistory: number[]): number {
    if (wpmHistory.length < 2) return 100;
    const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
    if (mean === 0) return 0;
    const variance =
        wpmHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmHistory.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100;
    return Math.round(Math.max(0, 100 - cv) * 100) / 100;
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
}

export function formatNumber(num: number): string {
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
}
