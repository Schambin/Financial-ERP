import { AccountType } from "./AccountType";

export interface Account {
    id: string;
    description: string;
    value: number;
    dueDate: Date;
    type: AccountType;
    isPaid: boolean;
}

export interface AccountInput {
    description: string;
    value: number;
    dueDate: Date;
    type: AccountType;
}