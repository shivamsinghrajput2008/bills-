import React, { useState, useEffect } from 'react';
import {
  FilePenLine,
  X,
  User,
  Phone,
  Wallet,
  Calendar,
  PlusCircle,
  Search,
  Plus,
  List,
  Trash2,
  Sparkles,
  Save,
} from 'lucide-react';
import { Bill, BillItem, Product, PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/storage';

interface EditBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  products: Product[];
  onSaveEditedBill: (updatedBill: Bill) => void;
  onDeleteBill: (billId: string) => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({
  isOpen,
  onClose,
  bill,
  products,
  onSaveEditedBill,
  onDeleteBill,
  onShowToast,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [billDate, setBillDate] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [extraDiscountType, setExtraDiscountType] = useState<'rs' | 'pct'>('rs');
  const [extraDiscountVal, setExtraDiscountVal] = useState<number>(0);
  const [isGst, setIsGst] = useState<boolean>(false);

  // Search in edit modal
  const [searchQuery, setSearchQuery] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualMrp, setManualMrp] = useState<number | ''>('');
  const [manualRate, setManualRate] = useState<number | ''>('');
  const [manualQty, setManualQty] = useState<number>(1);

  useEffect(() => {
    if (!isOpen || !bill) return;

    setCustomerName(bill.customerName || '');
    setCustomerPhone(bill.customerPhone || '');
    setPaymentMethod(bill.paymentMethod || 'Cash');

    if (bill.createdAt) {
      const d = new Date(bill.createdAt);
      if (!isNaN(d.getTime())) {
        const pad = (n: number) => String(n).padStart(2, '0');
        setBillDate(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
            d.getHours()
          )}:${pad(d.getMinutes())}`
        );
      }
    }

    setExtraDiscountType(bill.extraDiscountType || 'rs');
    setExtraDiscountVal(bill.extraDiscountValue || bill.extraDiscount || 0);
    setIsGst(!!bill.isGstEnabled);

    // Deep clone items
    setItems(
      bill.items.map((it) => ({
        ...it,
      }))
    );
  }, [isOpen, bill]);

  if (!isOpen || !bill) return null;

  // Search matches
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchMatches = trimmedSearch
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedSearch) ||
            p.barcode.toLowerCase().includes(trimmedSearch)
        )
        .slice(0, 6)
    : [];

  const handleAddSearchProduct = (p: Product) => {
    const existingIndex = items.findIndex((it) => it.productId === p.id);
    if (existingIndex !== -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total =
        updated[existingIndex].rate * updated[existingIndex].quantity;
      updated[existingIndex].savings =
        (updated[existingIndex].mrp - updated[existingIndex].rate) *
        updated[existingIndex].quantity;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: p.id,
          name: p.name,
          barcode: p.barcode || '',
          unit: p.unit || 'Pcs',
          mrp: p.mrp,
          rate: p.rate,
          quantity: 1,
          total: p.rate,
          savings: p.mrp - p.rate,
        },
      ]);
    }
    setSearchQuery('');
    onShowToast(`Added ${p.name}`, 'success');
  };

  const handleAddManualItem = () => {
    if (!manualName.trim() || !manualMrp || !manualRate) {
      onShowToast('Enter valid product name, MRP, and Rate!', 'error');
      return;
    }
    const numMrp = Number(manualMrp);
    const numRate = Number(manualRate);
    const numQty = Number(manualQty) || 1;

    setItems([
      ...items,
      {
        productId: 'manual-' + Date.now(),
        name: manualName.trim(),
        barcode: '',
        unit: 'Pcs',
        mrp: numMrp,
        rate: numRate,
        quantity: numQty,
        total: numRate * numQty,
        savings: (numMrp - numRate) * numQty,
      },
    ]);

    setManualName('');
    setManualMrp('');
    setManualRate('');
    setManualQty(1);
    onShowToast(`Added ${manualName.trim()} to bill`, 'success');
  };

  const handleUpdateItemPrice = (
    index: number,
    field: 'mrp' | 'rate',
    val: number
  ) => {
    const updated = [...items];
    const it = updated[index];
    if (!it) return;
    it[field] = val;
    it.total = it.rate * it.quantity;
    it.savings = (it.mrp - it.rate) * it.quantity;
    setItems(updated);
  };

  const handleChangeItemQty = (index: number, delta: number, directVal?: number) => {
    const updated = [...items];
    const it = updated[index];
    if (!it) return;
    if (directVal !== undefined) {
      it.quantity = Math.max(1, directVal);
    } else {
      it.quantity = Math.max(1, it.quantity + delta);
    }
    it.total = it.rate * it.quantity;
    it.savings = (it.mrp - it.rate) * it.quantity;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Calculations
  const totalMrp = items.reduce((sum, it) => sum + it.mrp * it.quantity, 0);
  const totalStoreAmount = items.reduce((sum, it) => sum + it.rate * it.quantity, 0);
  const storeDiscount = totalMrp - totalStoreAmount;

  let extraDiscountAmount = 0;
  if (extraDiscountType === 'rs') {
    extraDiscountAmount = extraDiscountVal;
  } else {
    extraDiscountAmount = (totalStoreAmount * extraDiscountVal) / 100;
  }
  extraDiscountAmount = Math.min(extraDiscountAmount, totalStoreAmount);

  const afterDiscount = Math.max(0, totalStoreAmount - extraDiscountAmount);
  const gstAmount = isGst ? afterDiscount * 0.05 : 0;
  const grandTotal = Math.round(afterDiscount + gstAmount);
  const totalCustomerSavings = Math.max(0, totalMrp - grandTotal);

  const handleSave = () => {
    if (items.length === 0) {
      onShowToast('Cannot save empty bill! Add items or delete bill.', 'error');
      return;
    }

    const createdAt = billDate ? new Date(billDate).toISOString() : bill.createdAt;

    const updatedBill: Bill = {
      ...bill,
      customerName: customerName.trim() || 'Cash Customer',
      customerPhone: customerPhone.trim() || undefined,
      paymentMethod,
      createdAt,
      items,
      totalMrp,
      storeDiscount,
      extraDiscount: extraDiscountAmount,
      extraDiscountType,
      extraDiscountValue: extraDiscountVal,
      isGstEnabled: isGst,
      gstAmount,
      grandTotal,
      totalCustomerSavings,
    };

    onSaveEditedBill(updatedBill);
    onClose();
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete invoice ${bill.invoiceNumber}? Stock will be restored.`
      )
    ) {
      onDeleteBill(bill.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop show" id="edit-bill-modal">
      <div className="modal-dialog modal-xl">
        <div className="modal-header">
          <div className="modal-title">
            <FilePenLine size={18} />
            <span>
              Edit Bill — <span id="edit-bill-invoice-num">{bill.invoiceNumber}</span>
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            id="close-edit-bill-modal-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body edit-bill-modal-body">
          {/* Top: Customer Info & Payment */}
          <div className="edit-bill-top-grid">
            <div className="edit-section-card">
              <h4 className="edit-section-title">
                <User size={16} /> Customer Details
              </h4>
              <div className="form-grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="edit-cust-name">Customer Name</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input
                      type="text"
                      id="edit-cust-name"
                      className="form-input"
                      placeholder="Cash Customer / Guest"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-cust-phone">Mobile Number</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      type="tel"
                      id="edit-cust-phone"
                      className="form-input"
                      placeholder="10-digit mobile"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="edit-section-card">
              <h4 className="edit-section-title">
                <Wallet size={16} /> Payment &amp; Billing
              </h4>
              <div className="form-grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label htmlFor="edit-payment-method">Payment Method</label>
                  <select
                    id="edit-payment-method"
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / QR</option>
                    <option value="Card">Card</option>
                    <option value="Credit">Udhar / Khata</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-bill-date">Bill Date &amp; Time</label>
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <input
                      type="datetime-local"
                      id="edit-bill-date"
                      className="form-input"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Product to Bill */}
          <div className="edit-section-card">
            <h4 className="edit-section-title">
              <PlusCircle size={16} /> Add / Search Product to Bill
            </h4>
            <div className="edit-add-product-row">
              <div className="search-box-wrap" style={{ flex: 1, position: 'relative' }}>
                <Search size={16} />
                <input
                  type="text"
                  id="edit-product-search"
                  className="inventory-search-input"
                  placeholder="Type product name or barcode to add to this bill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchMatches.length > 0 && (
                  <div
                    className="search-suggestions"
                    id="edit-search-suggestions"
                    style={{ display: 'block' }}
                  >
                    {searchMatches.map((p) => (
                      <div
                        key={p.id}
                        className="suggestion-item"
                        onClick={() => handleAddSearchProduct(p)}
                      >
                        <div>
                          <strong>{p.name}</strong>{' '}
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Stock: {p.quantity} {p.unit || 'Pcs'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            color: 'var(--primary)',
                          }}
                        >
                          ₹{p.rate}{' '}
                          <span
                            style={{
                              textDecoration: 'line-through',
                              fontSize: 11,
                              color: 'var(--text-muted)',
                            }}
                          >
                            ₹{p.mrp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="edit-or-divider">or enter manually:</span>
              <input
                type="text"
                id="edit-manual-name"
                className="form-input"
                style={{ width: 200 }}
                placeholder="Product name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <input
                type="number"
                id="edit-manual-mrp"
                className="form-input"
                style={{ width: 100 }}
                placeholder="MRP ₹"
                value={manualMrp}
                onChange={(e) =>
                  setManualMrp(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                }
              />
              <input
                type="number"
                id="edit-manual-rate"
                className="form-input"
                style={{ width: 100 }}
                placeholder="Rate ₹"
                value={manualRate}
                onChange={(e) =>
                  setManualRate(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                }
              />
              <input
                type="number"
                id="edit-manual-qty"
                className="form-input"
                style={{ width: 80 }}
                placeholder="Qty"
                min="1"
                value={manualQty}
                onChange={(e) => setManualQty(parseInt(e.target.value, 10) || 1)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                id="edit-add-manual-item-btn"
                onClick={handleAddManualItem}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="edit-section-card edit-items-section">
            <h4 className="edit-section-title">
              <List size={16} /> Bill Items
              <span className="cart-badge" id="edit-items-count">
                {items.length} items
              </span>
            </h4>
            <div className="table-responsive" style={{ maxHeight: 320 }}>
              <table className="cart-table" id="edit-items-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th>Product Name</th>
                    <th style={{ width: 110 }}>MRP (₹)</th>
                    <th style={{ width: 110 }}>Rate (₹)</th>
                    <th style={{ width: 130, textAlign: 'center' }}>Quantity</th>
                    <th style={{ width: 110, textAlign: 'right' }}>Total (₹)</th>
                    <th style={{ width: 90, textAlign: 'right' }}>Savings</th>
                    <th style={{ width: 46, textAlign: 'center' }}>Del</th>
                  </tr>
                </thead>
                <tbody id="edit-items-tbody">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}
                      >
                        No items in this bill. Add products above.
                      </td>
                    </tr>
                  ) : (
                    items.map((it, idx) => {
                      const itemTotal = it.rate * it.quantity;
                      const itemSavings = (it.mrp - it.rate) * it.quantity;
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                              {it.name}
                            </div>
                            {it.barcode && (
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                {it.barcode}
                              </div>
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              className="mini-number-input"
                              value={it.mrp}
                              min={0}
                              step={0.5}
                              onChange={(e) =>
                                handleUpdateItemPrice(
                                  idx,
                                  'mrp',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="mini-number-input"
                              value={it.rate}
                              min={0}
                              step={0.5}
                              onChange={(e) =>
                                handleUpdateItemPrice(
                                  idx,
                                  'rate',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="qty-control-group" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleChangeItemQty(idx, -1)}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="qty-input"
                                value={it.quantity}
                                min={1}
                                onChange={(e) =>
                                  handleChangeItemQty(
                                    idx,
                                    0,
                                    parseInt(e.target.value, 10) || 1
                                  )
                                }
                              />
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleChangeItemQty(idx, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                            }}
                          >
                            ₹{itemTotal.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              color: 'var(--savings-green, #10b981)',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            ₹{itemSavings.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItem(idx)}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Totals Summary */}
          <div className="edit-totals-row">
            <div className="edit-totals-card">
              <div className="edit-total-line">
                <span>Total MRP</span>
                <span id="edit-total-mrp" className="mono-val">
                  {formatCurrency(totalMrp)}
                </span>
              </div>
              <div className="edit-total-line text-success">
                <span>Store Discount</span>
                <span id="edit-total-discount" className="mono-val">
                  -₹{Math.max(0, storeDiscount).toFixed(2)}
                </span>
              </div>
              <div className="edit-total-line">
                <span>Extra Discount</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <select
                    id="edit-extra-disc-type"
                    className="form-select-sm"
                    style={{ width: 58 }}
                    value={extraDiscountType}
                    onChange={(e) => setExtraDiscountType(e.target.value as 'rs' | 'pct')}
                  >
                    <option value="rs">₹</option>
                    <option value="pct">%</option>
                  </select>
                  <input
                    type="number"
                    id="edit-extra-disc-val"
                    value={extraDiscountVal}
                    min="0"
                    className="mini-number-input"
                    onChange={(e) => setExtraDiscountVal(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="edit-total-line">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <input
                    type="checkbox"
                    id="edit-gst-enable"
                    checked={isGst}
                    onChange={(e) => setIsGst(e.target.checked)}
                  />{' '}
                  GST (5%)
                </label>
                <span id="edit-gst-val" className="mono-val">
                  {formatCurrency(gstAmount)}
                </span>
              </div>
              <div className="edit-total-divider"></div>
              <div className="edit-total-line edit-grand-total-row">
                <span>GRAND TOTAL</span>
                <span id="edit-grand-total" className="edit-grand-total-val">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="edit-savings-row">
                <Sparkles size={16} />
                Customer saves:{' '}
                <strong id="edit-cust-savings">
                  {formatCurrency(Math.max(0, totalCustomerSavings))}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-outline-danger"
            id="delete-bill-btn"
            onClick={handleDelete}
          >
            <Trash2 size={16} /> Delete Bill
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              id="cancel-edit-bill-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success btn-lg"
              id="save-edit-bill-btn"
              onClick={handleSave}
            >
              <Save size={18} /> Save Changes &amp; Update Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
