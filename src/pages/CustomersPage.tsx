import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DataTable from '../components/DataTable';
import type { Column } from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import type { Customer } from '../types';
import { customerService } from '../services/customer.service';
import { Users, Mail, Phone, RefreshCw } from 'lucide-react';
import Button from '../components/Button';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      console.error(err);
      setError(
        'Failed to connect to the backend API. Please make sure the FastAPI server is running on http://localhost:8000.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns: Column<Customer>[] = [
    {
      key: 'cust_id',
      header: 'ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-bold text-slate-400 dark:text-dark-500 bg-slate-100 dark:bg-dark-900 px-2 py-1 rounded">
          #{item.cust_id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
            {item.name[0].toUpperCase()}
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      sortable: true,
      render: (item) => (
        <a
          href={`mailto:${item.email}`}
          className="flex items-center text-slate-600 hover:text-brand-500 dark:text-dark-350 dark:hover:text-brand-400 transition-colors"
        >
          <Mail className="h-3.5 w-3.5 mr-2 opacity-70" />
          {item.email}
        </a>
      ),
    },
    {
      key: 'phone_no',
      header: 'Phone Number',
      render: (item) => (
        <span className="flex items-center font-mono text-xs text-slate-500 dark:text-dark-400">
          <Phone className="h-3.5 w-3.5 mr-2 opacity-70" />
          {item.phone_no || '9876543210'}
        </span>
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
              Customer Directory
            </h2>
            <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
              Browse list of all registered flight passengers retrieved from database.
            </p>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search name or email..."
              className="w-full sm:max-w-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCustomers}
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              className="px-3 shrink-0"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Content Box */}
        {error ? (
          <Card className="p-8">
            <ErrorState message={error} onRetry={fetchCustomers} />
          </Card>
        ) : (
          <Card className="p-6 overflow-hidden">
            <DataTable
              data={customers}
              columns={columns}
              searchKey="name"
              searchQuery={searchQuery}
              pageSize={6}
              loading={loading}
              emptyState={
                <EmptyState
                  title="No Customers Found"
                  description="Register a new client from the portal to add records to the PostgreSQL tables."
                  icon={<Users className="h-10 w-10 text-slate-400 dark:text-dark-600" />}
                />
              }
            />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;
