export class DateUtils {

    public static toCorrectIso8601(date: Date): string {
        const timezone_offset_min: number = date.getTimezoneOffset();
        const offset_hrs: number = parseInt(Math.abs(timezone_offset_min / 60).toString());
        const offset_min = Math.abs(timezone_offset_min % 60);
        let timezone_standard: string = '+00';

        if (timezone_offset_min !== 0) {
            timezone_standard = timezone_offset_min > 0 ? '-' : '+' +
                `${DateUtils.getOffsetWithZero(offset_hrs)}${DateUtils.getOffsetWithZero(offset_min)}`;
        }

        return date.toISOString().replace('Z', timezone_standard);
    }

    private static getOffsetWithZero(offset: number): string {
        return offset < 10 ? `0${offset}` : offset.toString();
    }
}
