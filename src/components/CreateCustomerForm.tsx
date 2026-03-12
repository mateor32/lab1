import { useState } from "react";
import { createCustomer } from "@/api/customerService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateCustomerFormProps {
  onCreated: () => void;
}

const CreateCustomerForm = ({ onCreated }: CreateCustomerFormProps) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", accountNumber: "", balance: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCustomer({
        firstName: form.firstName,
        lastName: form.lastName,
        accountNumber: form.accountNumber,
        balance: parseFloat(form.balance),
      });
      toast.success("Customer created successfully");
      setForm({ firstName: "", lastName: "", accountNumber: "", balance: "" });
      onCreated();
    } catch {
      toast.error("Failed to create customer. Is your backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold text-card-foreground">New Customer</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="balance">Initial Balance</Label>
          <Input id="balance" type="number" step="0.01" min="0" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} required />
        </div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
};

export default CreateCustomerForm;
