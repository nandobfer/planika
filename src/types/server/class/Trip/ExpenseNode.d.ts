import { WithoutFunctions } from "../helpers";
interface Expense {
    amount: number;
    currency: string;
}
export declare class ExpenseNode {
    id: string;
    tripId: string;
    description: string;
    active: boolean;
    locked: boolean;
    createdAt: number;
    updatedAt: number;
    expense?: Expense;
    location?: string;
    datetime?: number;
    notes: string[];
    parentId?: string;
    children: ExpenseNode[];
    totalExpenses: number;
    totalLocations: string[];
    constructor(data: WithoutFunctions<ExpenseNode>);
    getTotalExpenses(): number;
    getTotalLocations(): string[];
}
export {};
