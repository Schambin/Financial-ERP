export class DateUtils {
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static isPastDue(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }
}