import { useState } from "react";
import { createTransaction } from "@/api/transactionService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, ArrowRight } from "lucide-react";

interface TransferFormProps {
  onTransferred: () => void;
}

const TransferForm = ({ onTransferred }: TransferFormProps) => {
  const [form, setForm] = useState({
    senderAccountNumber: "",
    receiverAccountNumber: "",
    amount: "",
  });
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
      setForm({
        senderAccountNumber: "",
        receiverAccountNumber: "",
        amount: "",
      });
      onTransferred();
    } catch {
      toast.error("Transfer failed. Is your backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl gradient-accent flex items-center justify-center">
          <Send className="h-4.5 w-4.5 text-accent-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          New Transfer
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        <div className="flex-1 space-y-1.5">
          <Label
            htmlFor="sender"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            From Account
          </Label>
          <Input
            id="sender"
            placeholder="ACC-001"
            value={form.senderAccountNumber}
            onChange={(e) =>
              setForm({ ...form, senderAccountNumber: e.target.value })
            }
            required
            className="h-11 font-mono"
          />
        </div>
        <div className="hidden sm:flex items-center justify-center pb-1">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Label
            htmlFor="receiver"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            To Account
          </Label>
          <Input
            id="receiver"
            placeholder="ACC-002"
            value={form.receiverAccountNumber}
            onChange={(e) =>
              setForm({ ...form, receiverAccountNumber: e.target.value })
            }
            required
            className="h-11 font-mono"
          />
        </div>
        <div className="w-full sm:w-40 space-y-1.5">
          <Label
            htmlFor="amount"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Amount ($)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className="h-11"
          />
        </div>
      </div>
      <Button type="submit" disabled={submitting} size="lg">
        <Send className="h-4 w-4" />
        {submitting ? "Processing..." : "Send Transfer"}
      </Button>
    </form>
  );
};

export default TransferForm;
