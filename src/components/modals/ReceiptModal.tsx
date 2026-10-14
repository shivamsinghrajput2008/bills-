import React, { useState, useEffect, useRef } from 'react';
import { Printer, X, Send, PlusCircle } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { Bill } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/storage';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onNewSale: () => void;
  onShareWhatsApp: (bill: Bill) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  bill,
  onNewSale,
  onShareWhatsApp,
}) => {
  const [format, setFormat] = useState<'thermal' | 'a4'>('thermal');
  const barcodeSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isOpen || !bill || !barcodeSvgRef.current) return;
    try {
      JsBarcode(barcodeSvgRef.current, bill.invoiceNumber, {
        format: 'CODE128',
        lineColor: '#000000',
        width: 1.5,
        height: 35,
        displayValue: true,
        fontSize: 11,
      });
    } catch (e) {
      console.warn('Receipt barcode render error:', e);
    }
  }, [isOpen, bill]);

  if (!isOpen || !bill) return null;

  const totalQty = bill.items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop show" id="receipt-modal">
      <div className="modal-dialog modal-lg">
        <div className="modal-header">
          <div className="modal-title">
            <Printer size={18} />
            <span>Bill Generated Successfully</span>
          </div>
          <div className="receipt-header-actions">
            <div className="receipt-format-toggle">
              <button
                type="button"
                className={`format-btn ${format === 'thermal' ? 'active' : ''}`}
                id="format-thermal-btn"
                onClick={() => setFormat('thermal')}
              >
                Thermal Slip (80mm)
              </button>
              <button
                type="button"
                className={`format-btn ${format === 'a4' ? 'active' : ''}`}
                id="format-a4-btn"
                onClick={() => setFormat('a4')}
              >
                Standard A4/A5
              </button>
            </div>
            <button
              type="button"
              className="modal-close-btn"
              id="close-receipt-modal-btn"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body receipt-modal-body">
          {/* PRINTABLE INVOICE CONTENT */}
          <div
            className={`printable-receipt-wrapper ${format === 'a4' ? 'format-a4' : ''}`}
            id="printable-receipt"
          >
            {/* Store Header */}
            <div className="receipt-header">
              <h1 className="receipt-store-name">{bill.storeName || 'SUPER BACHAT BAZZAR'}</h1>
              <p className="receipt-store-address">
                {bill.storeAddress || 'attardah kachhi pakki , muzzafarpur'}
              </p>
              <p className="receipt-store-contact" id="receipt-contact-line">
                Mob: {bill.storePhone || '+91 98765 43210'}
              </p>
              <div className="receipt-type-pill">RETAIL TAX INVOICE / CASH MEMO</div>
            </div>

            <div className="receipt-meta-grid">
              <div>
                <span className="meta-lbl">Bill No:</span>{' '}
                <strong id="receipt-bill-no">{bill.invoiceNumber}</strong>
              </div>
              <div className="text-right">
                <span className="meta-lbl">Date:</span>{' '}
                <span id="receipt-datetime">{formatDateTime(bill.createdAt)}</span>
              </div>
              <div>
                <span className="meta-lbl">Customer:</span>{' '}
                <span id="receipt-customer-name">{bill.customerName || 'Cash Customer'}</span>
              </div>
              <div className="text-right">
                <span className="meta-lbl">Phone:</span>{' '}
                <span id="receipt-customer-phone">{bill.customerPhone || '-'}</span>
              </div>
            </div>

            <div className="receipt-divider"></div>

            {/* Items Table */}
            <table className="receipt-items-table">
              <thead>
                <tr>
                  <th style={{ width: 25 }}>#</th>
                  <th>Item Description</th>
                  <th className="text-right" style={{ width: 50 }}>
                    Qty
                  </th>
                  <th className="text-right" style={{ width: 60 }}>
                    MRP
                  </th>
                  <th className="text-right" style={{ width: 65 }}>
                    Rate
                  </th>
                  <th className="text-right" style={{ width: 75 }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody id="receipt-items-body">
                {bill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="receipt-item-title">{item.name}</div>
                      <div className="receipt-item-savings-sub">
                        Save ₹{item.savings.toFixed(2)}
                      </div>
                    </td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{item.mrp.toFixed(2)}</td>
                    <td className="text-right font-bold">{item.rate.toFixed(2)}</td>
                    <td className="text-right font-bold">{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="receipt-divider"></div>

            {/* Calculation Totals */}
            <div className="receipt-totals-table">
              <div className="receipt-total-row">
                <span>Total Items / Qty:</span>
                <span id="receipt-total-items-qty">
                  {bill.items.length} items / {totalQty} units
                </span>
              </div>
              <div className="receipt-total-row">
                <span>Total MRP Value:</span>
                <span id="receipt-total-mrp">{formatCurrency(bill.totalMrp)}</span>
              </div>
              <div className="receipt-total-row text-success font-bold">
                <span>Super Bachat Store Discount:</span>
                <span id="receipt-discount-saved">-{formatCurrency(bill.storeDiscount)}</span>
              </div>

              {bill.extraDiscount > 0 && (
                <div className="receipt-total-row" id="receipt-extra-disc-row">
                  <span>Special Extra Discount:</span>
                  <span id="receipt-extra-disc-val">-{formatCurrency(bill.extraDiscount)}</span>
                </div>
              )}

              {bill.gstAmount > 0 && (
                <div className="receipt-total-row" id="receipt-tax-row">
                  <span>GST (5%):</span>
                  <span id="receipt-tax-val">{formatCurrency(bill.gstAmount)}</span>
                </div>
              )}

              <div className="receipt-divider double"></div>

              <div className="receipt-total-row grand-total">
                <span>NET PAYABLE AMOUNT:</span>
                <span id="receipt-grand-total">{formatCurrency(bill.grandTotal)}</span>
              </div>

              <div className="receipt-total-row payment-info">
                <span>
                  Payment Mode: <strong id="receipt-payment-mode">{bill.paymentMethod}</strong>
                </span>
                <span id="receipt-payment-meta">Paid in Full</span>
              </div>
            </div>

            {/* Highlight Savings Banner on Bill */}
            <div className="receipt-savings-box">
              <span>
                🎉 YOU SAVED A TOTAL OF{' '}
                <strong id="receipt-saved-highlight">
                  {formatCurrency(bill.totalCustomerSavings)}
                </strong>{' '}
                ON THIS BILL! 🎉
              </span>
            </div>

            {/* Store Footer Customer Wishes */}
            <div className="receipt-footer">
              <p className="wishes-line" id="receipt-wishes-text">
                {bill.wishes ||
                  '🙏 Thank you for shopping with us! Visit again. Save More with Super Bachat Bazzar! 🙏'}
              </p>
              <p className="footer-policy">
                Goods once sold can be exchanged within 3 days with this original bill.
              </p>
              <p className="footer-blessing">✨ Super Bachat, Super Khushiyan! ✨</p>

              {/* Printed Barcode for Return / Scan Verification */}
              <div className="receipt-barcode-wrap" style={{ textAlign: 'center', marginTop: 12 }}>
                <svg ref={barcodeSvgRef} id="receipt-barcode-svg"></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer receipt-actions">
          <button
            type="button"
            className="btn btn-success btn-lg"
            id="print-bill-btn"
            onClick={handlePrint}
          >
            <Printer size={18} />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            className="btn btn-whatsapp btn-lg"
            id="whatsapp-bill-btn"
            onClick={() => onShareWhatsApp(bill)}
          >
            <Send size={18} />
            <span>Share WhatsApp</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            id="new-sale-btn"
            onClick={onNewSale}
          >
            <PlusCircle size={18} />
            <span>New Sale (F2)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
