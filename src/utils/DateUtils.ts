export class DateUtils {
    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static isPastDue(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    static isValidDate(dateStr: string): boolean {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

        const date = new Date(dateStr);
        const isoString = date.toISOString();

        return isoString.startsWith(dateStr) && !isNaN(date.getTime());
    }

    static parseDate(dateStr: string): Date {
        if (!this.isValidDate(dateStr)) {
            throw new Error('Data inválida');
        }
        return new Date(dateStr);
    }
}