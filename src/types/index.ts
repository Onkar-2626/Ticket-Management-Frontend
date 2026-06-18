export interface Customer {
  cust_id: number;
  name: string;
  email: string;
  phone_no?: string;
  gender?: string;
  age?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone_no: string;
  gender: string;
  age: number;
}

export interface Booking {
  bid: number;
  cust_id: number;
  customer_name?: string;
  source: string;
  destination: string;
  ticket_status: 'Pending' | 'Confirmed' | 'Cancelled';
  created_at?: string;
}

export interface Payment {
  bid: number;
  cust_id: number;
  customer_name?: string;
  source?: string;
  destination?: string;
  payment_status: 'Paid' | 'Unpaid' | 'Refunded';
  amount: number;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  cust_id: number;
  name: string;
  email: string;
}

export interface APIResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}
