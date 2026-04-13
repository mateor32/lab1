import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ArrowLeftRight,
  TrendingUp,
  Wallet,
  Shield,
  Zap,
} from "lucide-react";
import { getCustomers } from "@/api/customerService";
import { getTransactions } from "@/api/transactionService";

const Dashboard = () => {
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [transactionCount, setTransactionCount] = useState<number | null>(null);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [customersResponse, transactionsResponse] = await Promise.all([
          getCustomers(),
          getTransactions(),
        ]);

        const customers = customersResponse.data;
        const balance = customers.reduce(
          (sum, customer) => sum + (Number(customer.balance) || 0),
          0,
        );

        setTotalBalance(balance);
        setCustomerCount(customers.length);
        setTransactionCount(transactionsResponse.data.length);
      } catch {
        setTotalBalance(0);
        setCustomerCount(0);
        setTransactionCount(0);
      }
    };

    loadStats();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Total Balance",
        value:
          totalBalance === null
            ? "..."
            : currencyFormatter.format(totalBalance),
        icon: Wallet,
        trend: totalBalance === null ? "Loading" : "Available customer funds",
      },
      {
        label: "Customers",
        value: customerCount === null ? "..." : customerCount.toString(),
        icon: Users,
        trend: customerCount === null ? "Loading" : "Registered customers",
      },
      {
        label: "Transactions",
        value: transactionCount === null ? "..." : transactionCount.toString(),
        icon: TrendingUp,
        trend: transactionCount === null ? "Loading" : "Completed transactions",
      },
    ],
    [totalBalance, customerCount, transactionCount, currencyFormatter],
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 sm:p-12 animate-fade-in">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, hsl(168 80% 50% / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(190 80% 50% / 0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">
              Banking Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-2">
            Welcome to <span className="text-gradient">NovaPay</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-md">
            Manage customers, track transactions, and transfer funds — all in
            one place.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{ animationDelay: "0.1s" }}
      >
        {stats.map(({ label, value, icon: Icon, trend }, i) => (
          <div
            key={label}
            className="glass-card p-5 animate-fade-in"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center">
                <Icon className="h-5 w-5 text-accent-foreground" />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {value}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground/70 mt-2">{trend}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Link
            to="/customers"
            className="glass-card-hover group p-6 flex items-center gap-5"
          >
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-lg">
                Customers
              </p>
              <p className="text-sm text-muted-foreground">
                View and manage accounts
              </p>
            </div>
          </Link>
          <Link
            to="/transfers"
            className="glass-card-hover group p-6 flex items-center gap-5"
          >
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
              <ArrowLeftRight className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-lg">
                Transfers
              </p>
              <p className="text-sm text-muted-foreground">
                Send money between accounts
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Status */}
      <div
        className="glass-card p-5 flex items-center gap-3 max-w-md animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <Shield className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">Backend Status</p>
          <p className="text-xs text-muted-foreground">
            Waiting for Spring Boot at localhost:8080
          </p>
        </div>
        <div className="ml-auto h-2.5 w-2.5 rounded-full bg-muted-foreground/30 animate-pulse-soft" />
      </div>
    </div>
  );
};

export default Dashboard;
