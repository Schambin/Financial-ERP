import { AccountService } from "../services/AccountService";
import { SummaryService } from "../services/SummaryService";
import { AccountType } from '../models/AccountType';
import { DateUtils } from "../utils/DateUtils";
import { CLIUtils } from "../utils/cliUtils";
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
        console.log('5. Search by ID');
        console.log('6. Exit\n');

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
                    this.searchAccountById();
                    break;
                case '6':
                    this.exit();
                    break;
                default:
                    console.log('\nIvalid Option.\n');
                    setTimeout(() => this.showMainMenu(), 1000);
                    break;
            }
        });
    }

    private async addAccountMenu() {
        console.clear();
        console.log('=== Add New Account ===\n');

        const description = await CLIUtils.validateInput(this.rl,
            'Description: ', input => input.trim()
                ? true
                : 'Decription can not be empty!'
        );

        const valueStr = await CLIUtils.validateInput(
            this.rl,
            'Value: ',
            input => {
                const cleanedInput = input.trim().replace(/^\+|,/g, '');

                const value = parseFloat(cleanedInput);
                if (isNaN(value) || value <= 0) {
                    return 'Invalid Format! Number must be positive (ex: 150.50 ou 100)';
                }

                if (!/^\d*\.?\d+$/.test(cleanedInput)) {
                    return 'Invalid Format! Number must be positive (ex: 250 ou 199.9999)';
                }

                return true;
            }
        );

        const value = parseFloat(valueStr.replace(/^\+|,/g, ''));

        const dueDateStr = await CLIUtils.validateInput(this.rl,
            'Due Date(YYYY-MM-DD): ',
            input => {
                if (!DateUtils.isValidDate(input)) {
                    return ('Invalid Date! Use YYYY-MM-DD with real values (ex: 2024-12-31)');
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const inputDate = new Date(input);

                if (inputDate < today) {
                    return 'Date is in the past! Use a current date.';
                }

                return true
            }
        );

        const dueDate = DateUtils.parseDate(dueDateStr);

        const typeStr = await CLIUtils.validateInput(this.rl,
            'Type (1 - Pay, 2 - Receive): ',
            input => ['1', '2'].includes(input.trim())
                ? true
                : 'Type 1 to Pay or 2 to Receive!'
        );

        const type = typeStr === '1' ? AccountType.PAYABLE : AccountType.RECEIVABLE;
        const account = this.accountService.addAccount({
            description,
            value,
            dueDate,
            type
        });

        console.log('\nAccount Added Successfully');
        console.log(`ID: ${account.id}\n`);

        await CLIUtils.question(this.rl, 'Press ENTER to Continue...');
        this.showMainMenu();
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
                    `R$ ${account.value.toFixed(2)} | ` +
                    `Due Date: ${DateUtils.formatDate(account.dueDate)} | ` +
                    `Status: ${account.isPaid ? 'PAID' : 'PENDANT'} | ` +
                    `(ID: ${account.id}) | `//add more as needed, add on interfce too
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

    private async searchAccountById() {
        console.clear();
        console.log('=== Search by ID ===\n');

        const id = await CLIUtils.validateInput(
            this.rl,
            'Digite o ID da conta: ',
            input => {
                const isValid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.trim());
                return isValid || 'Invalid ID! Must be an UUID (ex: 550e8400-e29b-41d4-a716-446655440000)';
            }
        );

        const account = this.accountService.getAccountById(id);

        if (account) {
            console.log('\n=== Account Found ===');
            console.log(`ID: ${account.id}`);
            console.log(`Description: ${account.description}`);
            console.log(`Value: R$ ${account.value.toFixed(2)}`);
            console.log(`Due Date: ${DateUtils.formatDate(account.dueDate)}`);
            console.log(`Type: ${account.type === AccountType.PAYABLE ? 'Paid' : 'Receive'}`);
            console.log(`Status: ${account.isPaid ? 'Paid' : 'Pendant'}`);
        } else {
            console.log('\nAccount not found!');
        }

        await CLIUtils.question(this.rl, '\nPress ENTER to continue...');
        this.showMainMenu();
    }

    private exit() {
        console.log('\n Shutting Down System...\n');
        this.rl.close()
        process.exit(0);
    }
}