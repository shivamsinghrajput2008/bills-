import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  TabId,
  Product,
  CartItem,
  Bill,
  StoreSettings,
  PaymentMethod,
  ToastMessage,
} from './types';
import {
  loadStoredProducts,
  saveStoredProducts,
  loadStoredBills,
  saveStoredBills,
  loadStoredSettings,
  saveStoredSettings,
  getStoredInvoiceSeq,
  saveStoredInvoiceSeq,
  isTerminalUnlocked,
  lockTerminalState,
  STORAGE_KEYS,
  formatCurrency,
  formatDateTime,
  SAMPLE_PRODUCTS,
} from './utils/storage';
import { playSound } from './utils/audio';

import { Header } from './components/Header';
import { ShortcutBar } from './components/ShortcutBar';
import { LockScreen } from './components/LockScreen';
import { Toast } from './components/Toast';

import { POSView } from './components/views/POSView';
import { InventoryView } from './components/views/InventoryView';
import { HistoryView } from './components/views/HistoryView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

import { CameraScannerModal } from './components/modals/CameraScannerModal';
import { UpiQrModal } from './components/modals/UpiQrModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { BarcodeStickersModal } from './components/modals/BarcodeStickersModal';
import { EditBillModal } from './components/modals/EditBillModal';

export const App: React.FC = () => {
  // App-level state
  const [activeTab, setActiveTab] = useState<TabId>('pos');
  const [isLocked, setIsLocked] = useState<boolean>(!isTerminalUnlocked());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false'
  );
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light'
  );

  const [products, setProducts] = useState<Product[]>(loadStoredProducts);
  const [bills, setBills] = useState<Bill[]>(loadStoredBills);
  const [settings, setSettings] = useState<StoreSettings>(loadStoredSettings);
  const [invoiceSeq, setInvoiceSeq] = useState<number>(getStoredInvoiceSeq);

  // Cart & POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [extraDiscountType, setExtraDiscountType] = useState<'rs' | 'pct'>('rs');
  const [extraDiscountVal, setExtraDiscountVal] = useState<number>(0);
  const [includeGst, setIncludeGst] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  // Modals
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [cameraScannerContext, setCameraScannerContext] = useState<'pos' | 'inward'>('pos');
  const [scannedInwardBarcode, setScannedInwardBarcode] = useState<string>('');

  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceiptBill, setCurrentReceiptBill] = useState<Bill | null>(null);

  const [isBarcodeStickersOpen, setIsBarcodeStickersOpen] = useState(false);

  const [isEditBillOpen, setIsEditBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Theme synchronization
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Lock body class
  useEffect(() => {
    if (isLocked) {
      document.body.classList.add('terminal-locked');
    } else {
      document.body.classList.remove('terminal-locked');
    }
  }, [isLocked]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SOUND, String(next));
      showToast(next ? 'Sound effects enabled 🔔' : 'Sound effects muted 🔕', 'info');
      return next;
    });
  };

  const handleLockTerminal = () => {
    lockTerminalState();
    setIsLocked(true);
    showToast('POS Terminal locked.', 'info');
  };

  // Next Invoice number helper
  const nextInvoiceNumber = `SBB-${String(invoiceSeq).padStart(4, '0')}`;

  // Cart operations
  const handleAddToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prev, { product: { ...product }, quantity: 1 }];
        }
      });
      playSound('add', soundEnabled);
      showToast(`Added ${product.name.substring(0, 24)}...`, 'success');
    },
    [soundEnabled, showToast]
  );

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleSetCartQty = (productId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      );
    });
  };

  const handleSetCartRate = (productId: string, newRate: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, rate: newRate } }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to clear the entire cart?')) {
      setCart([]);
      showToast('Cart cleared', 'info');
    }
  };

  const handleHoldCart = () => {
    if (cart.length === 0) {
      showToast('Cart is already empty', 'error');
      return;
    }
    showToast('Cart on hold for next customer', 'info');
    setCart([]);
  };

  // Bill creation calculations
  const calculateCartTotals = useCallback(() => {
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
    const totalCustomerSavings = Math.max(0, totalMrp - grandTotal);

    return {
      totalMrp,
      storeDiscount,
      extraDiscount,
      gstAmount,
      grandTotal,
      totalCustomerSavings,
    };
  }, [cart, extraDiscountType, extraDiscountVal, includeGst]);

  const finalizeBillCreation = useCallback(
    (triggerPrint: boolean = true) => {
      const totals = calculateCartTotals();
      const currentInvoiceNum = nextInvoiceNumber;
      const nowIso = new Date().toISOString();

      // Deduct inventory stock
      const updatedProducts = products.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            quantity: Math.max(0, prod.quantity - cartMatch.quantity),
          };
        }
        return prod;
      });
      setProducts(updatedProducts);
      saveStoredProducts(updatedProducts);

      // Create new bill
      const newBill: Bill = {
        id: 'bill-' + Date.now(),
        invoiceNumber: currentInvoiceNum,
        createdAt: nowIso,
        customerName: customerName.trim() || 'Cash Customer',
        customerPhone: customerPhone.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          barcode: item.product.barcode,
          unit: item.product.unit,
          mrp: item.product.mrp,
          rate: item.product.rate,
          quantity: item.quantity,
          total: item.product.rate * item.quantity,
          savings: (item.product.mrp - item.product.rate) * item.quantity,
        })),
        totalMrp: totals.totalMrp,
        storeDiscount: totals.storeDiscount,
        extraDiscount: totals.extraDiscount,
        extraDiscountType,
        extraDiscountValue: extraDiscountVal,
        isGstEnabled: includeGst,
        gstAmount: totals.gstAmount,
        grandTotal: totals.grandTotal,
        totalCustomerSavings: totals.totalCustomerSavings,
        paymentMethod,
        wishes: settings.storeWishes,
        storeName: settings.storeName,
        storeAddress: settings.storeAddress,
        storePhone: settings.storePhone,
      };

      const updatedBills = [newBill, ...bills];
      setBills(updatedBills);
      saveStoredBills(updatedBills);

      const nextSeq = invoiceSeq + 1;
      setInvoiceSeq(nextSeq);
      saveStoredInvoiceSeq(nextSeq);

      // Sound & Confetti celebration
      playSound('success', soundEnabled);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti safe ignore
      }

      showToast(
        `Bill ${currentInvoiceNum} created successfully! Total: ${formatCurrency(
          totals.grandTotal
        )}`,
        'success'
      );

      setCurrentReceiptBill(newBill);
      setIsReceiptModalOpen(true);

      if (triggerPrint) {
        // Receipt modal displays print button & window.print
      }
    },
    [
      calculateCartTotals,
      nextInvoiceNumber,
      products,
      cart,
      customerName,
      customerPhone,
      extraDiscountType,
      extraDiscountVal,
      includeGst,
      paymentMethod,
      settings,
      bills,
      invoiceSeq,
      soundEnabled,
      showToast,
    ]
  );

  const handleCheckout = (triggerPrint: boolean = true) => {
    if (cart.length === 0) {
      playSound('error', soundEnabled);
      showToast('Cannot checkout: Cart is empty!', 'error');
      return;
    }

    if (paymentMethod === 'UPI') {
      setIsUpiModalOpen(true);
      return;
    }

    finalizeBillCreation(triggerPrint);
  };

  const handleUpiPaidConfirm = () => {
    setIsUpiModalOpen(false);
    finalizeBillCreation(true);
  };

  const handleNewSale = () => {
    setIsReceiptModalOpen(false);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setExtraDiscountVal(0);
    setIncludeGst(false);
    setPaymentMethod('Cash');
    setActiveTab('pos');
  };

  const handleShareWhatsApp = (bill: Bill) => {
    let phone = bill.customerPhone ? bill.customerPhone.replace(/\D/g, '') : '';
    if (phone.length === 10) phone = '91' + phone;

    let message = `*🧾 INVOICE - ${(bill.storeName || settings.storeName).toUpperCase()}*\n`;
    message += `📍 _${bill.storeAddress || settings.storeAddress}_\n`;
    message += `--------------------------------\n`;
    message += `*Bill No:* ${bill.invoiceNumber}\n`;
    message += `*Date:* ${formatDateTime(bill.createdAt)}\n`;
    message += `*Customer:* ${bill.customerName}\n`;
    message += `--------------------------------\n`;
    message += `*ITEMS PURCHASED:*\n`;

    bill.items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} x ${item.quantity} = ₹${item.total.toFixed(2)} (MRP ₹${item.mrp})\n`;
    });

    message += `--------------------------------\n`;
    message += `*Total MRP:* ₹${bill.totalMrp.toFixed(2)}\n`;
    message += `*Store Bachat:* -₹${bill.storeDiscount.toFixed(2)}\n`;
    if (bill.extraDiscount > 0) {
      message += `*Special Extra Discount:* -₹${bill.extraDiscount.toFixed(2)}\n`;
    }
    if (bill.gstAmount > 0) {
      message += `*GST (5%):* +₹${bill.gstAmount.toFixed(2)}\n`;
    }
    message += `*Grand Total Paid:* ₹${bill.grandTotal.toFixed(2)} (${bill.paymentMethod})\n`;
    message += `*🎉 YOU SAVED: ₹${bill.totalCustomerSavings.toFixed(2)}!*\n`;
    message += `--------------------------------\n`;
    message += `${bill.wishes || settings.storeWishes}\n`;

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  };

  // Inventory Save
  const handleSaveProduct = (productData: Partial<Product>, isEditingId?: string) => {
    if (isEditingId) {
      const updated = products.map((p) =>
        p.id === isEditingId ? ({ ...p, ...productData } as Product) : p
      );
      setProducts(updated);
      saveStoredProducts(updated);
      showToast('Product updated successfully!', 'success');
      playSound('add', soundEnabled);
    } else {
      // Check duplicate barcode
      const existing = products.find((p) => p.barcode === productData.barcode);
      if (existing) {
        if (
          confirm(
            `A product with barcode "${productData.barcode}" already exists (${existing.name}). Do you want to add ${productData.quantity} units to its stock instead?`
          )
        ) {
          const updated = products.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  quantity: p.quantity + (productData.quantity || 0),
                  inwardDateTime: productData.inwardDateTime || p.inwardDateTime,
                  mrp: productData.mrp || p.mrp,
                  rate: productData.rate || p.rate,
                }
              : p
          );
          setProducts(updated);
          saveStoredProducts(updated);
          showToast(`Updated stock for ${existing.name}!`, 'success');
          playSound('add', soundEnabled);
          return;
        }
      }

      const newProduct: Product = {
        id: 'sbb-p-' + Date.now(),
        name: productData.name || '',
        category: productData.category || 'Groceries & Staples',
        barcode: productData.barcode || '',
        inwardDateTime: productData.inwardDateTime || new Date().toISOString(),
        quantity: productData.quantity || 0,
        unit: productData.unit || 'Pcs',
        mrp: productData.mrp || 0,
        rate: productData.rate || 0,
        costPrice: productData.costPrice,
        shelf: productData.shelf,
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      saveStoredProducts(updated);
      showToast(`Added inward stock for "${newProduct.name}"!`, 'success');
      playSound('add', soundEnabled);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    if (confirm(`Are you sure you want to delete "${prod.name}" from store inventory?`)) {
      const updated = products.filter((p) => p.id !== productId);
      setProducts(updated);
      saveStoredProducts(updated);
      showToast(`Deleted product: ${prod.name}`, 'info');
    }
  };

  // Bill editing & reconciliation
  const handleOpenEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsEditBillOpen(true);
  };

  const handleSaveEditedBill = (updatedBill: Bill) => {
    const original = bills.find((b) => b.id === updatedBill.id);
    if (!original) return;

    // 1. Restore original stock
    let tempProducts = [...products];
    original.items.forEach((oldItem) => {
      const pIdx = tempProducts.findIndex((p) => p.id === oldItem.productId);
      if (pIdx !== -1) {
        tempProducts[pIdx] = {
          ...tempProducts[pIdx],
          quantity: tempProducts[pIdx].quantity + oldItem.quantity,
        };
      }
    });

    // 2. Deduct new stock
    updatedBill.items.forEach((newItem) => {
      const pIdx = tempProducts.findIndex((p) => p.id === newItem.productId);
      if (pIdx !== -1) {
        tempProducts[pIdx] = {
          ...tempProducts[pIdx],
          quantity: Math.max(0, tempProducts[pIdx].quantity - newItem.quantity),
        };
      }
    });

    setProducts(tempProducts);
    saveStoredProducts(tempProducts);

    const updatedBills = bills.map((b) => (b.id === updatedBill.id ? updatedBill : b));
    setBills(updatedBills);
    saveStoredBills(updatedBills);

    showToast(`Bill ${updatedBill.invoiceNumber} updated successfully!`, 'success');
    playSound('success', soundEnabled);
  };

  const handleDeleteBill = (billId: string) => {
    const target = bills.find((b) => b.id === billId);
    if (!target) return;

    // Restore stock
    const tempProducts = [...products];
    target.items.forEach((it) => {
      const pIdx = tempProducts.findIndex((p) => p.id === it.productId);
      if (pIdx !== -1) {
        tempProducts[pIdx] = {
          ...tempProducts[pIdx],
          quantity: tempProducts[pIdx].quantity + it.quantity,
        };
      }
    });

    setProducts(tempProducts);
    saveStoredProducts(tempProducts);

    const updatedBills = bills.filter((b) => b.id !== billId);
    setBills(updatedBills);
    saveStoredBills(updatedBills);

    showToast(`Bill ${target.invoiceNumber} deleted and stock restored.`, 'info');
  };

  // Restore & sample data
  const handleRestoreData = (restored: {
    products?: Product[];
    bills?: Bill[];
    settings?: StoreSettings;
    invoiceSeq?: number;
  }) => {
    if (restored.products && Array.isArray(restored.products)) {
      setProducts(restored.products);
      saveStoredProducts(restored.products);
    }
    if (restored.bills && Array.isArray(restored.bills)) {
      setBills(restored.bills);
      saveStoredBills(restored.bills);
    }
    if (restored.settings) {
      setSettings(restored.settings);
      saveStoredSettings(restored.settings);
    }
    if (restored.invoiceSeq) {
      setInvoiceSeq(restored.invoiceSeq);
      saveStoredInvoiceSeq(restored.invoiceSeq);
    }
  };

  const handleResetSampleData = () => {
    setProducts([...SAMPLE_PRODUCTS]);
    saveStoredProducts([...SAMPLE_PRODUCTS]);
  };

  // Camera scanner handling
  const handleOpenCamScanner = (context: 'pos' | 'inward') => {
    setCameraScannerContext(context);
    setIsCameraScannerOpen(true);
  };

  const handleCameraScanSuccess = (code: string) => {
    playSound('scan', soundEnabled);
    if (cameraScannerContext === 'pos') {
      const found = products.find(
        (p) => p.barcode.toLowerCase() === code.toLowerCase() || p.id === code
      );
      if (found) {
        handleAddToCart(found);
      } else {
        showToast(`No product found matching barcode ${code}`, 'error');
      }
    } else {
      setScannedInwardBarcode(code);
      showToast(`Scanned Barcode: ${code}`, 'success');
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('pos');
        document.getElementById('barcode-input')?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('pos');
        document.getElementById('barcode-input')?.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        if (activeTab === 'pos') {
          handleCheckout(true);
        }
      } else if (e.key === 'F9') {
        e.preventDefault();
        handleOpenCamScanner('pos');
      } else if (e.key === 'Escape') {
        setIsCameraScannerOpen(false);
        setIsUpiModalOpen(false);
        setIsReceiptModalOpen(false);
        setIsBarcodeStickersOpen(false);
        setIsEditBillOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, activeTab, handleCheckout]);

  return (
    <>
      {/* POS High-Security Terminal Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlocked={() => setIsLocked(false)}
        soundEnabled={soundEnabled}
        storeName={settings.storeName}
        storeAddress={settings.storeAddress}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} />

      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'pos') {
            setTimeout(() => document.getElementById('barcode-input')?.focus(), 100);
          }
        }}
        productCount={products.length}
        billCount={bills.length}
        storeName={settings.storeName}
        storeAddress={settings.storeAddress}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLockTerminal={handleLockTerminal}
      />

      {/* Quick Shortcut Bar */}
      <ShortcutBar />

      {/* Main Views Container */}
      <main className="main-container">
        {activeTab === 'pos' && (
          <POSView
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onSetCartQty={handleSetCartQty}
            onSetCartRate={handleSetCartRate}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onHoldCart={handleHoldCart}
            nextInvoiceNumber={nextInvoiceNumber}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            extraDiscountType={extraDiscountType}
            setExtraDiscountType={setExtraDiscountType}
            extraDiscountVal={extraDiscountVal}
            setExtraDiscountVal={setExtraDiscountVal}
            includeGst={includeGst}
            setIncludeGst={setIncludeGst}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onCheckout={handleCheckout}
            onOpenCamScanner={() => handleOpenCamScanner('pos')}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenCamScanner={() => handleOpenCamScanner('inward')}
            onOpenBarcodeStickers={() => setIsBarcodeStickersOpen(true)}
            scannedBarcode={scannedInwardBarcode}
            onClearScannedBarcode={() => setScannedInwardBarcode('')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            bills={bills}
            onOpenEditBill={handleOpenEditBill}
            onViewReceipt={(bill) => {
              setCurrentReceiptBill(bill);
              setIsReceiptModalOpen(true);
            }}
            onShareWhatsApp={handleShareWhatsApp}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView bills={bills} products={products} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
            products={products}
            bills={bills}
            onRestoreData={handleRestoreData}
            onResetSampleData={handleResetSampleData}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <CameraScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      <UpiQrModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        onConfirmPaid={handleUpiPaidConfirm}
        amount={calculateCartTotals().grandTotal}
        storeName={settings.storeName}
        storeUpi={settings.storeUpi}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        bill={currentReceiptBill}
        onNewSale={handleNewSale}
        onShareWhatsApp={handleShareWhatsApp}
      />

      <BarcodeStickersModal
        isOpen={isBarcodeStickersOpen}
        onClose={() => setIsBarcodeStickersOpen(false)}
        products={products}
      />

      <EditBillModal
        isOpen={isEditBillOpen}
        onClose={() => {
          setIsEditBillOpen(false);
          setEditingBill(null);
        }}
        bill={editingBill}
        products={products}
        onSaveEditedBill={handleSaveEditedBill}
        onDeleteBill={handleDeleteBill}
        onShowToast={showToast}
      />
    </>
  );
};
