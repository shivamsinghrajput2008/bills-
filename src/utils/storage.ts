import { Product, StoreSettings, Bill } from '../types';

export const STORAGE_KEYS = {
  PRODUCTS: 'sbb_products_v1',
  BILLS: 'sbb_bills_v1',
  SETTINGS: 'sbb_settings_v1',
  THEME: 'sbb_theme_v1',
  SOUND: 'sbb_sound_v1',
  NEXT_INVOICE_NUM: 'sbb_invoice_seq_v1',
  AUTH_UNLOCKED: 'sbb_auth_unlocked_v1',
  AUTH_SESSION: 'sbb_auth_session_v1',
  APP_PASSWORD: 'sbb_app_password_v1'
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'SUPER BACHAT BAZZAR',
  storeAddress: 'attardah kachhi pakki , muzzafarpur',
  storePhone: '+91 98765 43210',
  storeUpi: 'superbachat@upi',
  storeWishes: '🙏 Thank you for shopping with us! Visit again. Save More with Super Bachat Bazzar! 🙏'
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'sbb-p1',
    name: 'Fortune Sunlite Refined Sunflower Oil (1 Litre Pouch)',
    category: 'Groceries & Staples',
    barcode: '8906007280018',
    inwardDateTime: '2026-09-01T09:30',
    quantity: 45,
    unit: 'Pcs',
    mrp: 165,
    rate: 142,
    costPrice: 130,
    shelf: 'Rack A-1'
  },
  {
    id: 'sbb-p2',
    name: 'Aashirvaad Shudh Chakki Atta (5kg Bag)',
    category: 'Groceries & Staples',
    barcode: '8901030010182',
    inwardDateTime: '2026-09-01T09:00',
    quantity: 30,
    unit: 'Packets',
    mrp: 260,
    rate: 228,
    costPrice: 210,
    shelf: 'Floor Pallet 2'
  },
  {
    id: 'sbb-p3',
    name: 'Tata Salt Vacuum Evaporated (1kg)',
    category: 'Groceries & Staples',
    barcode: '8901030383842',
    inwardDateTime: '2026-09-01T09:00',
    quantity: 60,
    unit: 'Packets',
    mrp: 28,
    rate: 24,
    costPrice: 20,
    shelf: 'Rack A-3'
  },
  {
    id: 'sbb-p4',
    name: 'Amul Butter Pasteurized (500g)',
    category: 'Dairy & Bakery',
    barcode: '8901262010052',
    inwardDateTime: '2026-09-01T10:15',
    quantity: 25,
    unit: 'Pcs',
    mrp: 275,
    rate: 258,
    costPrice: 242,
    shelf: 'Chiller 1'
  },
  {
    id: 'sbb-p5',
    name: 'Maggi 2-Minute Masala Noodles (70g)',
    category: 'Snacks & Beverages',
    barcode: '8901058852331',
    inwardDateTime: '2026-09-01T10:30',
    quantity: 100,
    unit: 'Packets',
    mrp: 14,
    rate: 12,
    costPrice: 10.5,
    shelf: 'Rack B-1'
  },
  {
    id: 'sbb-p6',
    name: 'Surf Excel Easy Wash Detergent Powder (1kg)',
    category: 'Household & Cleaning',
    barcode: '8901030704029',
    inwardDateTime: '2026-09-01T10:00',
    quantity: 35,
    unit: 'Packets',
    mrp: 145,
    rate: 128,
    costPrice: 115,
    shelf: 'Rack D-2'
  },
  {
    id: 'sbb-p7',
    name: 'Dettol Original Bathing Soap (Pack of 3 x 125g)',
    category: 'Personal Care',
    barcode: '8901396384013',
    inwardDateTime: '2026-09-01T10:15',
    quantity: 40,
    unit: 'Packets',
    mrp: 140,
    rate: 119,
    costPrice: 105,
    shelf: 'Rack C-1'
  },
  {
    id: 'sbb-p8',
    name: 'MDH Deggi Mirch Powder (100g)',
    category: 'Spices & Masalas',
    barcode: '8901282110039',
    inwardDateTime: '2026-09-01T11:00',
    quantity: 50,
    unit: 'Packets',
    mrp: 85,
    rate: 74,
    costPrice: 65,
    shelf: 'Rack A-4'
  },
  {
    id: 'sbb-p9',
    name: 'Parle-G Original Glucose Biscuits (800g Family Pack)',
    category: 'Biscuits & Confectionery',
    barcode: '8901719101015',
    inwardDateTime: '2026-09-01T11:30',
    quantity: 40,
    unit: 'Packets',
    mrp: 90,
    rate: 78,
    costPrice: 70,
    shelf: 'Rack B-3'
  },
  {
    id: 'sbb-p10',
    name: 'Coca-Cola Soft Drink Bottle (750ml)',
    category: 'Snacks & Beverages',
    barcode: '8901764012236',
    inwardDateTime: '2026-09-01T12:00',
    quantity: 50,
    unit: 'Pcs',
    mrp: 45,
    rate: 38,
    costPrice: 33,
    shelf: 'Beverage Cooler'
  },
  {
    id: 'sbb-p11',
    name: 'Vim Dishwash Liquid Gel Lemon (500ml Bottle)',
    category: 'Household & Cleaning',
    barcode: '8901030582030',
    inwardDateTime: '2026-09-01T10:45',
    quantity: 30,
    unit: 'Pcs',
    mrp: 130,
    rate: 112,
    costPrice: 98,
    shelf: 'Rack D-3'
  },
  {
    id: 'sbb-p12',
    name: 'Colgate Strong Teeth Dental Cream (200g)',
    category: 'Personal Care',
    barcode: '8901314010123',
    inwardDateTime: '2026-09-01T11:00',
    quantity: 45,
    unit: 'Pcs',
    mrp: 120,
    rate: 104,
    costPrice: 92,
    shelf: 'Rack C-2'
  },
  {
    id: 'sbb-p13',
    name: 'India Gate Super Basmati Rice (1kg Pack)',
    category: 'Groceries & Staples',
    barcode: '8901725181216',
    inwardDateTime: '2026-09-01T09:15',
    quantity: 40,
    unit: 'Packets',
    mrp: 195,
    rate: 168,
    costPrice: 150,
    shelf: 'Rack A-2'
  },
  {
    id: 'sbb-p14',
    name: 'Everest Pav Bhaji Masala (100g)',
    category: 'Spices & Masalas',
    barcode: '8901786101017',
    inwardDateTime: '2026-09-01T11:15',
    quantity: 35,
    unit: 'Packets',
    mrp: 78,
    rate: 68,
    costPrice: 58,
    shelf: 'Rack A-4'
  },
  {
    id: 'sbb-p15',
    name: 'Britannia Good Day Butter Cookies (200g)',
    category: 'Biscuits & Confectionery',
    barcode: '8901063012010',
    inwardDateTime: '2026-09-01T11:45',
    quantity: 60,
    unit: 'Packets',
    mrp: 45,
    rate: 39,
    costPrice: 34,
    shelf: 'Rack B-2'
  }
];

export function loadStoredProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
    return [...SAMPLE_PRODUCTS];
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [...SAMPLE_PRODUCTS];
  } catch {
    return [...SAMPLE_PRODUCTS];
  }
}

export function saveStoredProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function loadStoredBills(): Bill[] {
  const data = localStorage.getItem(STORAGE_KEYS.BILLS);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredBills(bills: Bill[]) {
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
}

export function loadStoredSettings(): StoreSettings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!data) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveStoredSettings(settings: StoreSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredInvoiceSeq(): number {
  const val = localStorage.getItem(STORAGE_KEYS.NEXT_INVOICE_NUM);
  return val ? parseInt(val, 10) || 1 : 1;
}

export function saveStoredInvoiceSeq(seq: number) {
  localStorage.setItem(STORAGE_KEYS.NEXT_INVOICE_NUM, seq.toString());
}

export function getAppPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.APP_PASSWORD) || 'super99';
}

export function setAppPassword(pwd: string) {
  localStorage.setItem(STORAGE_KEYS.APP_PASSWORD, pwd);
}

export function isTerminalUnlocked(): boolean {
  const localAuth = localStorage.getItem(STORAGE_KEYS.AUTH_UNLOCKED) === 'true';
  const sessionAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION) === 'true';
  return localAuth || sessionAuth;
}

export function unlockTerminal(remember: boolean) {
  if (remember) {
    localStorage.setItem(STORAGE_KEYS.AUTH_UNLOCKED, 'true');
  } else {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
  }
}

export function lockTerminalState() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_UNLOCKED);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
}

export function formatCurrency(val: number): string {
  const num = Number(val) || 0;
  return `₹${num.toFixed(2)}`;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' });
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

export function generateEAN13Barcode(): string {
  const code = '890' + Math.floor(100000000 + Math.random() * 900000000).toString();
  // 12 digits + 1 checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return code + checksum;
}

export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
