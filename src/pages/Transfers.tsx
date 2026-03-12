import { useEffect, useState } from "react";
import { getTransactions, Transaction } from "@/api/transactionService";
import TransferForm from "@/components/TransferForm";
import { ArrowLeftRight, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Transfers = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
            <ArrowLeftRight className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Transfers</h1>
            <p className="text-sm text-muted-foreground">Send money between accounts</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={fetchTransactions} className="rounded-xl">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Transfer Form */}
      <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <TransferForm onTransferred={fetchTransactions} />
      </div>

      {/* Transaction History */}
      <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Transaction History</h2>
        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <ArrowLeftRight className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-medium mb-1">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Transactions will appear here once your backend is connected.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <div key={t.id ?? i} className="glass-card p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <ArrowRight className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-foreground font-medium truncate">{t.senderAccountNumber}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="font-mono text-foreground font-medium truncate">{t.receiverAccountNumber}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.timestamp ?? "Just now"}</p>
                </div>
                <p className="text-lg font-display font-bold text-foreground">${t.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfers;
