import { useEffect, useState } from "react";
import { getCustomers, Customer } from "@/api/customerService";
import CustomerList from "@/components/CustomerList";
import CreateCustomerForm from "@/components/CreateCustomerForm";
import { Users, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground">Manage your customer accounts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={fetchCustomers} className="rounded-xl">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"} size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{showForm ? "Cancel" : "New Customer"}</span>
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="animate-fade-in">
          <CreateCustomerForm onCreated={() => { fetchCustomers(); setShowForm(false); }} />
        </div>
      )}

      {/* List */}
      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CustomerList customers={customers} loading={loading} />
      </div>
    </div>
  );
};

export default Customers;
