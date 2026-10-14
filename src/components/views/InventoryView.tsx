import React, { useState, useEffect } from 'react';
import {
  PackagePlus,
  Tag,
  Barcode,
  Camera,
  RefreshCw,
  Calendar,
  Layers,
  IndianRupee,
  BadgePercent,
  TrendingDown,
  MapPin,
  PlusCircle,
  RotateCcw,
  Search,
  Printer,
  Download,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Product } from '../../types';
import {
  generateEAN13Barcode,
  formatCurrency,
  formatDateTime,
  downloadFile,
} from '../../utils/storage';

interface InventoryViewProps {
  products: Product[];
  onSaveProduct: (productData: Partial<Product>, isEditingId?: string) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenCamScanner: () => void;
  onOpenBarcodeStickers: () => void;
  scannedBarcode?: string;
  onClearScannedBarcode?: () => void;
}

const CATEGORIES = [
  'Groceries & Staples',
  'Dairy & Bakery',
  'Snacks & Beverages',
  'Personal Care',
  'Household & Cleaning',
  'Spices & Masalas',
  'Biscuits & Confectionery',
  'General Store Items',
];

const UNITS = ['Pcs', 'Packets', 'Kg', 'Grams', 'Litre', 'ML', 'Box'];

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onOpenCamScanner,
  onOpenBarcodeStickers,
  scannedBarcode,
  onClearScannedBarcode,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [barcode, setBarcode] = useState('');
  const [inwardDateTime, setInwardDateTime] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState(UNITS[0]);
  const [mrp, setMrp] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [shelf, setShelf] = useState('');

  // Table filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');

  const setNowDateTime = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    setInwardDateTime(
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}`
    );
  };

  useEffect(() => {
    if (!editingId && !inwardDateTime) {
      setNowDateTime();
    }
  }, [editingId, inwardDateTime]);

  useEffect(() => {
    if (scannedBarcode) {
      setBarcode(scannedBarcode);
      onClearScannedBarcode?.();
    }
  }, [scannedBarcode, onClearScannedBarcode]);

  const handleAutoBarcode = () => {
    const code = generateEAN13Barcode();
    setBarcode(code);
  };

  const handleReset = () => {
    setEditingId(null);
    setName('');
    setCategory(CATEGORIES[0]);
    setBarcode('');
    setQuantity('');
    setUnit(UNITS[0]);
    setMrp('');
    setRate('');
    setCostPrice('');
    setShelf('');
    setNowDateTime();
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setBarcode(p.barcode);
    setInwardDateTime(p.inwardDateTime || '');
    setQuantity(p.quantity);
    setUnit(p.unit || 'Pcs');
    setMrp(p.mrp);
    setRate(p.rate);
    setCostPrice(p.costPrice || '');
    setShelf(p.shelf || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !barcode.trim() || mrp === '' || rate === '') {
      return;
    }

    onSaveProduct(
      {
        name: name.trim(),
        category,
        barcode: barcode.trim(),
        inwardDateTime,
        quantity: typeof quantity === 'number' ? quantity : 0,
        unit,
        mrp: Number(mrp) || 0,
        rate: Number(rate) || 0,
        costPrice: typeof costPrice === 'number' ? costPrice : undefined,
        shelf: shelf.trim() || undefined,
      },
      editingId || undefined
    );

    handleReset();
  };

  const handleExportCsv = () => {
    if (products.length === 0) return;
    let csv =
      'Barcode,Product Name,Category,Inward Date Time,Stock Quantity,Unit,MRP,Our Rate,Cost Price,Shelf\n';
    products.forEach((p) => {
      const row = [
        `"${p.barcode}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.inwardDateTime || ''}"`,
        p.quantity,
        `"${p.unit || ''}"`,
        p.mrp,
        p.rate,
        p.costPrice || 0,
        `"${p.shelf || ''}"`,
      ];
      csv += row.join(',') + '\n';
    });

    downloadFile(
      csv,
      `Super_Bachat_Bazzar_Inventory_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv'
    );
  };

  // Savings preview
  const numMrp = Number(mrp) || 0;
  const numRate = Number(rate) || 0;
  const diffSavings = numMrp - numRate;
  const pctSavings = numMrp > 0 ? ((diffSavings / numMrp) * 100).toFixed(1) : '0';

  // Filter products list
  const filteredProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shelf && p.shelf.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterCategory !== 'all' && p.category !== filterCategory) {
      return false;
    }

    if (filterStock === 'low' && !(p.quantity > 0 && p.quantity < 10)) {
      return false;
    }
    if (filterStock === 'out' && p.quantity > 0) {
      return false;
    }
    if (filterStock === 'available' && p.quantity <= 0) {
      return false;
    }

    return true;
  });

  return (
    <section id="view-inventory" className="view-section active">
      <div className="inventory-layout">
        {/* Inward Stock Form Card */}
        <div className="inward-form-card">
          <div className="card-header-with-badge">
            <div className="header-text">
              <h2 className="card-title">
                <PackagePlus size={20} />
                Inward Stock Entry (Add Products to Store)
              </h2>
              <p className="card-desc">
                Add newly purchased stock with barcode, inward date &amp; time, quantities, MRP, and
                store selling rate.
              </p>
            </div>
            <span className="mode-pill" id="inward-form-mode">
              {editingId ? 'Editing Product Stock' : 'New Stock Inward'}
            </span>
          </div>

          <form id="inward-stock-form" className="inward-form" onSubmit={handleSubmit}>
            <div className="form-grid-3">
              {/* Product Name */}
              <div className="form-group span-2">
                <label htmlFor="prod-name" className="required">
                  Product Name &amp; Variant
                </label>
                <div className="input-with-icon">
                  <Tag size={16} />
                  <input
                    type="text"
                    id="prod-name"
                    className="form-input"
                    placeholder="e.g. Fortune Sunflower Oil (1 Litre Pouch)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="prod-category" className="required">
                  Category
                </label>
                <select
                  id="prod-category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              {/* Barcode Field with Generate & Camera Scan Buttons */}
              <div className="form-group span-2">
                <label htmlFor="prod-barcode" className="required">
                  Product Barcode (EAN-13 / Code-128)
                </label>
                <div className="barcode-input-group">
                  <div className="input-with-icon" style={{ flex: 1 }}>
                    <Barcode size={16} />
                    <input
                      type="text"
                      id="prod-barcode"
                      className="form-input"
                      placeholder="Scan or enter barcode number..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    id="inward-scan-cam-btn"
                    title="Scan Barcode via Camera"
                    onClick={onOpenCamScanner}
                  >
                    <Camera size={14} /> Scan
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    id="inward-gen-barcode-btn"
                    title="Generate New Barcode"
                    onClick={handleAutoBarcode}
                  >
                    <RefreshCw size={14} /> Auto Barcode
                  </button>
                </div>
              </div>

              {/* Date and Time of Inward Purchase */}
              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="prod-inward-datetime" className="required">
                    Stock Purchase Date &amp; Time
                  </label>
                  <button
                    type="button"
                    className="link-btn"
                    id="set-now-datetime-btn"
                    onClick={setNowDateTime}
                  >
                    Set Now
                  </button>
                </div>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input
                    type="datetime-local"
                    id="prod-inward-datetime"
                    className="form-input"
                    value={inwardDateTime}
                    onChange={(e) => setInwardDateTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-4">
              {/* Stock Quantity */}
              <div className="form-group">
                <label htmlFor="prod-quantity" className="required">
                  Stock Quantity
                </label>
                <div className="input-with-icon">
                  <Layers size={16} />
                  <input
                    type="number"
                    id="prod-quantity"
                    className="form-input"
                    placeholder="e.g. 50"
                    min="0"
                    step="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)
                    }
                    required
                  />
                </div>
              </div>

              {/* Unit */}
              <div className="form-group">
                <label htmlFor="prod-unit" className="required">
                  Unit
                </label>
                <select
                  id="prod-unit"
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* MRP */}
              <div className="form-group">
                <label htmlFor="prod-mrp" className="required">
                  MRP (₹)
                </label>
                <div className="input-with-icon">
                  <IndianRupee size={16} />
                  <input
                    type="number"
                    id="prod-mrp"
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.5"
                    value={mrp}
                    onChange={(e) =>
                      setMrp(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                    required
                  />
                </div>
              </div>

              {/* Selling Rate */}
              <div className="form-group">
                <label htmlFor="prod-rate" className="required">
                  Our Bachat Rate (₹)
                </label>
                <div className="input-with-icon">
                  <BadgePercent size={16} />
                  <input
                    type="number"
                    id="prod-rate"
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.5"
                    value={rate}
                    onChange={(e) =>
                      setRate(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-3">
              {/* Purchase Cost Price (Optional) */}
              <div className="form-group">
                <label htmlFor="prod-cost-price">
                  Purchase Cost Rate (₹) <span className="optional-tag">Optional</span>
                </label>
                <div className="input-with-icon">
                  <TrendingDown size={16} />
                  <input
                    type="number"
                    id="prod-cost-price"
                    className="form-input"
                    placeholder="Store cost price"
                    min="0"
                    step="0.5"
                    value={costPrice}
                    onChange={(e) =>
                      setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Shelf / Rack Location */}
              <div className="form-group">
                <label htmlFor="prod-shelf">
                  Shelf / Rack Location <span className="optional-tag">Optional</span>
                </label>
                <div className="input-with-icon">
                  <MapPin size={16} />
                  <input
                    type="text"
                    id="prod-shelf"
                    className="form-input"
                    placeholder="e.g. Rack A-2"
                    value={shelf}
                    onChange={(e) => setShelf(e.target.value)}
                  />
                </div>
              </div>

              {/* Customer Savings preview */}
              <div className="form-group">
                <label>Customer Savings Preview</label>
                <div className="margin-preview-box" id="inward-savings-preview">
                  {diffSavings >= 0 ? (
                    <span className="preview-badge text-success">
                      Save: ₹{diffSavings.toFixed(2)} ({pctSavings}%)
                    </span>
                  ) : (
                    <span className="preview-badge" style={{ color: 'var(--danger)' }}>
                      Rate higher than MRP!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions-row">
              <button type="submit" className="btn btn-success btn-md" id="save-product-btn">
                <PlusCircle size={18} />
                <span id="save-btn-text">
                  {editingId ? 'Update Product Stock' : 'Save Inward Product Stock'}
                </span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-md"
                id="reset-inward-form-btn"
                onClick={handleReset}
              >
                <RotateCcw size={18} />
                <span>Reset Form</span>
              </button>
            </div>
          </form>
        </div>

        {/* Inventory Table Card */}
        <div className="inventory-table-card">
          <div className="inventory-toolbar">
            <div className="search-box-wrap">
              <Search size={16} />
              <input
                type="text"
                id="inventory-search-input"
                className="inventory-search-input"
                placeholder="Search by product name, barcode, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                id="inventory-category-filter"
                className="form-select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                id="inventory-stock-filter"
                className="form-select-sm"
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
              >
                <option value="all">All Stock Status</option>
                <option value="low">Low Stock (&lt; 10)</option>
                <option value="out">Out of Stock (0)</option>
                <option value="available">Available Stock</option>
              </select>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                id="print-all-barcodes-btn"
                onClick={onOpenBarcodeStickers}
              >
                <Printer size={16} /> Print Barcode Tags
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                id="export-inventory-csv-btn"
                onClick={handleExportCsv}
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table" id="inventory-table">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Inward Date &amp; Time</th>
                  <th>Stock Qty</th>
                  <th>MRP (₹)</th>
                  <th>Our Rate (₹)</th>
                  <th>Savings</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody id="inventory-table-body">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}
                    >
                      No products found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const savings = Math.max(0, p.mrp - p.rate);
                    const savingsPct = p.mrp > 0 ? ((savings / p.mrp) * 100).toFixed(0) : 0;
                    let stockBadgeClass = 'in-stock';
                    if (p.quantity <= 0) stockBadgeClass = 'out-of-stock';
                    else if (p.quantity < 10) stockBadgeClass = 'low-stock';

                    return (
                      <tr key={p.id}>
                        <td>
                          <span className="barcode-badge">{p.barcode}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</div>
                          {p.shelf && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              📍 {p.shelf}
                            </div>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {p.category}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {formatDateTime(p.inwardDateTime)}
                          </span>
                        </td>
                        <td>
                          <span className={`stock-badge ${stockBadgeClass}`}>
                            {p.quantity} {p.unit}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(p.mrp)}</td>
                        <td
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            color: 'var(--primary)',
                          }}
                        >
                          {formatCurrency(p.rate)}
                        </td>
                        <td>
                          <span className="item-savings-pill">
                            Save ₹{savings.toFixed(2)} ({savingsPct}%)
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="action-icon-btn"
                              title="Edit Product"
                              onClick={() => handleEditClick(p)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn delete"
                              title="Delete Product"
                              onClick={() => onDeleteProduct(p.id)}
                            >
                              <Trash2 size={16} />
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
