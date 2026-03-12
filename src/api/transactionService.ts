import apiClient from "./apiClient";

export interface Transaction {
  id?: number;
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
  timestamp?: string;
}

export const getTransactions = () => apiClient.get<Transaction[]>("/api/transactions");

export const createTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) =>
  apiClient.post<Transaction>("/api/transactions", transaction);
