import { Account, AccountInput } from "../models/Account";
import { AccountType } from "../models/AccountType";
import { DateUtils } from "../utils/DateUtils";
import { v4 as uuidv4 } from "uuid";

export class AccountService {
    private accounts: Account[] = [];

    addAcount(input: AccountInput): Account {
        const newAccount: Account = {
            id: uuidv4(),
            isPaid: false,
            ...input
        };

        this.accounts.push(newAccount);
        return newAccount;
    }

    markAsPaid(accountId: string): void {
        const accountIndex = this.accounts.findIndex(a => a.id === accountId)
        if (accountIndex !== -1) {
            this.accounts[accountIndex].isPaid = true;
        }
    }

    getAllAccounts(): Account[] {
        return [...this.accounts];
    }

    getAccountsByType(type: AccountType): Account[] {
        return this.accounts.filter(account => account.type === type);
    }

    getPendingAccounts(): Account[] {
        return this.accounts.filter(account => !account.isPaid)
    }

    getOverdueAccounts(): Account[] {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.accounts.filter(account => !account.isPaid && account.dueDate < today);
    }
}