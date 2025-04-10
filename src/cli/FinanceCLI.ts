import { AccountService } from "../services/AccountService";
import { SummaryService } from "../services/SummaryService";
import { AccountType } from '../models/AccountType';
import { DateUtils } from "../utils/DateUtils";
import readline from "readline";

export class FinanceCLI {
    private rl: readline.Interface;

    constructor(
        private accountService = new AccountService,
        private summaryService = new SummaryService(accountService)
    ) {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public start() {
        this.showMainMenu();
    }

    private showMainMenu() {
        console.clear();
        console.log('=== Control of Payable and Receivable Accounts ===\n');
        console.log('1. Add Account');
        console.log('2. List Accounts');
        console.log('3. Mark Account as Paid');
        console.log('4. Resume');
        console.log('5. Exit\n');

        this.rl.question('Choose an option: ', (answer) => {
            switch (answer.trim()) {
                case '1':
                    this.addAccountMenu();
                    break;
                case '2':
                    this.listAccounts();
                    break;
                case '3':
                    this.markAsPaidMenu();
                    break;
                case '4':
                    this.showSummary();
                    break;
                case '5':
                    this.exit();
                    break;
                default:
                    console.log('\nIvalid Option.\n');
                    setTimeout(() => this.showMainMenu(), 1000);
                    break;
            }
        });
    }

    private addAccountMenu() {
        //0 can be added idk why
        console.clear();
        console.log('=== Create new account ===\n');
        
        this.rl.question('Description: ', (description) => {
            this.rl.question('Value: ', (valueStr) => {
                const value = parseFloat(valueStr);
                if (isNaN(value) || value < 0) {
                    console.log('\nInvalid Value! Value must be positive.\n');
                    setTimeout(() => this.addAccountMenu(), 1000);
                    return;
                }

                this.rl.question('Due Date (YYYY-MM--DD): ', (dueDateStr) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDateStr)) {
                        console.log('\nInvalid date format! Use Year-Month-Day.\n');
                        setTimeout(() => this.addAccountMenu(), 1000);
                        return;
                    }

                    this.rl.question('Type 1 - Pay, 2 - Receive: ', (typeStr) => {
                        const type = typeStr.trim() === '1' ?
                            AccountType.PAYABLE :
                            AccountType.RECEIVABLE;

                        const dueDate = new Date(dueDateStr);

                        const account = this.accountService.addAcount({
                            description,
                            value,
                            dueDate,
                            type
                        });

                        console.log('\nAccount added successfully!');
                        console.log(`ID: ${account.id}\n`);
                        this.rl.question('Press ENTER to continue...', () => {
                            this.showMainMenu();
                        });
                    });
                });
            });
        });
    }

    private listAccounts() {
        console.clear();
        console.log('=== Account List===\n');

        const accounts = this.accountService.getAllAccounts();

        if (accounts.length === 0) {
            console.log('You do not have any account created.\n');
        } else {
            accounts.forEach(account => {
                console.log(
                    `[${account.type === AccountType.PAYABLE ? 'PAY' : 'RECEIVE'}] ${account.description}: ` +
                    `R$ ${account.value.toFixed(2)}` +
                    `Maturity Date: ${DateUtils.formatDate(account.dueDate)}` +
                    `Status: ${account.isPaid ? 'PAID' : 'PENDANT'}` +
                    ` (ID: ${account.id})`//add more as needed, add on interfce too
                );
            });
            console.log();
        }

        this.rl.question('Press ENTER to continue...', () => {
            this.showMainMenu();
        });
    }

    private markAsPaidMenu() {
        console.clear();
        console.log("=== Mark Account as Paid ---\n");

        const pendingAccounts = this.accountService.getPendingAccounts();

        if (pendingAccounts.length === 0) {
            console.log('You do not have any pendant account.\n');
            this.rl.question('Press ENTER to continue...', () => {
                this.showMainMenu();
            });
            return;
        }

        console.log('Pendant Accounts:\n');
        pendingAccounts.forEach((account, index) => {
            console.log(
                `${index + 1}. ${account.description} - $ ${account.value.toFixed(2)}` +
                ` (Maturity: ${DateUtils.formatDate(account.dueDate)})`
            );
        });
        console.log();

        this.rl.question('Select the account number to mark as paid: ', (answer) => {
            const selectedIndex = parseInt(answer) - 1;

            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= pendingAccounts.length) {
                console.log('\nInvalid Selection');
                setTimeout(() => this.addAccountMenu(), 1000);
                return;
            }

            const accountId = pendingAccounts[selectedIndex].id;
            this.accountService.markAsPaid(accountId);

            console.log('\nAccount Marked as Paid Successfully!\n');
            this.rl.question('Press ENTER to Continue...', () => {
                this.showMainMenu();
            });
        });
    }

    private showSummary() {
        console.clear();
        console.log('=== Financial Resume ===\n');
        console.log(`- Due Amount: $ ${this.summaryService.getTotalPayable().toFixed(2)}`);
        console.log(`- Receivable: $ ${this.summaryService.getTotalReceivable().toFixed(2)}`);
        console.log(`- Net Balance: $ ${this.summaryService.getNetBalance().toFixed()}\n`);

        const overdueAccounts = this.accountService.getOverdueAccounts();
        if (overdueAccounts.length > 0) {
            console.log('=== Overdue Accounts ===');
            overdueAccounts.forEach(account => {
                console.log(`${account.description} - Since ${DateUtils.formatDate(account.dueDate)}`);
            });
            console.log();
        }
        this.rl.question('Press ENTER to Continue...', () => {
            this.showMainMenu();
        });
    }

    private exit() {
        console.log('\n Shutting Down System...\n');
        this.rl.close()
        process.exit(0);
    }
}