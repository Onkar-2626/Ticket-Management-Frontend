import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';
import type { Booking } from '../types';
import { bookingService } from '../services/booking.service';
import { Plane, Plus, MapPin, Compass, Calendar, XCircle, ArrowRightLeft, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Zod Validation schema for booking modal
const bookingSchema = z.object({
  source: z.string().min(3, 'Source airport must be at least 3 characters'),
  destination: z.string().min(3, 'Destination airport must be at least 3 characters'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const fetchBookings = () => {
    setLoading(true);
    const data = bookingService.getBookings();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = (bid: number) => {
    if (window.confirm('Are you sure you want to cancel this ticket reservation?')) {
      const updated = bookingService.updateBookingStatus(bid, 'Cancelled');
      if (updated) {
        toast.success(`Booking #${bid} cancelled successfully.`);
        fetchBookings();
      }
    }
  };

  const onSubmitBooking = async (data: BookingFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    // Artificially delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    bookingService.createBooking({
      cust_id: user.cust_id,
      customer_name: user.name,
      source: data.source,
      destination: data.destination,
      ticket_status: 'Pending',
    });

    toast.success('Ticket booked successfully! Access payments ledger to settle payment.');
    setIsModalOpen(false);
    reset();
    fetchBookings();
    setIsSubmitting(false);
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.ticket_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 text-left">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-850 dark:text-white">
              Flight Bookings
            </h2>
            <p className="text-xs text-slate-400 dark:text-dark-500 mt-0.5">
              Review current airline flight cards, add reservations, and audit schedules.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Create Ticket
          </Button>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search destination, source or passenger..."
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
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Content Panel */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 w-full bg-slate-100 dark:bg-dark-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No Bookings Listed"
            description="Adjust your search criteria or register a new flight using the button above."
            actionText="Book Flight Ticket"
            onActionClick={() => setIsModalOpen(true)}
            icon={<Plane className="h-10 w-10 text-slate-400 dark:text-dark-600 rotate-45" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBookings.map((b) => (
              <Card key={b.bid} className="relative overflow-hidden group flex flex-col justify-between h-52 border border-slate-200/50 dark:border-dark-800/80" hoverable>
                {/* Accent status tag block indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  b.ticket_status === 'Confirmed' ? 'bg-emerald-500' : b.ticket_status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'
                }`} />

                {/* Header */}
                <div className="flex justify-between items-start pl-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider font-mono">
                        TICKET #{b.bid}
                      </span>
                      <Badge variant={b.ticket_status}>{b.ticket_status}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-dark-550 font-semibold truncate max-w-[180px]">
                      Passenger: {b.customer_name || 'System Client'}
                    </p>
                  </div>
                  
                  {/* Cancel button */}
                  {b.ticket_status !== 'Cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(b.bid)}
                      className="p-1 text-slate-350 hover:text-rose-500 dark:text-dark-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                      title="Cancel Booking"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>

                {/* Flight Route Details */}
                <div className="flex items-center justify-between my-4 px-2 select-all">
                  <div className="space-y-1 text-left">
                    <div className="flex items-center text-slate-400 dark:text-dark-500 space-x-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">From</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {b.source}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center shrink-0 px-4 select-none">
                    <div className="h-px w-14 bg-slate-200 dark:bg-dark-800 relative">
                      <Plane className="h-3.5 w-3.5 text-brand-500 absolute -top-1.5 left-1/2 -translate-x-1/2 bg-white dark:bg-dark-900 px-0.5 box-content rotate-95 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <div className="flex items-center justify-end text-slate-400 dark:text-dark-500 space-x-1">
                      <Compass className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">To</span>
                    </div>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {b.destination}
                    </p>
                  </div>
                </div>

                {/* Footer details */}
                <div className="border-t border-slate-100 dark:border-dark-900 pt-3 flex justify-between items-center pl-2 select-none">
                  <span className="flex items-center text-[10px] text-slate-400 dark:text-dark-500 font-semibold font-mono">
                    <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                    {formatDate(b.created_at)}
                  </span>
                  
                  {b.ticket_status === 'Pending' && (
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => navigate('/payments')}
                      icon={<CreditCard className="h-3.5 w-3.5" />}
                      className="text-[10px] px-3.5 py-1.5 rounded-lg"
                    >
                      Pay Ticket
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Booking Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Flight Ticket"
        >
          <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-5">
            <Input
              label="Source Airport"
              placeholder="e.g. London Heathrow (LHR)"
              icon={<MapPin className="h-4 w-4" />}
              error={errors.source?.message}
              {...register('source')}
            />

            <div className="flex justify-center text-slate-300 select-none">
              <ArrowRightLeft className="h-5 w-5 rotate-90 md:rotate-0" />
            </div>

            <Input
              label="Destination Airport"
              placeholder="e.g. New York (JFK)"
              icon={<Compass className="h-4 w-4" />}
              error={errors.destination?.message}
              {...register('destination')}
            />

            <div className="bg-slate-50 dark:bg-dark-950 p-4 rounded-xl border border-slate-150/40 dark:border-dark-905 flex justify-between items-center select-none text-xs">
              <span className="text-slate-450 dark:text-dark-500 font-semibold">Base Price Estimate:</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">$200 - $1,000 USD</span>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="flex-1 py-3"
              >
                Book Flight
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
