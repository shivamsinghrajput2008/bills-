import React, { useState, useRef, useEffect } from 'react';
import {
  UserCheck,
  User,
  Phone,
  ScanBarcode,
  Camera,
  ShoppingCart,
  Trash2,
  ShoppingBasket,
  Sparkles,
  Calculator,
  Tag,
  Wallet,
  Banknote,
  QrCode,
  CreditCard,
  BookOpen,
  Save,
  CheckCircle2,
  Pause,
} from 'lucide-react';
import { Product, CartItem, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/storage';

interface POSViewProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onSetCartQty: (productId: string, qty: number) => void;
  onSetCartRate: (productId: string, newRate: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onHoldCart: () => void;
  nextInvoiceNumber: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  extraDiscountType: 'rs' | 'pct';
  setExtraDiscountType: (type: 'rs' | 'pct') => void;
  extraDiscountVal: number;
  setExtraDiscountVal: (val: number) => void;
  includeGst: boolean;
  setIncludeGst: (val: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  onCheckout: (triggerPrint: boolean) => void;
  onOpenCamScanner: () => void;
}

const CATEGORIES = [
  'all',
  'Groceries & Staples',
  'Dairy & Bakery',
  'Snacks & Beverages',
  'Personal Care',
  'Household & Cleaning',
  'Spices & Masalas',
  'Biscuits & Confectionery',
];

export const POSView: React.FC<POSViewProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onSetCartQty,
  onSetCartRate,
  onRemoveFromCart,
  onClearCart,
  onHoldCart,
  nextInvoiceNumber,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  extraDiscountType,
  setExtraDiscountType,
  extraDiscountVal,
  setExtraDiscountVal,
  includeGst,
  setIncludeGst,
  paymentMethod,
  setPaymentMethod,
  onCheckout,
  onOpenCamScanner,
}) => {
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cashTendered, setCashTendered] = useState<number | ''>('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Filter search suggestions
  const trimmedQuery = barcodeQuery.trim().toLowerCase();
  const searchSuggestions = trimmedQuery
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.barcode.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 8)
    : [];

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = barcodeQuery.trim();
      if (!code) return;

      // Exact barcode match first
      const exact = products.find(
        (p) => p.barcode.toLowerCase() === code.toLowerCase() || p.id === code
      );
      if (exact) {
        onAddToCart(exact);
        setBarcodeQuery('');
        return;
      }

      // Name matches
      const matches = products.filter((p) =>
        p.name.toLowerCase().includes(code.toLowerCase())
      );
      if (matches.length === 1) {
        onAddToCart(matches[0]);
        setBarcodeQuery('');
      } else if (matches.length > 1) {
        // Keep suggestions visible
      } else {
        // Not found
      }
    }
  };

  // Calculations
  const totalMrp = cart.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const totalStoreAmount = cart.reduce(
    (sum, item) => sum + item.product.rate * item.quantity,
    0
  );
  const storeDiscount = totalMrp - totalStoreAmount;

  let extraDiscount = 0;
  if (extraDiscountType === 'rs') {
    extraDiscount = extraDiscountVal;
  } else {
    extraDiscount = (totalStoreAmount * extraDiscountVal) / 100;
  }
  extraDiscount = Math.min(extraDiscount, totalStoreAmount);

  const amountAfterExtra = Math.max(0, totalStoreAmount - extraDiscount);
  const gstAmount = includeGst ? amountAfterExtra * 0.05 : 0;
  const grandTotal = Math.round(amountAfterExtra + gstAmount);
  const totalSavings = Math.max(0, totalMrp - grandTotal);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cash change
  const cashNum = typeof cashTendered === 'number' ? cashTendered : 0;
  const changeToReturn = Math.max(0, cashNum - grandTotal);

  // Filtered quick items for bottom grid
  const quickItems =
    selectedCategory === 'all'
      ? products.slice(0, 18)
      : products.filter((p) => p.category === selectedCategory).slice(0, 18);

  return (
    <section id="view-pos" className="view-section active">
      <div className="pos-layout">
        {/* Left Column: Customer Details, Barcode / Search Box, Cart Table, Quick Products */}
        <div className="pos-left-panel">
          {/* Row 1: Customer Information */}
          <div className="pos-card customer-card" style={{ marginBottom: 16 }}>
            <div className="pos-card-header">
              <UserCheck size={18} />
              <span>Customer Information</span>
            </div>
            <div
              className="customer-inputs-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
            >
              <div className="form-group-compact">
                <label htmlFor="cust-name-input">
                  <User size={14} /> Customer Name
                </label>
                <input
                  type="text"
                  id="cust-name-input"
                  className="form-input-compact"
                  placeholder="Cash Customer / Guest"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group-compact">
                <label htmlFor="cust-phone-input">
                  <Phone size={14} /> Mobile No. (WhatsApp)
                </label>
                <input
                  type="tel"
                  id="cust-phone-input"
                  className="form-input-compact"
                  placeholder="10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Barcode / Search Box */}
          <div className="scan-search-card" style={{ marginBottom: 16, position: 'relative' }}>
            <div className="scanner-input-wrapper">
              <div className="scanner-icon">
                <ScanBarcode size={20} />
              </div>
              <input
                ref={barcodeInputRef}
                type="text"
                id="barcode-input"
                className="barcode-input"
                placeholder="Type product name or scan barcode to add item..."
                autoComplete="off"
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                id="open-cam-scanner-btn"
                title="Scan using Camera (F9)"
                onClick={onOpenCamScanner}
              >
                <Camera size={16} />
                <span>Camera Scan</span>
              </button>
            </div>

            {/* Auto Suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="search-suggestions" id="search-suggestions" style={{ display: 'block' }}>
                {searchSuggestions.map((p) => (
                  <div
                    key={p.id}
                    className="suggestion-item"
                    onClick={() => {
                      onAddToCart(p);
                      setBarcodeQuery('');
                    }}
                  >
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <div className="suggestion-meta">
                        <span>📦 Barcode: {p.barcode}</span>
                        <span>
                          Stock: {p.quantity} {p.unit}
                        </span>
                      </div>
                    </div>
                    <div className="suggestion-price">
                      <div className="suggestion-rate">{formatCurrency(p.rate)}</div>
                      <div className="suggestion-mrp">MRP {formatCurrency(p.mrp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Items Table Card */}
          <div className="cart-table-card">
            <div className="card-header-row">
              <div className="cart-title-group">
                <h2 className="card-title">
                  <ShoppingCart size={18} />
                  Bill Items List
                </h2>
                <span className="cart-badge" id="cart-item-count">
                  {totalItemsCount} items
                </span>
              </div>
              <div className="cart-actions-group">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-xs"
                  id="clear-cart-btn"
                  onClick={onClearCart}
                  disabled={cart.length === 0}
                >
                  <Trash2 size={14} /> Clear Items
                </button>
              </div>
            </div>

            <div className="cart-table-container">
              {cart.length === 0 ? (
                <div className="empty-cart-state" id="empty-cart-state" style={{ display: 'flex' }}>
                  <div className="empty-icon-circle">
                    <ShoppingBasket size={32} />
                  </div>
                  <h3>No items in current bill</h3>
                  <p>Type a product name or scan a barcode above to add items to this sale.</p>
                </div>
              ) : (
                <table className="cart-table" id="cart-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Product Name</th>
                      <th style={{ width: 110 }}>MRP (₹)</th>
                      <th style={{ width: 110 }}>Rate (₹)</th>
                      <th style={{ width: 140, textAlign: 'center' }}>Quantity</th>
                      <th style={{ width: 120, textAlign: 'right' }}>Total (₹)</th>
                      <th style={{ width: 90, textAlign: 'right' }}>Savings</th>
                      <th style={{ width: 50, textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody id="cart-table-body">
                    {cart.map((item, index) => {
                      const itemTotal = item.product.rate * item.quantity;
                      const itemSavings = (item.product.mrp - item.product.rate) * item.quantity;
                      return (
                        <tr key={item.product.id}>
                          <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {index + 1}
                          </td>
                          <td>
                            <div className="cart-item-name">{item.product.name}</div>
                            {item.product.barcode && (
                              <div className="cart-item-code">Barcode: {item.product.barcode}</div>
                            )}
                          </td>
                          <td>
                            <span className="mrp-strike">{formatCurrency(item.product.mrp)}</span>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="mini-number-input"
                              style={{
                                width: 85,
                                fontWeight: 700,
                                color: 'var(--primary)',
                                textAlign: 'right',
                              }}
                              value={item.product.rate}
                              min={0}
                              step={0.5}
                              title="Click to edit selling rate"
                              onChange={(e) =>
                                onSetCartRate(item.product.id, parseFloat(e.target.value) || 0)
                              }
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="qty-control-group">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => onUpdateCartQty(item.product.id, -1)}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="qty-input"
                                value={item.quantity}
                                min={1}
                                onChange={(e) =>
                                  onSetCartQty(item.product.id, parseInt(e.target.value, 10) || 1)
                                }
                              />
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => onUpdateCartQty(item.product.id, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }} className="item-total-col">
                            {formatCurrency(itemTotal)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="item-savings-pill">Save ₹{itemSavings.toFixed(2)}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="remove-item-btn"
                              title="Remove Item"
                              onClick={() => onRemoveFromCart(item.product.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Item Category Filter Chips & Grid */}
          <div className="pos-card quick-category-card" style={{ marginTop: 16 }}>
            <div className="category-chips-row" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>

            <div className="quick-items-grid" id="quick-items-grid" style={{ marginTop: 12 }}>
              {quickItems.map((p) => {
                const savings = Math.max(0, p.mrp - p.rate);
                return (
                  <div
                    key={p.id}
                    className="quick-item-card"
                    onClick={() => onAddToCart(p)}
                  >
                    <span className="quick-item-badge">Bachat ₹{savings.toFixed(0)}</span>
                    <div className="quick-item-title">{p.name}</div>
                    <div className="quick-item-prices">
                      <span className="quick-item-rate">{formatCurrency(p.rate)}</span>
                      <span className="quick-item-mrp">{formatCurrency(p.mrp)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Savings Banner, Billing Summary, Payment Methods, Cash Change, Action Buttons */}
        <div className="pos-right-panel">
          {/* Total Savings Banner */}
          <div className="savings-banner" id="savings-banner">
            <div className="savings-badge-icon">
              <Sparkles size={28} />
            </div>
            <div className="savings-text-group">
              <span className="savings-label">SUPER BACHAT SAVINGS</span>
              <span className="savings-amount" id="summary-savings-amount">
                {formatCurrency(totalSavings)}
              </span>
              <span className="savings-subtext">Customer Savings</span>
            </div>
          </div>

          {/* Billing Summary Calculation Card */}
          <div className="pos-card summary-card">
            <div className="pos-card-header">
              <Calculator size={18} />
              <span>Billing Summary</span>
              <span className="invoice-num-preview" id="preview-invoice-num">
                #{nextInvoiceNumber}
              </span>
            </div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span className="summary-label">Total MRP</span>
                <span className="summary-val" id="summary-mrp-total">
                  {formatCurrency(totalMrp)}
                </span>
              </div>
              <div className="summary-row text-success">
                <span className="summary-label">
                  <Tag size={12} className="mini-icon" /> Store Discount
                </span>
                <span className="summary-val" id="summary-discount-total">
                  -{formatCurrency(storeDiscount)}
                </span>
              </div>

              {/* Additional Discount Row */}
              <div className="summary-row extra-discount-row">
                <div className="extra-discount-label">
                  <span>Special Discount</span>
                  <div className="discount-type-toggle">
                    <button
                      type="button"
                      className={`type-btn ${extraDiscountType === 'rs' ? 'active' : ''}`}
                      id="disc-type-rs"
                      onClick={() => setExtraDiscountType('rs')}
                    >
                      ₹
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${extraDiscountType === 'pct' ? 'active' : ''}`}
                      id="disc-type-pct"
                      onClick={() => setExtraDiscountType('pct')}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div className="extra-discount-input-wrap">
                  <input
                    type="number"
                    id="extra-discount-val"
                    value={extraDiscountVal}
                    min="0"
                    className="mini-number-input"
                    onChange={(e) => setExtraDiscountVal(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* GST / Tax Toggle */}
              <div className="summary-row gst-row">
                <label className="gst-toggle-label" htmlFor="gst-enable-checkbox">
                  <input
                    type="checkbox"
                    id="gst-enable-checkbox"
                    checked={includeGst}
                    onChange={(e) => setIncludeGst(e.target.checked)}
                  />
                  <span>Include GST (5%)</span>
                </label>
                <span className="summary-val" id="summary-gst-total">
                  {formatCurrency(gstAmount)}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row grand-total-row">
                <div className="grand-total-label-group">
                  <span className="grand-total-label">Grand Total</span>
                  <span className="roundoff-note" id="roundoff-note">
                    (Rounded)
                  </span>
                </div>
                <div className="grand-total-amount" id="summary-grand-total">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-method-section">
              <label className="payment-label">
                <Wallet size={16} /> Select Payment Method:
              </label>
              <div className="payment-methods-grid">
                <button
                  type="button"
                  className={`pay-method-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Cash')}
                >
                  <Banknote size={16} />
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  className={`pay-method-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <QrCode size={16} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  className={`pay-method-btn ${paymentMethod === 'Card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <CreditCard size={16} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  className={`pay-method-btn ${paymentMethod === 'Credit' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Credit')}
                >
                  <BookOpen size={16} />
                  <span>Udhar / Khata</span>
                </button>
              </div>
            </div>

            {/* Cash Tendered & Change Return box (when Cash is active) */}
            {paymentMethod === 'Cash' && (
              <div className="cash-calc-box" id="cash-calc-box" style={{ display: 'block' }}>
                <div className="cash-calc-row">
                  <div className="cash-calc-field">
                    <label htmlFor="cash-received-input">Cash Tendered (₹):</label>
                    <input
                      type="number"
                      id="cash-received-input"
                      placeholder="0"
                      className="cash-input"
                      value={cashTendered}
                      onChange={(e) =>
                        setCashTendered(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="cash-calc-field">
                    <label>Change to Return (₹):</label>
                    <div className="change-return-val" id="cash-change-display">
                      {formatCurrency(changeToReturn)}
                    </div>
                  </div>
                </div>
                <div className="quick-cash-denoms">
                  <button type="button" className="denom-btn" onClick={() => setCashTendered(50)}>
                    ₹50
                  </button>
                  <button type="button" className="denom-btn" onClick={() => setCashTendered(100)}>
                    ₹100
                  </button>
                  <button type="button" className="denom-btn" onClick={() => setCashTendered(200)}>
                    ₹200
                  </button>
                  <button type="button" className="denom-btn" onClick={() => setCashTendered(500)}>
                    ₹500
                  </button>
                  <button
                    type="button"
                    className="denom-btn"
                    onClick={() => setCashTendered(grandTotal)}
                  >
                    Exact
                  </button>
                </div>
              </div>
            )}

            {/* Checkout Actions Row */}
            <div className="checkout-actions-row" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                id="quick-save-btn"
                onClick={() => onCheckout(false)}
              >
                <Save size={18} />
                <span>Save Bill</span>
              </button>
              <button
                type="button"
                className="btn btn-success btn-lg btn-block"
                id="complete-checkout-btn"
                onClick={() => onCheckout(true)}
              >
                <CheckCircle2 size={18} />
                <span>Complete &amp; Print Bill (F8)</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-block"
                id="hold-cart-btn"
                onClick={onHoldCart}
              >
                <Pause size={16} /> Hold Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
