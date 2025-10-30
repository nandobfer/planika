import { WithoutFunctions } from "../helpers";
interface Expense {
    amount: string;
    currency: string;
    quantity?: number;
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
    findChild(id: string): ExpenseNode | null;
    update(data: Partial<WithoutFunctions<ExpenseNode>>): void;
}
export {};
