export type Transaction = {
  id: number;
  title: string;
  amount: number;
  createdAt: Date;
  type: "Income" | "Expense";
  isDeleted: boolean;
};
