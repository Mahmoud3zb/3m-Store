import { api } from './api';

export interface IShippingAddress {
  street: string;
  city: string;
  phone: string;
}

export interface IOrderItem {
  productID: {
    _id: string;
    name: string;
    imageCover?: string;
    price: number;
  };
  size: string;
  colorCode: string;
  quantity: number;
  price: number;
}

export interface IIssueReport {
  reason: string;
  details?: string;
  reportedAt: string;
  status: string;
}

export interface IOrder {
  _id: string;
  userID: {
    _id: string;
    name: string;
    email: string;
  };
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalPrice: number;
  paymentMethod: 'cash' | 'card';
  status: 'pending' | 'preparing' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled' | 'issue_reported';
  isPaid?: boolean;
  paidAt?: string;
  deliveredAt?: string;
  issueReport?: IIssueReport;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  message: string;
  data: IOrder;
}

export interface IAnalyticsData {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  statusDistribution: {
    pending: number;
    preparing?: number;
    processing?: number;
    ready?: number;
    shipped: number;
    delivered: number;
    cancelled?: number;
    issue_reported?: number;
  };
  trend: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  bestSellers: Array<{
    _id: string;
    totalSold: number;
    totalRevenue: number;
    name: string;
    imageCover: string;
    price: number;
  }>;
  governorates: Array<{
    city: string;
    revenue: number;
    orders: number;
  }>;
}

export const orderService = {
  createOrder: async (shippingAddress: IShippingAddress, paymentMethod: string, promoCode?: string): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/order', { shippingAddress, paymentMethod, promoCode });
    return response.data;
  },

  createDirectOrder: async (productID: string, quantity: number, size: string, colorCode: string, shippingAddress: IShippingAddress, promoCode?: string): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/order/direct', { productID, quantity, size, colorCode, shippingAddress, promoCode });
    return response.data;
  },

  getUserOrders: async (): Promise<IOrder[]> => {
    const response = await api.get<{ message: string; data: IOrder[] }>('/order/user');
    return response.data.data;
  },

  getOrderById: async (id: string): Promise<IOrder> => {
    const response = await api.get<{ message: string; data: IOrder }>(`/order/${id}`);
    return response.data.data;
  },

  getAllOrders: async (): Promise<IOrder[]> => {
    const response = await api.get<{ message: string; data: IOrder[] }>('/order');
    return response.data.data;
  },

  updateOrderStatus: async (id: string, status?: string, isPaid?: boolean): Promise<{ message: string; data: IOrder }> => {
    const response = await api.put<{ message: string; data: IOrder }>(`/order/${id}`, { status, isPaid });
    return response.data;
  },

  confirmDelivery: async (id: string): Promise<{ message: string; data: IOrder }> => {
    const response = await api.post<{ message: string; data: IOrder }>(`/order/${id}/confirm-delivery`);
    return response.data;
  },

  reportOrderIssue: async (id: string, reason: string, details?: string): Promise<{ message: string; data: IOrder }> => {
    const response = await api.post<{ message: string; data: IOrder }>(`/order/${id}/report-issue`, { reason, details });
    return response.data;
  },

  getAnalytics: async (): Promise<IAnalyticsData> => {
    const response = await api.get<{ message: string; data: IAnalyticsData }>('/order/admin/analytics');
    return response.data.data;
  }
};
