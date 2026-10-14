import React, { useState } from 'react';
import { Receipt, Search, FileSpreadsheet, Edit, Printer, Send } from 'lucide-react';
import { Bill } from '../../types';
import { formatCurrency, formatDateTime, downloadFile } from '../../utils/storage';

interface HistoryViewProps {
  bills: Bill[];
  onOpenEditBill: (bill: Bill) => void;
  onViewReceipt: (bill: Bill) => void;
  onShareWhatsApp: (bill: Bill) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  bills,
  onOpenEditBill,
  onViewReceipt,
  onShareWhatsApp,
}) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredBills = bills.filter((b) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        b.invoiceNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        (b.customerPhone && b.customerPhone.includes(q));
      if (!match) return false;
    }

    if (dateFilter && !b.createdAt.startsWith(dateFilter)) {
      return false;
    }

    if (paymentFilter !== 'all' && b.paymentMethod !== paymentFilter) {
      return false;
    }

    return true;
  });

  const handleExportCsv = () => {
    if (bills.length === 0) return;
    let csv =
      'Invoice Number,Date Time,Customer Name,Customer Phone,Items Count,Total MRP,Store Discount,Grand Total,Customer Savings,Payment Method\n';
    bills.forEach((b) => {
      const row = [
        `"${b.invoiceNumber}"`,
        `"${b.createdAt}"`,
        `"${(b.customerName || '').replace(/"/g, '""')}"`,
        `"${b.customerPhone || ''}"`,
        b.items.length,
        b.totalMrp,
        b.storeDiscount,
        b.grandTotal,
        b.totalCustomerSavings,
        `"${b.paymentMethod}"`,
      ];
      csv += row.join(',') + '\n';
    });

    downloadFile(
      csv,
      `Super_Bachat_Bazzar_Sales_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv'
    );
  };

  return (
    <section id="view-history" className="view-section active">
      <div className="history-layout">
        <div className="history-header-card">
          <div className="history-title-group">
            <h2 className="card-title">
              <Receipt size={20} />
              Sales &amp; Invoice History
            </h2>
            <p className="card-desc">
              All past created bills, customer details, print thermal receipts, or share bills on
              WhatsApp.
            </p>
          </div>

          <div className="history-search-row">
            <div className="search-box-wrap" style={{ flex: 1 }}>
              <Search size={16} />
              <input
                type="text"
                id="history-search-input"
                className="inventory-search-input"
                placeholder="Search by Bill No. (e.g. SBB-0001), Customer Name, or Phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <input
              type="date"
              id="history-date-filter"
              className="form-input-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <select
              id="history-payment-filter"
              className="form-select-sm"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI / QR</option>
              <option value="Card">Card</option>
              <option value="Credit">Khata / Udhar</option>
            </select>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              id="export-sales-csv-btn"
              onClick={handleExportCsv}
            >
              <FileSpreadsheet size={16} /> Export Sales
            </button>
          </div>
        </div>

        <div className="history-table-card">
          <div className="table-responsive">
            <table className="data-table" id="history-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Date &amp; Time</th>
                  <th>Customer Details</th>
                  <th>Items Count</th>
                  <th>Total MRP</th>
                  <th>Bachat Savings</th>
                  <th>Grand Total (₹)</th>
                  <th>Payment Mode</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody id="history-table-body">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}
                    >
                      No sales bills found.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => {
                    const totalQty = bill.items.reduce((s, i) => s + i.quantity, 0);
                    return (
                      <tr key={bill.id}>
                        <td>
                          <span className="invoice-badge">{bill.invoiceNumber}</span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {formatDateTime(bill.createdAt)}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {bill.customerName}
                          </div>
                          {bill.customerPhone && (
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                              📞 {bill.customerPhone}
                            </div>
                          )}
                        </td>
                        <td>
                          {bill.items.length} items ({totalQty} units)
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                          {formatCurrency(bill.totalMrp)}
                        </td>
                        <td>
                          <span className="item-savings-pill font-bold">
                            Saved ₹{bill.totalCustomerSavings.toFixed(2)}
                          </span>
                        </td>
                        <td
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            fontSize: 14.5,
                            color: 'var(--primary)',
                          }}
                        >
                          {formatCurrency(bill.grandTotal)}
                        </td>
                        <td>
                          <span className={`pay-badge ${bill.paymentMethod}`}>
                            {bill.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Edit Bill"
                              style={{ color: 'var(--primary)' }}
                              onClick={() => onOpenEditBill(bill)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="View &amp; Print Invoice"
                              onClick={() => onViewReceipt(bill)}
                            >
                              <Printer size={16} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Share WhatsApp"
                              onClick={() => onShareWhatsApp(bill)}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
