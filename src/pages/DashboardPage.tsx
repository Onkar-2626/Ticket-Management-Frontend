import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { customerService } from '../services/customer.service';
import { bookingService } from '../services/booking.service';
import { paymentService } from '../services/payment.service';
import type { Customer, Booking, Payment, ActivityLog } from '../types';
import { Users, Ticket, DollarSign, Clock, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    bookings: 0,
    revenue: 0,
    pending: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Customers from backend
        let customersList: Customer[] = [];
        try {
          customersList = await customerService.getCustomers();
        } catch (err) {
          console.error("Backend offline. Using mock customer statistics.");
          customersList = [
            { cust_id: 1, name: 'John Doe', email: 'john@example.com' },
            { cust_id: 2, name: 'Alice Smith', email: 'alice@example.com' },
            { cust_id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
            { cust_id: 4, name: 'Sarah Connor', email: 'sarah@example.com' }
          ];
        }

        // Fetch Bookings & Payments
        const bookingsList = bookingService.getBookings();
        const paymentsList = paymentService.getPayments();

        // Calculate Stats
        const revenueSum = paymentsList
          .filter((p) => p.payment_status === 'Paid')
          .reduce((sum, p) => sum + p.amount, 0);

        const pendingCount = bookingsList.filter((b) => b.ticket_status === 'Pending').length;

        setStats({
          customers: customersList.length,
          bookings: bookingsList.length,
          revenue: revenueSum,
          pending: pendingCount,
        });

        // Set list items
        setRecentBookings(bookingsList.slice(0, 4));
        setRecentPayments(paymentsList.slice(0, 4));

        // Load Activity logs from LocalStorage
        const savedLogs = localStorage.getItem('tms_activity_logs');
        if (savedLogs) {
          setActivityLogs(JSON.parse(savedLogs));
        } else {
          // Initialize mock logs if empty
          const initialLogs: ActivityLog[] = [
            {
              id: '1',
              action: 'Database Initialized',
              details: 'PostgreSQL Tables verified and schema created successfully',
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hrs ago
              type: 'success',
            },
            {
              id: '2',
              action: 'Supabase Sync Checked',
              details: 'JWT Authentication storage layer synced with metadata storage',
              timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
              type: 'info',
            },
            {
              id: '3',
              action: 'API Gateway Online',
              details: 'FastAPI route listeners attached and running on port 8000',
              timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
              type: 'info',
            },
          ];
          localStorage.setItem('tms_activity_logs', JSON.stringify(initialLogs));
          setActivityLogs(initialLogs);
        }
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25';
      case 'warning':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/25';
      case 'error':
        return 'text-red-500 bg-red-500/10 border-red-500/25';
      case 'info':
      default:
        return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/25';
    }
  };

  return (
    <DashboardLayout>
      {/* Top Banner Notice */}
      <div className="glass-card bg-gradient-to-r from-brand-500/5 to-indigo-500/5 dark:from-brand-500/10 dark:to-indigo-500/5 border border-brand-500/15 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center space-x-4 text-left">
          <div className="p-3 bg-brand-500/15 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Welcome to the AeroFlow Management Panel
            </h2>
            <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
              Backend FastAPI connected. Explore ticketing databases, log metrics, and audit ledger balances.
            </p>
          </div>
        </div>
        <Link
          to="/bookings"
          className="flex items-center text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800 px-3.5 py-2 rounded-xl shrink-0"
        >
          Manage Bookings
          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Customers"
          value={stats.customers}
          icon={<Users className="h-5 w-5" />}
          change="+8.3%"
          changeType="positive"
          loading={loading}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.bookings}
          icon={<Ticket className="h-5 w-5" />}
          change="+14.2%"
          changeType="positive"
          loading={loading}
        />
        <StatsCard
          title="Revenue Generated"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          change="+21.5%"
          changeType="positive"
          loading={loading}
        />
        <StatsCard
          title="Pending Tickets"
          value={stats.pending}
          icon={<Clock className="h-5 w-5" />}
          change="-4.2%"
          changeType="negative"
          loading={loading}
        />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Recent Bookings Table Panel */}
        <Card className="lg:col-span-2 space-y-6" hoverable={false}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-900">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Recent Ticket Bookings
              </h3>
              <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
                Overview of latest customer reservations.
              </p>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-bold text-brand-650 hover:text-brand-500 dark:text-brand-400 transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-slate-100 dark:bg-dark-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="text-slate-400 dark:text-dark-550 text-sm">No recent bookings found.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-dark-900 space-y-4">
              {recentBookings.map((b) => (
                <div key={b.bid} className="flex items-center justify-between pt-4 first:pt-0">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 dark:text-dark-500">
                      TICKET #{b.bid}
                    </span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {b.source} → {b.destination}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-dark-500">
                      Passenger: {b.customer_name}
                    </p>
                  </div>
                  <Badge variant={b.ticket_status}>{b.ticket_status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Transactions List */}
        <Card className="space-y-6" hoverable={false}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-900">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Payments Ledger
              </h3>
              <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
                Recent ledger records.
              </p>
            </div>
            <Link
              to="/payments"
              className="text-xs font-bold text-brand-650 hover:text-brand-500 dark:text-brand-400 transition-colors"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-slate-100 dark:bg-dark-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentPayments.length === 0 ? (
            <p className="text-slate-400 dark:text-dark-550 text-sm">No recent payments found.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-dark-900 space-y-4">
              {recentPayments.map((p) => (
                <div key={p.bid} className="flex items-center justify-between pt-4 first:pt-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(p.amount)}
                    </p>
                    <p className="text-xs text-slate-450 dark:text-dark-500">
                      Ticket #{p.bid} · {p.customer_name}
                    </p>
                  </div>
                  <Badge variant={p.payment_status}>{p.payment_status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Activity Timeline Section */}
      <Card className="space-y-6 text-left" hoverable={false}>
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 dark:border-dark-900">
          <Terminal className="h-5 w-5 text-slate-400" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              System Activity Logs
            </h3>
            <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
              Live updates of database and endpoint processes.
            </p>
          </div>
        </div>

        {activityLogs.length === 0 ? (
          <p className="text-slate-450 dark:text-dark-550 text-sm py-4">No recent activity logs.</p>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-dark-850 pl-5 ml-2.5 space-y-6">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="relative">
                {/* Bullet node dot */}
                <div className={`absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-dark-950 flex items-center justify-center shrink-0`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current text-brand-500" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-dark-550 font-semibold font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getActivityColor(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-450 dark:text-dark-500">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPage;
