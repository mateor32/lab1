import { useState } from "react";
import { createTransaction, Transaction } from "@/api/transactionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TransferFormProps {
  onTransferred: () => void;
}

const TransferForm = ({ onTransferred }: TransferFormProps) => {
  const [form, setForm] = useState({ senderAccountNumber: "", receiverAccountNumber: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTransaction({
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: parseFloat(form.amount),
      });
      toast.success("Transfer completed successfully");
      setForm({ senderAccountNumber: "", receiverAccountNumber: "", amount: "" });
      onTransferred();
    } catch {
      toast.error("Transfer failed. Is your backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-lg border border-border bg-card">
      <h3 className="text-lg font-semibold text-card-foreground">New Transfer</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="sender">Sender Account</Label>
          <Input id="sender" value={form.senderAccountNumber} onChange={(e) => setForm({ ...form, senderAccountNumber: e.target.value })} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="receiver">Receiver Account</Label>
          <Input id="receiver" value={form.receiverAccountNumber} onChange={(e) => setForm({ ...form, receiverAccountNumber: e.target.value })} required />
        </div>
      </div>
      <div className="space-y-1.5 max-w-xs">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input id="amount" type="number" step="0.01" min="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
      </div>
      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Processing..." : "Send Transfer"}
      </Button>
    </form>
  );
};

export default TransferForm;
