import { WithoutFunctions } from "../helpers";
interface Expense {
    amount: string;
    currency: string;
    quantity?: string;
}
export interface ExpenseComment {
    authorId: string;
    content: string;
    createdAt: number;
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
    notes: ExpenseComment[];
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
