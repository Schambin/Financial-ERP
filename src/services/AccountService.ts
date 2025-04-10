import { Account, AccountInput, AccountMock } from "../models/Account";
import { AccountType } from "../models/AccountType";
import { v4 as uuidv4 } from "uuid";

export class AccountService {
    private accounts: Account[] = [];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        const mockAccounts: AccountMock[] = [
            {
                description: "Aluguel",
                value: 1500,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias no futuro
                type: AccountType.PAYABLE,
                isPaid: false
            },
            {
                description: "Salário",
                value: 5000,
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias no futuro
                type: AccountType.RECEIVABLE,
                isPaid: false
            },
            {
                description: "Internet",
                value: 120.90,
                dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás (vencida)
                type: AccountType.PAYABLE,
                isPaid: true
            }
        ];

        mockAccounts.forEach(account => this.addAccount(account));
    }

    public getAccountById(id: string): Account | undefined {
        //verify if id is an valid uuid
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
            return undefined;
        }
        return this.accounts.find(account => account.id === id);
    }

    addAccount(input: AccountInput): Account {
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