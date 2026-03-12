import { useEffect, useState } from "react";
import { getCustomers, Customer } from "@/api/customerService";
import CustomerList from "@/components/CustomerList";
import CreateCustomerForm from "@/components/CreateCustomerForm";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Customers</h1>
      <CreateCustomerForm onCreated={fetchCustomers} />
      <CustomerList customers={customers} loading={loading} />
    </div>
  );
};

export default Customers;
