import { useEffect, useState } from "react";
import { getTransactions, Transaction } from "@/api/transactionService";
import TransferForm from "@/components/TransferForm";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

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
      <h1 className="text-3xl font-bold text-foreground">Transfers</h1>
      <TransferForm onTransferred={fetchTransactions} />

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Transaction History</h2>
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t, i) => (
                  <TableRow key={t.id ?? i}>
                    <TableCell className="font-mono text-sm">{t.senderAccountNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{t.receiverAccountNumber}</TableCell>
                    <TableCell className="text-right font-semibold">${t.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.timestamp ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfers;
