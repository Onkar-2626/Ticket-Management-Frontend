import type { Payment } from '../types';

const STORAGE_KEY = 'tms_payments';

const initialPayments: Payment[] = [
  { bid: 1001, cust_id: 1, customer_name: 'John Doe', source: 'New York (JFK)', destination: 'London (LHR)', payment_status: 'Paid', amount: 450, created_at: '2026-06-15T10:30:00Z' },
  { bid: 1002, cust_id: 2, customer_name: 'Alice Smith', source: 'San Francisco (SFO)', destination: 'Tokyo (NRT)', payment_status: 'Unpaid', amount: 780, created_at: '2026-06-16T14:45:00Z' },
  { bid: 1003, cust_id: 3, customer_name: 'Bob Johnson', source: 'Chicago (ORD)', destination: 'Paris (CDG)', payment_status: 'Refunded', amount: 320, created_at: '2026-06-17T09:15:00Z' },
  { bid: 1004, cust_id: 1, customer_name: 'John Doe', source: 'Los Angeles (LAX)', destination: 'Sydney (SYD)', payment_status: 'Paid', amount: 950, created_at: '2026-06-17T18:20:00Z' },
  { bid: 1005, cust_id: 4, customer_name: 'Sarah Connor', source: 'Boston (BOS)', destination: 'Berlin (BER)', payment_status: 'Paid', amount: 380, created_at: '2026-06-18T08:00:00Z' }
];

export const paymentService = {
  getPayments(): Payment[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPayments));
      return initialPayments;
    }
    return JSON.parse(data);
  },

  getPaymentsByCustomer(custId: number): Payment[] {
    const payments = this.getPayments();
    return payments.filter(p => p.cust_id === custId);
  },

  createPayment(payment: Payment): Payment {
    const payments = this.getPayments();
    payments.unshift(payment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    return payment;
  },

  updatePaymentStatus(bid: number, status: Payment['payment_status']): Payment | null {
    const payments = this.getPayments();
    const index = payments.findIndex(p => p.bid === bid);
    if (index === -1) return null;

    payments[index].payment_status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));

    // Log Activity
    const logs = JSON.parse(localStorage.getItem('tms_activity_logs') || '[]');
    logs.unshift({
      id: Math.random().toString(),
      action: 'Updated Payment Status',
      details: `Payment for Booking #${bid} changed to ${status}`,
      timestamp: new Date().toISOString(),
      type: status === 'Paid' ? 'success' : status === 'Refunded' ? 'warning' : 'error'
    });
    localStorage.setItem('tms_activity_logs', JSON.stringify(logs.slice(0, 50)));

    // Also update booking status if payment is confirmed/paid
    if (status === 'Paid') {
      const bookings = JSON.parse(localStorage.getItem('tms_bookings') || '[]');
      const bIndex = bookings.findIndex((b: any) => b.bid === bid);
      if (bIndex !== -1) {
        bookings[bIndex].ticket_status = 'Confirmed';
        localStorage.setItem('tms_bookings', JSON.stringify(bookings));
      }
    } else if (status === 'Refunded') {
      const bookings = JSON.parse(localStorage.getItem('tms_bookings') || '[]');
      const bIndex = bookings.findIndex((b: any) => b.bid === bid);
      if (bIndex !== -1) {
        bookings[bIndex].ticket_status = 'Cancelled';
        localStorage.setItem('tms_bookings', JSON.stringify(bookings));
      }
    }

    return payments[index];
  }
};
