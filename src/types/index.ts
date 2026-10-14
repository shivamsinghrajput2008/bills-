export type TabId = 'pos' | 'inventory' | 'history' | 'analytics' | 'settings';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Credit';

export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  inwardDateTime: string;
  quantity: number;
  unit: string;
  mrp: number;
  rate: number;
  costPrice?: number;
  shelf?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BillItem {
  productId: string;
  name: string;
  barcode: string;
  unit: string;
  mrp: number;
  rate: number;
  quantity: number;
  total: number;
  savings: number;
}

export interface Bill {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  items: BillItem[];
  totalMrp: number;
  storeDiscount: number;
  extraDiscount: number;
  extraDiscountType?: 'rs' | 'pct';
  extraDiscountValue?: number;
  isGstEnabled?: boolean;
  gstAmount: number;
  grandTotal: number;
  totalCustomerSavings: number;
  paymentMethod: PaymentMethod;
  wishes?: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeUpi: string;
  storeWishes: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface TotalsCalculation {
  totalMrp: number;
  storeDiscount: number;
  extraDiscount: number;
  gstAmount: number;
  grandTotal: number;
  totalCustomerSavings: number;
}
