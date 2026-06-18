import type { Booking } from '../types';

const STORAGE_KEY = 'tms_bookings';

const initialBookings: Booking[] = [
  { bid: 1001, cust_id: 1, customer_name: 'John Doe', source: 'New York (JFK)', destination: 'London (LHR)', ticket_status: 'Confirmed', created_at: '2026-06-15T10:30:00Z' },
  { bid: 1002, cust_id: 2, customer_name: 'Alice Smith', source: 'San Francisco (SFO)', destination: 'Tokyo (NRT)', ticket_status: 'Pending', created_at: '2026-06-16T14:45:00Z' },
  { bid: 1003, cust_id: 3, customer_name: 'Bob Johnson', source: 'Chicago (ORD)', destination: 'Paris (CDG)', ticket_status: 'Cancelled', created_at: '2026-06-17T09:15:00Z' },
  { bid: 1004, cust_id: 1, customer_name: 'John Doe', source: 'Los Angeles (LAX)', destination: 'Sydney (SYD)', ticket_status: 'Confirmed', created_at: '2026-06-17T18:20:00Z' },
  { bid: 1005, cust_id: 4, customer_name: 'Sarah Connor', source: 'Boston (BOS)', destination: 'Berlin (BER)', ticket_status: 'Confirmed', created_at: '2026-06-18T08:00:00Z' }
];

export const bookingService = {
  getBookings(): Booking[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(data);
  },

  getBookingsByCustomer(custId: number): Booking[] {
    const bookings = this.getBookings();
    return bookings.filter(b => b.cust_id === custId);
  },

  createBooking(booking: Omit<Booking, 'bid' | 'created_at'>): Booking {
    const bookings = this.getBookings();
    const newBid = bookings.length > 0 ? Math.max(...bookings.map(b => b.bid)) + 1 : 1001;
    const newBooking: Booking = {
      ...booking,
      bid: newBid,
      created_at: new Date().toISOString()
    };
    
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

    // Log Activity
    const logs = JSON.parse(localStorage.getItem('tms_activity_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(),
      action: 'Created Booking',
      details: `Ticket #${newBid} from ${booking.source} to ${booking.destination}`,
      timestamp: new Date().toISOString(),
      type: 'success'
    });
    localStorage.setItem('tms_activity_logs', JSON.stringify(logs.slice(0, 50)));

    // Create corresponding payment
    const payments = JSON.parse(localStorage.getItem('tms_payments') || '[]');
    payments.unshift({
      bid: newBid,
      cust_id: booking.cust_id,
      customer_name: booking.customer_name || 'Customer',
      source: booking.source,
      destination: booking.destination,
      payment_status: 'Unpaid',
      amount: Math.floor(Math.random() * 800) + 200, // Random ticket price
      created_at: new Date().toISOString()
    });
    localStorage.setItem('tms_payments', JSON.stringify(payments));

    return newBooking;
  },

  updateBookingStatus(bid: number, status: Booking['ticket_status']): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.bid === bid);
    if (index === -1) return null;

    bookings[index].ticket_status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

    // Log Activity
    const logs = JSON.parse(localStorage.getItem('tms_activity_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(),
      action: 'Updated Booking Status',
      details: `Ticket #${bid} status changed to ${status}`,
      timestamp: new Date().toISOString(),
      type: status === 'Confirmed' ? 'success' : status === 'Cancelled' ? 'error' : 'info'
    });
    localStorage.setItem('tms_activity_logs', JSON.stringify(logs.slice(0, 50)));

    return bookings[index];
  }
};
