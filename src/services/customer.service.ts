import api from '../api/axios';
import type { Customer } from '../types';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const response = await api.get<any[]>('/customers');
    
    // Convert array-of-arrays response to standard Customer objects if necessary
    return response.data.map((item) => {
      if (Array.isArray(item)) {
        return {
          cust_id: item[0],
          name: item[1],
          email: item[2],
          // Add default fields since they are not returned in the raw query
          phone_no: 'N/A',
          gender: 'N/A',
          age: 0,
        };
      }
      return {
        cust_id: item.cust_id,
        name: item.name,
        email: item.email,
        phone_no: item.phone_no || 'N/A',
        gender: item.gender || 'N/A',
        age: item.age || 0,
      };
    });
  },
};
