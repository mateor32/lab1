import { Customer } from "@/api/customerService";
import { Users } from "lucide-react";

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
}

const CustomerList = ({ customers, loading }: CustomerListProps) => {
  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Users className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <p className="text-foreground font-medium mb-1">No customers found</p>
        <p className="text-sm text-muted-foreground">Connect your backend or create a new customer to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((c, i) => (
        <div key={c.id ?? i} className="glass-card-hover p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-accent-foreground">
              {c.firstName[0]}{c.lastName[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground">{c.firstName} {c.lastName}</p>
            <p className="text-sm font-mono text-muted-foreground">{c.accountNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-display font-bold text-foreground">${c.balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Balance</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
