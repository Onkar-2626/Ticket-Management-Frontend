import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import type { Payment } from '../types';
import { paymentService } from '../services/payment.service';
import { CreditCard, Calendar, RefreshCw, CheckCircle, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchPayments = () => {
    setLoading(true);
    const data = paymentService.getPayments();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSettlePayment = (bid: number) => {
    const updated = paymentService.updatePaymentStatus(bid, 'Paid');
    if (updated) {
      toast.success(`Payment for Ticket #${bid} settled. Booking is now CONFIRMED.`);
      fetchPayments();
    }
  };

  const handleRefundPayment = (bid: number) => {
    if (window.confirm(`Are you sure you want to refund payment for Ticket #${bid}? This will cancel the booking.`)) {
      const updated = paymentService.updatePaymentStatus(bid, 'Refunded');
      if (updated) {
        toast.success(`Payment for Ticket #${bid} refunded. Booking status cancelled.`);
        fetchPayments();
      }
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      (p.customer_name && p.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.source && p.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.destination && p.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(p.bid).includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || p.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<Payment>[] = [
    {
      key: 'bid',
      header: 'Ticket ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-slate-400 dark:text-dark-500 bg-slate-100 dark:bg-dark-900 px-2.5 py-1.5 rounded">
          #{item.bid}
        </span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      render: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {item.customer_name || 'System Client'}
        </span>
      ),
    },
    {
      key: 'route',
      header: 'Flight Route',
      render: (item) => (
        <span className="text-xs text-slate-500 dark:text-dark-400">
          {item.source} → {item.destination}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Transaction Date',
      render: (item) => (
        <span className="flex items-center text-xs text-slate-400 dark:text-dark-550 font-mono">
          <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Due',
      sortable: true,
      render: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: 'payment_status',
      header: 'Status',
      sortable: true,
      render: (item) => (
        <Badge variant={item.payment_status}>{item.payment_status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex items-center space-x-2 select-none">
          {item.payment_status === 'Unpaid' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSettlePayment(item.bid)}
              icon={<CheckCircle className="h-3.5 w-3.5" />}
              className="text-[10px] px-3.5 py-1.5 rounded-lg"
            >
              Settle
            </Button>
          )}
          {item.payment_status === 'Paid' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRefundPayment(item.bid)}
              icon={<Ban className="h-3.5 w-3.5" />}
              className="text-[10px] px-3.5 py-1.5 rounded-lg border-red-200 text-red-650 hover:bg-red-50 dark:border-red-950/40 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Refund
            </Button>
          )}
          {item.payment_status === 'Refunded' && (
            <span className="text-xs text-slate-400 dark:text-dark-600 italic">No actions available</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-850 dark:text-white">
              Payments Ledger
            </h2>
            <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
              Review invoice audits, settle transaction balances, and manage passenger refunds.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayments}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            className="px-3 shrink-0"
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ticket, name or flight route..."
            className="w-full md:max-w-md"
          />

          <div className="flex items-center space-x-3 w-full md:w-auto shrink-0 select-none">
            <span className="text-xs font-semibold text-slate-400 dark:text-dark-500 uppercase tracking-wider">
              Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full md:w-40 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <Card className="p-6 overflow-hidden">
          <DataTable
            data={filteredPayments}
            columns={columns}
            pageSize={6}
            loading={loading}
            emptyState={
              <EmptyState
                title="No Transactions Found"
                description="Make a flight ticket reservation from the bookings workspace to log a new invoice here."
                icon={<CreditCard className="h-10 w-10 text-slate-400 dark:text-dark-600" />}
              />
            }
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
