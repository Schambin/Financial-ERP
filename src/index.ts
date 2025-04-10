import { AccountService } from "./services/AccountService";
import { SummaryService } from "./services/SummaryService";
import { FinanceCLI } from "./cli/FinanceCLI";

const accountService = new AccountService();
const summaryService = new SummaryService(accountService);

const financeCLI = new FinanceCLI(accountService, summaryService);
financeCLI.start(); 