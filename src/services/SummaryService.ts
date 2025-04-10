import { AccountType } from "../models/AccountType";
import { AccountService } from "./AccountService";

export class SummaryService {
    constructor(private accountService: AccountService) {}

    private calculateTotal(accounts: { value: number }[]): number {
        return accounts.reduce((total, account) => total + account.value, 0)
    }

    getTotalPayable(): number {
        const payableAccounts = this.accountService.getAccountsByType(AccountType.PAYABLE);
        return this.calculateTotal(payableAccounts);
    }

    getTotalReceivable(): number {
        const receivableAccounts = this.accountService.getAccountsByType(AccountType.RECEIVABLE);
        return this.calculateTotal(receivableAccounts);
    }

    getNetBalance(): number {
        return this.getTotalReceivable() - this.getTotalPayable();
    }
}