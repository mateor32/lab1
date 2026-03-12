import apiClient from "./apiClient";

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  accountNumber: string;
  balance: number;
}

export const getCustomers = () => apiClient.get<Customer[]>("/api/customers");

export const getCustomerById = (id: number) => apiClient.get<Customer>(`/api/customers/${id}`);

export const createCustomer = (customer: Omit<Customer, "id">) => apiClient.post<Customer>("/api/customers", customer);
