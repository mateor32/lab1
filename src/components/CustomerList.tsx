import { Customer } from "@/api/customerService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
}

const CustomerList = ({ customers, loading }: CustomerListProps) => {
  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Loading customers...</p>;
  }

  if (customers.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No customers found. Connect your backend or create one.</p>;
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c, i) => (
            <TableRow key={c.id ?? i}>
              <TableCell className="font-medium">{c.firstName} {c.lastName}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{c.accountNumber}</TableCell>
              <TableCell className="text-right font-semibold">${c.balance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerList;
