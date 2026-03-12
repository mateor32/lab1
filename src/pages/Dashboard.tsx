import { Link } from "react-router-dom";
import { Users, ArrowLeftRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your banking system.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
        <Link
          to="/customers"
          className="flex flex-col items-center gap-3 p-8 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
        >
          <Users className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-card-foreground">Customers</span>
          <span className="text-sm text-muted-foreground">Manage accounts</span>
        </Link>
        <Link
          to="/transfers"
          className="flex flex-col items-center gap-3 p-8 rounded-lg border border-border bg-card hover:bg-accent transition-colors group"
        >
          <ArrowLeftRight className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-card-foreground">Transfers</span>
          <span className="text-sm text-muted-foreground">Send money</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
