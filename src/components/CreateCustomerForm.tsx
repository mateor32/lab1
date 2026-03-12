import { useState } from "react";
import { createCustomer } from "@/api/customerService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl gradient-accent flex items-center justify-center">
          <UserPlus className="h-4.5 w-4.5 text-accent-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">New Customer</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">First Name</Label>
          <Input id="firstName" placeholder="John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Name</Label>
          <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="accountNumber" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Number</Label>
          <Input id="accountNumber" placeholder="ACC-001" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required className="h-11 font-mono" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="balance" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Initial Balance</Label>
          <Input id="balance" type="number" step="0.01" min="0" placeholder="0.00" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} required className="h-11" />
        </div>
      </div>
      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
};

export default CreateCustomerForm;
