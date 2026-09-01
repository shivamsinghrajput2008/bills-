/**
 * SUPER BACHAT BAZZAR - Modern Billing & Inventory POS Engine
 * Address: attardah kachhi pakki , muzzafarpur
 */

// ================= CONSTANTS & INITIAL DATA =================
const STORAGE_KEYS = {
  PRODUCTS: 'sbb_products_v1',
  BILLS: 'sbb_bills_v1',
  SETTINGS: 'sbb_settings_v1',
  THEME: 'sbb_theme_v1',
  SOUND: 'sbb_sound_v1',
  NEXT_INVOICE_NUM: 'sbb_invoice_seq_v1'
};

const DEFAULT_SETTINGS = {
  storeName: 'SUPER BACHAT BAZZAR',
  storeAddress: 'attardah kachhi pakki , muzzafarpur',
  storePhone: '+91 98765 43210',
  storeUpi: 'superbachat@upi',
  storeWishes: '🙏 Thank you for shopping with us! Visit again. Save More with Super Bachat Bazzar! 🙏'
};

const SAMPLE_PRODUCTS = [
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

// ================= STATE MANAGEMENT =================
class AppState {
  constructor() {
    this.products = this.loadProducts();
    this.bills = this.loadBills();
    this.settings = this.loadSettings();
    this.cart = [];
    this.soundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false';
    this.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    this.invoiceSeq = parseInt(localStorage.getItem(STORAGE_KEYS.NEXT_INVOICE_NUM) || '1', 10);
    this.paymentMethod = 'Cash';
    this.extraDiscountType = 'rs'; // 'rs' or 'pct'
    this.extraDiscountVal = 0;
    this.includeGst = false;
    this.currentReceiptBill = null;
    this.cameraScanner = null;
    this.audioCtx = null;
  }

  loadProducts() {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      return [...SAMPLE_PRODUCTS];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [...SAMPLE_PRODUCTS];
    }
  }

  saveProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    updateCounters();
  }

  loadBills() {
    const data = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  saveBills() {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(this.bills));
    updateCounters();
  }

  loadSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return { ...DEFAULT_SETTINGS };
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  getNextInvoiceNumber() {
    const seqStr = String(this.invoiceSeq).padStart(4, '0');
    return `SBB-${seqStr}`;
  }

  incrementInvoiceNumber() {
    this.invoiceSeq += 1;
    localStorage.setItem(STORAGE_KEYS.NEXT_INVOICE_NUM, this.invoiceSeq.toString());
  }
}

const state = new AppState();

// ================= WEB AUDIO SYNTHESIZER =================
function initAudioContext() {
  if (!state.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      state.audioCtx = new AudioContextClass();
    }
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudioContext();
    if (!state.audioCtx) return;
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    const ctx = state.audioCtx;
    const now = ctx.currentTime;

    if (type === 'scan') {
      // High-frequency POS barcode scanner beep (880Hz short chirp)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'add') {
      // Pleasant cart add blip (520Hz -> 660Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Cash register fanfare chime chord
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.16, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } else if (type === 'error') {
      // Low buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// ================= TOAST NOTIFICATIONS =================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `₹${num.toFixed(2)}`;
}

function formatDateTime(isoString) {
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

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupNavigation();
  setupClock();
  setupPOS();
  setupInwardInventory();
  setupBillHistory();
  setupAnalytics();
  setupSettings();
  setupGlobalShortcuts();
  updateCounters();

  if (window.lucide) window.lucide.createIcons();
});

// Theme & Sound Setup
function setupTheme() {
  const body = document.body;
  if (state.theme === 'dark') {
    body.classList.remove('theme-light');
    body.classList.add('theme-dark');
  } else {
    body.classList.remove('theme-dark');
    body.classList.add('theme-light');
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = body.classList.contains('theme-dark');
      if (isDark) {
        body.classList.remove('theme-dark');
        body.classList.add('theme-light');
        state.theme = 'light';
        themeIcon.setAttribute('data-lucide', 'moon');
      } else {
        body.classList.remove('theme-light');
        body.classList.add('theme-dark');
        state.theme = 'dark';
        themeIcon.setAttribute('data-lucide', 'sun');
      }
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem(STORAGE_KEYS.SOUND, state.soundEnabled);
      soundIcon.setAttribute('data-lucide', state.soundEnabled ? 'volume-2' : 'volume-x');
      showToast(state.soundEnabled ? 'Sound effects enabled 🔔' : 'Sound effects muted 🔕', 'info');
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

// Navigation Tabs
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${tabId}`);
  });

  if (tabId === 'pos') {
    renderQuickItems();
    const barcodeInput = document.getElementById('barcode-input');
    if (barcodeInput) setTimeout(() => barcodeInput.focus(), 100);
  } else if (tabId === 'inventory') {
    renderInventoryTable();
  } else if (tabId === 'history') {
    renderHistoryTable();
  } else if (tabId === 'analytics') {
    renderAnalytics();
  }

  if (window.lucide) window.lucide.createIcons();
}

function updateCounters() {
  const navItemCount = document.getElementById('nav-item-count');
  const navBillCount = document.getElementById('nav-bill-count');
  if (navItemCount) navItemCount.textContent = state.products.length;
  if (navBillCount) navBillCount.textContent = state.bills.length;
}

// Live Clock
function setupClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ================= POS BILLING MODULE =================
function setupPOS() {
  const barcodeInput = document.getElementById('barcode-input');
  const searchSuggestions = document.getElementById('search-suggestions');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const openCamBtn = document.getElementById('open-cam-scanner-btn');
  const completeCheckoutBtn = document.getElementById('complete-checkout-btn');
  const quickSaveBtn = document.getElementById('quick-save-btn');
  const holdCartBtn = document.getElementById('hold-cart-btn');

  // Preview invoice number
  updateInvoicePreview();

  // Barcode input handling (Hardware scanner sends Enter or manual Enter)
  if (barcodeInput) {
    barcodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const code = barcodeInput.value.trim();
        if (code) {
          handleBarcodeOrSearch(code);
          barcodeInput.value = '';
          searchSuggestions.style.display = 'none';
        }
      }
    });

    barcodeInput.addEventListener('input', () => {
      const query = barcodeInput.value.trim().toLowerCase();
      if (!query) {
        searchSuggestions.style.display = 'none';
        return;
      }
      renderSearchSuggestions(query);
    });
  }

  // Quick categories
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.getAttribute('data-cat');
      renderQuickItems(cat);
    });
  });

  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (state.cart.length === 0) return;
      if (confirm('Are you sure you want to clear the entire cart?')) {
        state.cart = [];
        renderCartTable();
        showToast('Cart cleared', 'info');
      }
    });
  }

  // Camera scanner modal
  if (openCamBtn) {
    openCamBtn.addEventListener('click', () => openCameraScanner('pos'));
  }
  document.getElementById('close-cam-modal-btn')?.addEventListener('click', closeCameraScanner);
  document.getElementById('cancel-cam-btn')?.addEventListener('click', closeCameraScanner);

  // Discount toggle ₹ vs %
  const discRsBtn = document.getElementById('disc-type-rs');
  const discPctBtn = document.getElementById('disc-type-pct');
  const extraDiscInput = document.getElementById('extra-discount-val');
  const gstCheckbox = document.getElementById('gst-enable-checkbox');

  discRsBtn?.addEventListener('click', () => {
    state.extraDiscountType = 'rs';
    discRsBtn.classList.add('active');
    discPctBtn.classList.remove('active');
    calculateCartTotals();
  });

  discPctBtn?.addEventListener('click', () => {
    state.extraDiscountType = 'pct';
    discPctBtn.classList.add('active');
    discRsBtn.classList.remove('active');
    calculateCartTotals();
  });

  extraDiscInput?.addEventListener('input', () => {
    state.extraDiscountVal = parseFloat(extraDiscInput.value) || 0;
    calculateCartTotals();
  });

  gstCheckbox?.addEventListener('change', () => {
    state.includeGst = gstCheckbox.checked;
    calculateCartTotals();
  });

  // Payment method selection
  document.querySelectorAll('.pay-method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.paymentMethod = btn.getAttribute('data-method');
      const cashBox = document.getElementById('cash-calc-box');
      if (cashBox) {
        cashBox.style.display = state.paymentMethod === 'Cash' ? 'block' : 'none';
      }
    });
  });

  // Cash Calculation
  const cashReceivedInput = document.getElementById('cash-received-input');
  cashReceivedInput?.addEventListener('input', calculateCashChange);

  document.querySelectorAll('.denom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-amt');
      const grandTotal = calculateCartTotals().grandTotal;
      if (amt === 'exact') {
        cashReceivedInput.value = grandTotal;
      } else {
        cashReceivedInput.value = amt;
      }
      calculateCashChange();
    });
  });

  // Checkout actions
  if (completeCheckoutBtn) {
    completeCheckoutBtn.addEventListener('click', () => processCheckout(true));
  }
  if (quickSaveBtn) {
    quickSaveBtn.addEventListener('click', () => processCheckout(false));
  }
  if (holdCartBtn) {
    holdCartBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Cart is already empty', 'error');
        return;
      }
      showToast('Cart on hold for next customer', 'info');
      state.cart = [];
      renderCartTable();
    });
  }

  // UPI QR Modal events
  document.getElementById('close-upi-modal-btn')?.addEventListener('click', () => {
    document.getElementById('upi-qr-modal')?.classList.remove('show');
  });
  document.getElementById('upi-confirm-paid-btn')?.addEventListener('click', () => {
    document.getElementById('upi-qr-modal')?.classList.remove('show');
    finalizeBillCreation(true);
  });

  // Receipt Modal actions
  document.getElementById('close-receipt-modal-btn')?.addEventListener('click', () => {
    document.getElementById('receipt-modal')?.classList.remove('show');
  });
  document.getElementById('new-sale-btn')?.addEventListener('click', () => {
    document.getElementById('receipt-modal')?.classList.remove('show');
    resetCartForNewSale();
  });
  document.getElementById('print-bill-btn')?.addEventListener('click', () => {
    window.print();
  });
  document.getElementById('whatsapp-bill-btn')?.addEventListener('click', shareBillOnWhatsApp);

  // Thermal vs A4 format toggle
  const formatThermalBtn = document.getElementById('format-thermal-btn');
  const formatA4Btn = document.getElementById('format-a4-btn');
  const receiptWrapper = document.getElementById('printable-receipt');

  formatThermalBtn?.addEventListener('click', () => {
    formatThermalBtn.classList.add('active');
    formatA4Btn?.classList.remove('active');
    receiptWrapper?.classList.remove('format-a4');
  });

  formatA4Btn?.addEventListener('click', () => {
    formatA4Btn.classList.add('active');
    formatThermalBtn?.classList.remove('active');
    receiptWrapper?.classList.add('format-a4');
  });

  renderQuickItems();
  renderCartTable();
}

function updateInvoicePreview() {
  const el = document.getElementById('preview-invoice-num');
  if (el) el.textContent = '#' + state.getNextInvoiceNumber();
}

function handleBarcodeOrSearch(code) {
  // Try exact match on barcode first
  const product = state.products.find(p => p.barcode.toLowerCase() === code.toLowerCase() || p.id === code);
  if (product) {
    addToCart(product);
    playSound('scan');
    return;
  }

  // If not exact match, search by name substring
  const matches = state.products.filter(p => p.name.toLowerCase().includes(code.toLowerCase()));
  if (matches.length === 1) {
    addToCart(matches[0]);
    playSound('scan');
  } else if (matches.length > 1) {
    renderSearchSuggestions(code);
    playSound('add');
  } else {
    playSound('error');
    showToast(`No product found matching "${code}"`, 'error');
  }
}

function renderSearchSuggestions(query) {
  const container = document.getElementById('search-suggestions');
  if (!container) return;

  const matches = state.products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.barcode.includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = matches.slice(0, 8).map(p => `
    <div class="suggestion-item" data-id="${p.id}">
      <div class="suggestion-info">
        <span class="suggestion-name">${escapeHtml(p.name)}</span>
        <div class="suggestion-meta">
          <span>📦 Barcode: ${escapeHtml(p.barcode)}</span>
          <span>Stock: ${p.quantity} ${p.unit}</span>
        </div>
      </div>
      <div class="suggestion-price">
        <div class="suggestion-rate">${formatCurrency(p.rate)}</div>
        <div class="suggestion-mrp">MRP ${formatCurrency(p.mrp)}</div>
      </div>
    </div>
  `).join('');

  container.style.display = 'block';

  container.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const prodId = item.getAttribute('data-id');
      const prod = state.products.find(p => p.id === prodId);
      if (prod) {
        addToCart(prod);
        playSound('scan');
        const barcodeInput = document.getElementById('barcode-input');
        if (barcodeInput) barcodeInput.value = '';
        container.style.display = 'none';
      }
    });
  });
}

function renderQuickItems(category = 'all') {
  const grid = document.getElementById('quick-items-grid');
  if (!grid) return;

  let list = state.products;
  if (category !== 'all') {
    list = list.filter(p => p.category === category);
  }

  grid.innerHTML = list.slice(0, 18).map(p => {
    const savings = Math.max(0, p.mrp - p.rate);
    return `
      <div class="quick-item-card" data-id="${p.id}">
        <span class="quick-item-badge">Bachat ₹${savings.toFixed(0)}</span>
        <div class="quick-item-title">${escapeHtml(p.name)}</div>
        <div class="quick-item-prices">
          <span class="quick-item-rate">${formatCurrency(p.rate)}</span>
          <span class="quick-item-mrp">${formatCurrency(p.mrp)}</span>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.quick-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const prod = state.products.find(p => p.id === id);
      if (prod) {
        addToCart(prod);
        playSound('add');
      }
    });
  });
}

function addToCart(product) {
  const existing = state.cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      product: { ...product },
      quantity: 1
    });
  }
  renderCartTable();
  showToast(`Added ${product.name.substring(0, 24)}...`, 'success');
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  renderCartTable();
}

function setCartQuantity(productId, qty) {
  const item = state.cart.find(i => i.product.id === productId);
  if (!item) return;

  const parsed = parseInt(qty, 10);
  if (isNaN(parsed) || parsed <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = parsed;
    renderCartTable();
  }
}

function setCartRate(productId, newRate) {
  const item = state.cart.find(i => i.product.id === productId);
  if (!item) return;

  const parsed = parseFloat(newRate);
  if (!isNaN(parsed) && parsed >= 0) {
    item.product.rate = parsed;
    renderCartTable();
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.product.id !== productId);
  renderCartTable();
  showToast('Item removed from cart', 'info');
}

function renderCartTable() {
  const tbody = document.getElementById('cart-table-body');
  const emptyState = document.getElementById('empty-cart-state');
  const cartItemCount = document.getElementById('cart-item-count');

  if (!tbody || !emptyState) return;

  const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartItemCount) cartItemCount.textContent = `${totalItemsCount} items`;

  if (state.cart.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';
    calculateCartTotals();
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = state.cart.map((item, index) => {
    const { product, quantity } = item;
    const itemTotal = product.rate * quantity;
    const itemSavings = (product.mrp - product.rate) * quantity;

    return `
      <tr>
        <td style="color: var(--text-muted); font-family: var(--font-mono);">${index + 1}</td>
        <td>
          <div class="cart-item-name">${escapeHtml(product.name)}</div>
          ${product.barcode ? `<div class="cart-item-code">Barcode: ${escapeHtml(product.barcode)}</div>` : ''}
        </td>
        <td><span class="mrp-strike">${formatCurrency(product.mrp)}</span></td>
        <td>
          <input 
            type="number" 
            class="mini-number-input" 
            style="width: 85px; font-weight: 700; color: var(--primary); text-align: right;" 
            value="${product.rate}" 
            min="0" 
            step="0.5" 
            title="Click to edit selling rate"
            onchange="setCartRate('${product.id}', this.value)"
          >
        </td>
        <td style="text-align: center;">
          <div class="qty-control-group">
            <button class="qty-btn" onclick="updateCartQuantity('${product.id}', -1)">-</button>
            <input type="number" class="qty-input" value="${quantity}" min="1" onchange="setCartQuantity('${product.id}', this.value)">
            <button class="qty-btn" onclick="updateCartQuantity('${product.id}', 1)">+</button>
          </div>
        </td>
        <td style="text-align: right;" class="item-total-col">${formatCurrency(itemTotal)}</td>
        <td style="text-align: right;">
          <span class="item-savings-pill">Save ₹${itemSavings.toFixed(2)}</span>
        </td>
        <td style="text-align: center;">
          <button class="remove-item-btn" title="Remove Item" onclick="removeFromCart('${product.id}')">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
  calculateCartTotals();
}

window.updateCartQuantity = updateCartQuantity;
window.setCartQuantity = setCartQuantity;
window.setCartRate = setCartRate;
window.removeFromCart = removeFromCart;

function calculateCartTotals() {
  let totalMrp = 0;
  let totalStoreAmount = 0;

  state.cart.forEach(item => {
    totalMrp += item.product.mrp * item.quantity;
    totalStoreAmount += item.product.rate * item.quantity;
  });

  const storeDiscount = totalMrp - totalStoreAmount;

  // Extra discount
  let extraDisc = 0;
  if (state.extraDiscountType === 'rs') {
    extraDisc = state.extraDiscountVal;
  } else {
    extraDisc = (totalStoreAmount * state.extraDiscountVal) / 100;
  }
  extraDisc = Math.min(extraDisc, totalStoreAmount);

  const amountAfterExtraDisc = Math.max(0, totalStoreAmount - extraDisc);

  // GST (5% if enabled)
  let gstAmount = 0;
  if (state.includeGst) {
    gstAmount = amountAfterExtraDisc * 0.05;
  }

  const netTotal = amountAfterExtraDisc + gstAmount;
  const grandTotal = Math.round(netTotal);
  const totalCustomerSavings = (totalMrp - grandTotal);

  // Update UI readouts
  const mrpEl = document.getElementById('summary-mrp-total');
  const discEl = document.getElementById('summary-discount-total');
  const gstEl = document.getElementById('summary-gst-total');
  const grandEl = document.getElementById('summary-grand-total');
  const savingsBannerEl = document.getElementById('summary-savings-amount');

  if (mrpEl) mrpEl.textContent = formatCurrency(totalMrp);
  if (discEl) discEl.textContent = `-${formatCurrency(storeDiscount)}`;
  if (gstEl) gstEl.textContent = formatCurrency(gstAmount);
  if (grandEl) grandEl.textContent = formatCurrency(grandTotal);
  if (savingsBannerEl) savingsBannerEl.textContent = formatCurrency(Math.max(0, totalCustomerSavings));

  calculateCashChange();

  return {
    totalMrp,
    storeDiscount,
    extraDiscount: extraDisc,
    gstAmount,
    grandTotal,
    totalCustomerSavings: Math.max(0, totalCustomerSavings)
  };
}

function calculateCashChange() {
  const cashInput = document.getElementById('cash-received-input');
  const display = document.getElementById('cash-change-display');
  if (!cashInput || !display) return;

  // Read current grand total directly from DOM to avoid infinite recursion
  const grandTotalEl = document.getElementById('summary-grand-total');
  const grandTotalText = grandTotalEl ? grandTotalEl.textContent.replace(/[^0-9.]/g, '') : '0';
  const grandTotal = parseFloat(grandTotalText) || 0;

  const cash = parseFloat(cashInput.value) || 0;
  const change = Math.max(0, cash - grandTotal);
  display.textContent = formatCurrency(change);
}

function processCheckout(triggerPrint = true) {
  if (state.cart.length === 0) {
    playSound('error');
    showToast('Cannot checkout: Cart is empty!', 'error');
    return;
  }

  const totals = calculateCartTotals();

  // If UPI chosen, show Dynamic UPI QR Modal first
  if (state.paymentMethod === 'UPI') {
    openUpiModal(totals.grandTotal);
    return;
  }

  finalizeBillCreation(triggerPrint);
}

function openUpiModal(amount) {
  const modal = document.getElementById('upi-qr-modal');
  const amountEl = document.getElementById('modal-upi-amount');
  const qrTarget = document.getElementById('modal-qrcode-target');

  if (!modal || !amountEl || !qrTarget) return;

  amountEl.textContent = formatCurrency(amount);
  qrTarget.innerHTML = '';

  // Standard UPI URI format
  const upiUri = `upi://pay?pa=${encodeURIComponent(state.settings.storeUpi)}&pn=${encodeURIComponent(state.settings.storeName)}&am=${amount.toFixed(2)}&cu=INR&tn=Bill%20Payment`;

  if (window.QRCode) {
    new window.QRCode(qrTarget, {
      text: upiUri,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.H
    });
  }

  modal.classList.add('show');
}

function finalizeBillCreation(triggerPrint = true) {
  const totals = calculateCartTotals();
  const custNameInput = document.getElementById('cust-name-input');
  const custPhoneInput = document.getElementById('cust-phone-input');

  const customerName = custNameInput?.value.trim() || 'Cash Customer';
  const customerPhone = custPhoneInput?.value.trim() || '';

  const invoiceNumber = state.getNextInvoiceNumber();
  const nowIso = new Date().toISOString();

  // Deduct inventory quantities
  state.cart.forEach(item => {
    const prod = state.products.find(p => p.id === item.product.id);
    if (prod) {
      prod.quantity = Math.max(0, prod.quantity - item.quantity);
    }
  });
  state.saveProducts();

  // Create Bill Object
  const bill = {
    id: 'bill-' + Date.now(),
    invoiceNumber,
    createdAt: nowIso,
    customerName,
    customerPhone,
    items: state.cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      barcode: item.product.barcode,
      unit: item.product.unit,
      mrp: item.product.mrp,
      rate: item.product.rate,
      quantity: item.quantity,
      total: item.product.rate * item.quantity,
      savings: (item.product.mrp - item.product.rate) * item.quantity
    })),
    totalMrp: totals.totalMrp,
    storeDiscount: totals.storeDiscount,
    extraDiscount: totals.extraDiscount,
    gstAmount: totals.gstAmount,
    grandTotal: totals.grandTotal,
    totalCustomerSavings: totals.totalCustomerSavings,
    paymentMethod: state.paymentMethod,
    wishes: state.settings.storeWishes,
    storeName: state.settings.storeName,
    storeAddress: state.settings.storeAddress,
    storePhone: state.settings.storePhone
  };

  state.bills.unshift(bill);
  state.saveBills();
  state.incrementInvoiceNumber();
  updateInvoicePreview();

  // Sound & Confetti celebration
  playSound('success');
  if (window.confetti) {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showToast(`Bill ${invoiceNumber} created successfully! Total: ${formatCurrency(totals.grandTotal)}`, 'success');

  state.currentReceiptBill = bill;
  populatePrintReceipt(bill);

  // Always show the receipt modal so the bill is visible
  const receiptModal = document.getElementById('receipt-modal');
  if (receiptModal) {
    receiptModal.classList.add('show');
  }

  // If not triggering print, cart still resets when user clicks "New Sale"
  if (!triggerPrint) {
    // Mark that we came from save (not print) so print btn is secondary
    const printBtn = document.getElementById('print-bill-btn');
    if (printBtn) {
      printBtn.textContent = 'Print Receipt';
    }
  }
}

function populatePrintReceipt(bill) {
  if (!bill) return;

  // Null-safe helper
  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  setEl('receipt-store-name', bill.storeName || state.settings.storeName);
  setEl('receipt-store-address', bill.storeAddress || state.settings.storeAddress);
  setEl('receipt-contact-line', 'Mob: ' + (bill.storePhone || state.settings.storePhone));
  setEl('receipt-bill-no', bill.invoiceNumber);
  setEl('receipt-datetime', formatDateTime(bill.createdAt));
  setEl('receipt-customer-name', bill.customerName || 'Cash Customer');
  setEl('receipt-customer-phone', bill.customerPhone || '-');

  const itemsBody = document.getElementById('receipt-items-body');
  if (itemsBody) {
    itemsBody.innerHTML = bill.items.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>
          <div class="receipt-item-title">${escapeHtml(item.name)}</div>
          <div class="receipt-item-savings-sub">Save ₹${item.savings.toFixed(2)}</div>
        </td>
        <td class="text-right">${item.quantity}</td>
        <td class="text-right">${item.mrp.toFixed(2)}</td>
        <td class="text-right font-bold">${item.rate.toFixed(2)}</td>
        <td class="text-right font-bold">${item.total.toFixed(2)}</td>
      </tr>
    `).join('');
  }

  const totalQty = bill.items.reduce((s, i) => s + i.quantity, 0);
  setEl('receipt-total-items-qty', bill.items.length + ' items / ' + totalQty + ' units');
  setEl('receipt-total-mrp', formatCurrency(bill.totalMrp));
  setEl('receipt-discount-saved', '-' + formatCurrency(bill.storeDiscount));

  const extraDiscRow = document.getElementById('receipt-extra-disc-row');
  if (extraDiscRow) {
    if (bill.extraDiscount > 0) {
      extraDiscRow.style.display = 'flex';
      setEl('receipt-extra-disc-val', '-' + formatCurrency(bill.extraDiscount));
    } else {
      extraDiscRow.style.display = 'none';
    }
  }

  const taxRow = document.getElementById('receipt-tax-row');
  if (taxRow) {
    if (bill.gstAmount > 0) {
      taxRow.style.display = 'flex';
      setEl('receipt-tax-val', formatCurrency(bill.gstAmount));
    } else {
      taxRow.style.display = 'none';
    }
  }

  setEl('receipt-grand-total', formatCurrency(bill.grandTotal));
  setEl('receipt-payment-mode', bill.paymentMethod);
  setEl('receipt-saved-highlight', formatCurrency(bill.totalCustomerSavings));
  setEl('receipt-wishes-text', bill.wishes || state.settings.storeWishes);

  // Render Barcode on bottom of receipt
  if (window.JsBarcode) {
    try {
      window.JsBarcode('#receipt-barcode-svg', bill.invoiceNumber, {
        format: "CODE128",
        lineColor: "#000000",
        width: 1.5,
        height: 35,
        displayValue: true,
        fontSize: 11
      });
    } catch (e) {
      console.warn('Receipt barcode render failed:', e);
    }
  }
}

function resetCartForNewSale() {
  state.cart = [];
  state.paymentMethod = 'Cash';
  state.extraDiscountVal = 0;
  state.includeGst = false;

  const custName = document.getElementById('cust-name-input');
  const custPhone = document.getElementById('cust-phone-input');
  const cashRec = document.getElementById('cash-received-input');
  const barcodeIn = document.getElementById('barcode-input');
  const extraDisc = document.getElementById('extra-discount-val');
  const gstCb = document.getElementById('gst-enable-checkbox');
  const cashBox = document.getElementById('cash-calc-box');
  const changeDisplay = document.getElementById('cash-change-display');

  if (custName) custName.value = '';
  if (custPhone) custPhone.value = '';
  if (cashRec) cashRec.value = '';
  if (extraDisc) extraDisc.value = '0';
  if (gstCb) gstCb.checked = false;
  if (cashBox) cashBox.style.display = 'block';
  if (changeDisplay) changeDisplay.textContent = formatCurrency(0);

  // Reset payment buttons to Cash
  document.querySelectorAll('.pay-method-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-method') === 'Cash');
  });

  renderCartTable();
  if (barcodeIn) {
    setTimeout(() => barcodeIn.focus(), 100);
  }
}

function shareBillOnWhatsApp() {
  const bill = state.currentReceiptBill;
  if (!bill) return;

  let phone = bill.customerPhone ? bill.customerPhone.replace(/\D/g, '') : '';
  if (phone.length === 10) phone = '91' + phone;

  let message = `*🧾 INVOICE - ${state.settings.storeName.toUpperCase()}*\n`;
  message += `📍 _${state.settings.storeAddress}_\n`;
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
  message += `*Grand Total Paid:* ₹${bill.grandTotal.toFixed(2)} (${bill.paymentMethod})\n`;
  message += `*🎉 YOU SAVED: ₹${bill.totalCustomerSavings.toFixed(2)}!*\n`;
  message += `--------------------------------\n`;
  message += `${bill.wishes || state.settings.storeWishes}\n`;

  const url = phone 
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

// ================= INWARD STOCK & INVENTORY MODULE =================
function setupInwardInventory() {
  const form = document.getElementById('inward-stock-form');
  const nowBtn = document.getElementById('set-now-datetime-btn');
  const autoBarcodeBtn = document.getElementById('inward-gen-barcode-btn');
  const scanCamBtn = document.getElementById('inward-scan-cam-btn');
  const resetBtn = document.getElementById('reset-inward-form-btn');
  const mrpInput = document.getElementById('prod-mrp');
  const rateInput = document.getElementById('prod-rate');
  const searchInput = document.getElementById('inventory-search-input');
  const catFilter = document.getElementById('inventory-category-filter');
  const stockFilter = document.getElementById('inventory-stock-filter');
  const exportBtn = document.getElementById('export-inventory-csv-btn');
  const printBarcodesBtn = document.getElementById('print-all-barcodes-btn');

  // Set default inward date-time to now
  setDefaultInwardDateTime();

  nowBtn?.addEventListener('click', setDefaultInwardDateTime);

  autoBarcodeBtn?.addEventListener('click', () => {
    const code = generateEAN13Barcode();
    const barcodeIn = document.getElementById('prod-barcode');
    if (barcodeIn) {
      barcodeIn.value = code;
      showToast(`Generated Barcode: ${code}`, 'info');
    }
  });

  scanCamBtn?.addEventListener('click', () => openCameraScanner('inward'));

  // Live savings preview
  function updateInwardSavings() {
    const mrp = parseFloat(mrpInput?.value) || 0;
    const rate = parseFloat(rateInput?.value) || 0;
    const preview = document.getElementById('inward-savings-preview');
    if (!preview) return;

    const diff = mrp - rate;
    const pct = mrp > 0 ? ((diff / mrp) * 100).toFixed(1) : 0;

    if (diff >= 0) {
      preview.innerHTML = `<span class="preview-badge text-success">Customer Saves: ₹${diff.toFixed(2)} (${pct}%)</span>`;
    } else {
      preview.innerHTML = `<span class="preview-badge" style="color: var(--danger);">Rate higher than MRP!</span>`;
    }
  }

  mrpInput?.addEventListener('input', updateInwardSavings);
  rateInput?.addEventListener('input', updateInwardSavings);

  // Form Submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('inward-edit-id')?.value;
    const name = document.getElementById('prod-name')?.value.trim();
    const category = document.getElementById('prod-category')?.value;
    const barcode = document.getElementById('prod-barcode')?.value.trim();
    const inwardDateTime = document.getElementById('prod-inward-datetime')?.value;
    const quantity = parseInt(document.getElementById('prod-quantity')?.value, 10) || 0;
    const unit = document.getElementById('prod-unit')?.value || 'Pcs';
    const mrp = parseFloat(document.getElementById('prod-mrp')?.value) || 0;
    const rate = parseFloat(document.getElementById('prod-rate')?.value) || 0;
    const costPrice = parseFloat(document.getElementById('prod-cost-price')?.value) || 0;
    const shelf = document.getElementById('prod-shelf')?.value.trim() || '';

    if (!name || !barcode) {
      showToast('Please fill all required product fields!', 'error');
      return;
    }

    if (editId) {
      // Edit existing
      const prod = state.products.find(p => p.id === editId);
      if (prod) {
        prod.name = name;
        prod.category = category;
        prod.barcode = barcode;
        prod.inwardDateTime = inwardDateTime;
        prod.quantity = quantity;
        prod.unit = unit;
        prod.mrp = mrp;
        prod.rate = rate;
        prod.costPrice = costPrice;
        prod.shelf = shelf;
        showToast('Product updated successfully!', 'success');
      }
    } else {
      // Check duplicate barcode
      const existing = state.products.find(p => p.barcode === barcode);
      if (existing) {
        if (confirm(`A product with barcode "${barcode}" already exists (${existing.name}). Do you want to add ${quantity} units to its stock instead?`)) {
          existing.quantity += quantity;
          existing.inwardDateTime = inwardDateTime;
          existing.mrp = mrp;
          existing.rate = rate;
          state.saveProducts();
          renderInventoryTable();
          renderQuickItems();
          resetInwardForm();
          showToast(`Updated stock for ${existing.name}!`, 'success');
          return;
        }
      }

      // Add new
      const newProduct = {
        id: 'sbb-p-' + Date.now(),
        name,
        category,
        barcode,
        inwardDateTime,
        quantity,
        unit,
        mrp,
        rate,
        costPrice,
        shelf
      };

      state.products.unshift(newProduct);
      showToast(`Added inward stock for "${name}"!`, 'success');
    }

    state.saveProducts();
    renderInventoryTable();
    renderQuickItems();
    resetInwardForm();
    playSound('add');
  });

  resetBtn?.addEventListener('click', resetInwardForm);

  // Search and filters
  searchInput?.addEventListener('input', renderInventoryTable);
  catFilter?.addEventListener('change', renderInventoryTable);
  stockFilter?.addEventListener('change', renderInventoryTable);

  exportBtn?.addEventListener('click', exportInventoryCsv);
  printBarcodesBtn?.addEventListener('click', openBarcodeStickersModal);

  document.getElementById('close-stickers-modal-btn')?.addEventListener('click', () => {
    document.getElementById('barcode-stickers-modal')?.classList.remove('show');
  });
  document.getElementById('print-stickers-btn')?.addEventListener('click', () => {
    window.print();
  });

  renderInventoryTable();
}

function setDefaultInwardDateTime() {
  const dtInput = document.getElementById('prod-inward-datetime');
  if (!dtInput) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  dtInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

function generateEAN13Barcode() {
  let code = '890' + Math.floor(100000000 + Math.random() * 900000000).toString();
  // 12 digits + 1 checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return code + checksum;
}

function resetInwardForm() {
  const form = document.getElementById('inward-stock-form');
  if (form) form.reset();
  document.getElementById('inward-edit-id').value = '';
  document.getElementById('inward-form-mode').textContent = 'New Stock Inward';
  document.getElementById('save-btn-text').textContent = 'Save Inward Product Stock';
  setDefaultInwardDateTime();
  const preview = document.getElementById('inward-savings-preview');
  if (preview) preview.innerHTML = '<span class="preview-badge text-success">Save: ₹0 (0%)</span>';
}

function editProduct(id) {
  const prod = state.products.find(p => p.id === id);
  if (!prod) return;

  switchTab('inventory');
  document.getElementById('inward-edit-id').value = prod.id;
  document.getElementById('prod-name').value = prod.name;
  document.getElementById('prod-category').value = prod.category;
  document.getElementById('prod-barcode').value = prod.barcode;
  document.getElementById('prod-inward-datetime').value = prod.inwardDateTime || '';
  document.getElementById('prod-quantity').value = prod.quantity;
  document.getElementById('prod-unit').value = prod.unit || 'Pcs';
  document.getElementById('prod-mrp').value = prod.mrp;
  document.getElementById('prod-rate').value = prod.rate;
  document.getElementById('prod-cost-price').value = prod.costPrice || '';
  document.getElementById('prod-shelf').value = prod.shelf || '';

  document.getElementById('inward-form-mode').textContent = 'Editing Product Stock';
  document.getElementById('save-btn-text').textContent = 'Update Product Stock';

  const diff = prod.mrp - prod.rate;
  const pct = prod.mrp > 0 ? ((diff / prod.mrp) * 100).toFixed(1) : 0;
  const preview = document.getElementById('inward-savings-preview');
  if (preview) {
    preview.innerHTML = `<span class="preview-badge text-success">Save: ₹${diff.toFixed(2)} (${pct}%)</span>`;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  const prod = state.products.find(p => p.id === id);
  if (!prod) return;

  if (confirm(`Are you sure you want to delete "${prod.name}" from store inventory?`)) {
    state.products = state.products.filter(p => p.id !== id);
    state.saveProducts();
    renderInventoryTable();
    renderQuickItems();
    showToast(`Deleted product: ${prod.name}`, 'info');
  }
}

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  const searchQuery = document.getElementById('inventory-search-input')?.value.trim().toLowerCase() || '';
  const catFilter = document.getElementById('inventory-category-filter')?.value || 'all';
  const stockFilter = document.getElementById('inventory-stock-filter')?.value || 'all';

  let list = state.products;

  if (searchQuery) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.barcode.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      (p.shelf && p.shelf.toLowerCase().includes(searchQuery))
    );
  }

  if (catFilter !== 'all') {
    list = list.filter(p => p.category === catFilter);
  }

  if (stockFilter === 'low') {
    list = list.filter(p => p.quantity > 0 && p.quantity < 10);
  } else if (stockFilter === 'out') {
    list = list.filter(p => p.quantity <= 0);
  } else if (stockFilter === 'available') {
    list = list.filter(p => p.quantity > 0);
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">
          No products found matching the criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const savings = Math.max(0, p.mrp - p.rate);
    const savingsPct = p.mrp > 0 ? ((savings / p.mrp) * 100).toFixed(0) : 0;

    let stockBadgeClass = 'in-stock';
    if (p.quantity <= 0) stockBadgeClass = 'out-of-stock';
    else if (p.quantity < 10) stockBadgeClass = 'low-stock';

    return `
      <tr>
        <td><span class="barcode-badge">${escapeHtml(p.barcode)}</span></td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(p.name)}</div>
          ${p.shelf ? `<div style="font-size: 11px; color: var(--text-muted);">📍 ${escapeHtml(p.shelf)}</div>` : ''}
        </td>
        <td><span style="font-size: 12px; color: var(--text-muted);">${escapeHtml(p.category)}</span></td>
        <td><span style="font-size: 12px; color: var(--text-muted);">${formatDateTime(p.inwardDateTime)}</span></td>
        <td>
          <span class="stock-badge ${stockBadgeClass}">
            ${p.quantity} ${p.unit}
          </span>
        </td>
        <td style="font-family: var(--font-mono);">${formatCurrency(p.mrp)}</td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${formatCurrency(p.rate)}</td>
        <td>
          <span class="item-savings-pill">Save ₹${savings.toFixed(2)} (${savingsPct}%)</span>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-icon-btn" title="Edit Product" onclick="editProduct('${p.id}')">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="action-icon-btn delete" title="Delete Product" onclick="deleteProduct('${p.id}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function exportInventoryCsv() {
  if (state.products.length === 0) {
    showToast('No products to export!', 'error');
    return;
  }

  let csv = 'Barcode,Product Name,Category,Inward Date Time,Stock Quantity,Unit,MRP,Our Rate,Cost Price,Shelf\n';
  state.products.forEach(p => {
    const row = [
      `"${p.barcode}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      `"${p.inwardDateTime || ''}"`,
      p.quantity,
      `"${p.unit || ''}"`,
      p.mrp,
      p.rate,
      p.costPrice || 0,
      `"${p.shelf || ''}"`
    ];
    csv += row.join(',') + '\n';
  });

  downloadFile(csv, `Super_Bachat_Bazzar_Inventory_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  showToast('Inventory exported to CSV!', 'success');
}

function openBarcodeStickersModal() {
  const modal = document.getElementById('barcode-stickers-modal');
  const sheetTarget = document.getElementById('stickers-sheet-target');
  const copiesInput = document.getElementById('sticker-copies-input');

  if (!modal || !sheetTarget) return;

  const copies = parseInt(copiesInput?.value, 10) || 2;
  sheetTarget.innerHTML = '';

  state.products.slice(0, 15).forEach((p, pIdx) => {
    for (let c = 0; c < copies; c++) {
      const sticker = document.createElement('div');
      sticker.className = 'barcode-sticker';
      sticker.innerHTML = `
        <span class="sticker-store">SUPER BACHAT BAZZAR</span>
        <span class="sticker-name">${escapeHtml(p.name)}</span>
        <div class="sticker-prices">
          <span class="sticker-rate">Rate: ₹${p.rate}</span>
          <span class="sticker-mrp">MRP: ₹${p.mrp}</span>
        </div>
        <svg id="sticker-barcode-${pIdx}-${c}" class="sticker-barcode-svg"></svg>
      `;
      sheetTarget.appendChild(sticker);

      setTimeout(() => {
        if (window.JsBarcode) {
          try {
            window.JsBarcode(`#sticker-barcode-${pIdx}-${c}`, p.barcode, {
              format: "CODE128",
              width: 1.2,
              height: 25,
              displayValue: true,
              fontSize: 9
            });
          } catch (err) {
            console.warn('Barcode sticker error:', err);
          }
        }
      }, 50);
    }
  });

  modal.classList.add('show');
}

// ================= BILL HISTORY MODULE =================
function setupBillHistory() {
  const searchInput = document.getElementById('history-search-input');
  const dateFilter = document.getElementById('history-date-filter');
  const payFilter = document.getElementById('history-payment-filter');
  const exportBtn = document.getElementById('export-sales-csv-btn');

  searchInput?.addEventListener('input', renderHistoryTable);
  dateFilter?.addEventListener('change', renderHistoryTable);
  payFilter?.addEventListener('change', renderHistoryTable);
  exportBtn?.addEventListener('click', exportSalesCsv);

  renderHistoryTable();
}

function renderHistoryTable() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  const search = document.getElementById('history-search-input')?.value.trim().toLowerCase() || '';
  const dateVal = document.getElementById('history-date-filter')?.value || '';
  const payVal = document.getElementById('history-payment-filter')?.value || 'all';

  let list = state.bills;

  if (search) {
    list = list.filter(b => 
      b.invoiceNumber.toLowerCase().includes(search) ||
      b.customerName.toLowerCase().includes(search) ||
      (b.customerPhone && b.customerPhone.includes(search))
    );
  }

  if (dateVal) {
    list = list.filter(b => b.createdAt.startsWith(dateVal));
  }

  if (payVal !== 'all') {
    list = list.filter(b => b.paymentMethod === payVal);
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted);">
          No sales bills found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(bill => {
    const totalQty = bill.items.reduce((s, i) => s + i.quantity, 0);
    return `
      <tr>
        <td><span class="invoice-badge">${escapeHtml(bill.invoiceNumber)}</span></td>
        <td style="font-size: 12px; color: var(--text-muted);">${formatDateTime(bill.createdAt)}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(bill.customerName)}</div>
          ${bill.customerPhone ? `<div style="font-size: 11.5px; color: var(--text-muted);">📞 ${escapeHtml(bill.customerPhone)}</div>` : ''}
        </td>
        <td>${bill.items.length} items (${totalQty} units)</td>
        <td style="font-family: var(--font-mono);">${formatCurrency(bill.totalMrp)}</td>
        <td><span class="item-savings-pill font-bold">Saved ₹${bill.totalCustomerSavings.toFixed(2)}</span></td>
        <td style="font-family: var(--font-mono); font-weight: 800; font-size: 14.5px; color: var(--primary);">${formatCurrency(bill.grandTotal)}</td>
        <td><span class="pay-badge ${bill.paymentMethod}">${bill.paymentMethod}</span></td>
        <td>
          <div class="table-actions">
            <button class="action-icon-btn" title="Edit Bill" onclick="openEditBillModal('${bill.id}')" style="color: var(--primary);">
              <i data-lucide="edit"></i>
            </button>
            <button class="action-icon-btn" title="View & Print Invoice" onclick="viewBillDetails('${bill.id}')">
              <i data-lucide="printer"></i>
            </button>
            <button class="action-icon-btn" title="Share WhatsApp" onclick="shareExistingBill('${bill.id}')">
              <i data-lucide="send"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

let editingBillState = null;

function openEditBillModal(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) {
    showToast('Bill not found!', 'error');
    return;
  }

  // Deep clone bill so changes can be cancelled
  editingBillState = JSON.parse(JSON.stringify(bill));

  const modal = document.getElementById('edit-bill-modal');
  if (!modal) return;

  document.getElementById('edit-bill-invoice-num').textContent = editingBillState.invoiceNumber;
  document.getElementById('edit-cust-name').value = editingBillState.customerName || '';
  document.getElementById('edit-cust-phone').value = editingBillState.customerPhone || '';
  document.getElementById('edit-payment-method').value = editingBillState.paymentMethod || 'Cash';
  
  if (editingBillState.createdAt) {
    const d = new Date(editingBillState.createdAt);
    if (!isNaN(d.getTime())) {
      const pad = (n) => String(n).padStart(2, '0');
      const isoStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      document.getElementById('edit-bill-date').value = isoStr;
    }
  }

  const discTypeSelect = document.getElementById('edit-extra-disc-type');
  const discValInput = document.getElementById('edit-extra-disc-val');
  if (discTypeSelect && discValInput) {
    discTypeSelect.value = editingBillState.extraDiscountType || 'rs';
    discValInput.value = editingBillState.extraDiscountValue || 0;
  }

  const gstCheckbox = document.getElementById('edit-gst-enable');
  if (gstCheckbox) {
    gstCheckbox.checked = !!editingBillState.isGstEnabled;
  }

  renderEditBillItems();
  setupEditModalListenersOnce();
  modal.classList.add('show');
}

function renderEditBillItems() {
  if (!editingBillState) return;
  const tbody = document.getElementById('edit-items-tbody');
  const countBadge = document.getElementById('edit-items-count');
  if (!tbody) return;

  if (countBadge) countBadge.textContent = `${editingBillState.items.length} items`;

  if (editingBillState.items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:20px; color:var(--text-muted);">
          No items in this bill. Add products above.
        </td>
      </tr>
    `;
    calculateEditBillTotals();
    return;
  }

  tbody.innerHTML = editingBillState.items.map((item, index) => {
    const total = item.ourRate * item.quantity;
    const savings = (item.mrp - item.ourRate) * item.quantity;
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div style="font-weight:600; color:var(--text-main);">${escapeHtml(item.product.name)}</div>
          ${item.product.barcode ? `<div style="font-size:11px; color:var(--text-muted);">${item.product.barcode}</div>` : ''}
        </td>
        <td>
          <input type="number" class="mini-number-input" value="${item.mrp}" min="0" step="0.5" 
            onchange="updateEditItemPrice(${index}, 'mrp', this.value)">
        </td>
        <td>
          <input type="number" class="mini-number-input" value="${item.ourRate}" min="0" step="0.5" 
            onchange="updateEditItemPrice(${index}, 'ourRate', this.value)">
        </td>
        <td style="text-align:center;">
          <div class="qty-btn-group" style="justify-content:center;">
            <button class="qty-btn" onclick="changeEditItemQty(${index}, -1)">-</button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" 
              onchange="changeEditItemQty(${index}, 0, this.value)">
            <button class="qty-btn" onclick="changeEditItemQty(${index}, 1)">+</button>
          </div>
        </td>
        <td style="text-align:right; font-family:var(--font-mono); font-weight:700;">₹${total.toFixed(2)}</td>
        <td style="text-align:right; color:var(--success); font-size:12px;">₹${savings.toFixed(2)}</td>
        <td style="text-align:center;">
          <button class="btn-remove-item" onclick="removeEditItem(${index})" title="Remove item">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
  calculateEditBillTotals();
}

function updateEditItemPrice(index, field, val) {
  if (!editingBillState || !editingBillState.items[index]) return;
  const num = parseFloat(val) || 0;
  editingBillState.items[index][field] = num;
  renderEditBillItems();
}

function changeEditItemQty(index, delta, directVal) {
  if (!editingBillState || !editingBillState.items[index]) return;
  if (directVal !== undefined) {
    editingBillState.items[index].quantity = Math.max(1, parseInt(directVal) || 1);
  } else {
    editingBillState.items[index].quantity = Math.max(1, editingBillState.items[index].quantity + delta);
  }
  renderEditBillItems();
}

function removeEditItem(index) {
  if (!editingBillState || !editingBillState.items[index]) return;
  editingBillState.items.splice(index, 1);
  renderEditBillItems();
}

function calculateEditBillTotals() {
  if (!editingBillState) return;

  const totalMrp = editingBillState.items.reduce((s, i) => s + (i.mrp * i.quantity), 0);
  const totalOurRate = editingBillState.items.reduce((s, i) => s + (i.ourRate * i.quantity), 0);
  const storeDiscount = totalMrp - totalOurRate;

  const discType = document.getElementById('edit-extra-disc-type')?.value || 'rs';
  const discVal = parseFloat(document.getElementById('edit-extra-disc-val')?.value) || 0;
  
  let extraDiscountAmount = 0;
  if (discType === 'rs') {
    extraDiscountAmount = discVal;
  } else {
    extraDiscountAmount = (totalOurRate * discVal) / 100;
  }

  const afterDiscount = Math.max(0, totalOurRate - extraDiscountAmount);
  
  const isGst = document.getElementById('edit-gst-enable')?.checked || false;
  const gstAmount = isGst ? (afterDiscount * 0.05) : 0;
  const grandTotal = Math.round(afterDiscount + gstAmount);
  const totalCustomerSavings = (totalMrp - grandTotal);

  editingBillState.totalMrp = totalMrp;
  editingBillState.totalOurRate = totalOurRate;
  editingBillState.storeDiscount = storeDiscount;
  editingBillState.extraDiscountType = discType;
  editingBillState.extraDiscountValue = discVal;
  editingBillState.extraDiscountAmount = extraDiscountAmount;
  editingBillState.isGstEnabled = isGst;
  editingBillState.gstAmount = gstAmount;
  editingBillState.grandTotal = grandTotal;
  editingBillState.totalCustomerSavings = totalCustomerSavings;

  const elMrp = document.getElementById('edit-total-mrp');
  const elDisc = document.getElementById('edit-total-discount');
  const elGst = document.getElementById('edit-gst-val');
  const elGrand = document.getElementById('edit-grand-total');
  const elSavings = document.getElementById('edit-cust-savings');

  if (elMrp) elMrp.textContent = formatCurrency(totalMrp);
  if (elDisc) elDisc.textContent = `-₹${storeDiscount.toFixed(2)}`;
  if (elGst) elGst.textContent = formatCurrency(gstAmount);
  if (elGrand) elGrand.textContent = formatCurrency(grandTotal);
  if (elSavings) elSavings.textContent = formatCurrency(Math.max(0, totalCustomerSavings));
}

let editModalListenersBound = false;

function setupEditModalListenersOnce() {
  if (editModalListenersBound) return;
  editModalListenersBound = true;

  document.getElementById('edit-extra-disc-type')?.addEventListener('change', calculateEditBillTotals);
  document.getElementById('edit-extra-disc-val')?.addEventListener('input', calculateEditBillTotals);
  document.getElementById('edit-gst-enable')?.addEventListener('change', calculateEditBillTotals);

  document.getElementById('close-edit-bill-modal-btn')?.addEventListener('click', closeEditBillModal);
  document.getElementById('close-edit-bill-modal')?.addEventListener('click', closeEditBillModal);
  document.getElementById('cancel-edit-bill-btn')?.addEventListener('click', closeEditBillModal);

  document.getElementById('save-edit-bill-btn')?.addEventListener('click', saveEditedBill);
  document.getElementById('delete-bill-btn')?.addEventListener('click', deleteCurrentEditingBill);

  const searchInput = document.getElementById('edit-product-search');
  const suggestionsBox = document.getElementById('edit-search-suggestions');

  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q || !suggestionsBox) {
      if (suggestionsBox) suggestionsBox.style.display = 'none';
      return;
    }
    const matches = state.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.barcode && p.barcode.toLowerCase().includes(q))
    ).slice(0, 6);

    if (matches.length === 0) {
      suggestionsBox.style.display = 'none';
      return;
    }

    suggestionsBox.innerHTML = matches.map(p => `
      <div class="suggestion-item" onclick="addSearchProductToEditBill('${p.id}')">
        <div><strong>${escapeHtml(p.name)}</strong> <span style="font-size:11px; color:var(--text-muted);">Stock: ${p.stockQty} ${p.unit}</span></div>
        <div style="font-family:var(--font-mono); font-weight:700;">₹${p.ourRate} <span style="text-decoration:line-through; font-size:11px; color:var(--text-muted);">₹${p.mrp}</span></div>
      </div>
    `).join('');
    suggestionsBox.style.display = 'block';
  });

  document.getElementById('edit-add-manual-item-btn')?.addEventListener('click', () => {
    const nameInput = document.getElementById('edit-manual-name');
    const mrpInput = document.getElementById('edit-manual-mrp');
    const rateInput = document.getElementById('edit-manual-rate');
    const qtyInput = document.getElementById('edit-manual-qty');

    const name = nameInput?.value.trim();
    const mrp = parseFloat(mrpInput?.value) || 0;
    const rate = parseFloat(rateInput?.value) || 0;
    const qty = parseInt(qtyInput?.value) || 1;

    if (!name || mrp <= 0 || rate <= 0) {
      showToast('Enter valid product name, MRP, and Rate!', 'error');
      return;
    }

    editingBillState.items.push({
      product: { id: 'manual-' + Date.now(), name: name, barcode: '', category: 'General' },
      mrp: mrp,
      ourRate: rate,
      quantity: qty
    });

    nameInput.value = '';
    mrpInput.value = '';
    rateInput.value = '';
    qtyInput.value = '1';

    renderEditBillItems();
    showToast(`Added ${name} to bill`, 'success');
  });
}

function addSearchProductToEditBill(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod || !editingBillState) return;

  const existing = editingBillState.items.find(i => i.product.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    editingBillState.items.push({
      product: { ...prod },
      mrp: prod.mrp,
      ourRate: prod.ourRate,
      quantity: 1
    });
  }

  const suggestionsBox = document.getElementById('edit-search-suggestions');
  const searchInput = document.getElementById('edit-product-search');
  if (suggestionsBox) suggestionsBox.style.display = 'none';
  if (searchInput) searchInput.value = '';

  renderEditBillItems();
  showToast(`Added ${prod.name}`, 'success');
}

function closeEditBillModal() {
  editingBillState = null;
  document.getElementById('edit-bill-modal')?.classList.remove('show');
}

function saveEditedBill() {
  if (!editingBillState) return;

  if (editingBillState.items.length === 0) {
    showToast('Cannot save empty bill! Add items or delete bill.', 'error');
    return;
  }

  const originalBill = state.bills.find(b => b.id === editingBillState.id);
  if (!originalBill) return;

  // Restore inventory stock from original bill items
  originalBill.items.forEach(oldItem => {
    const prod = state.products.find(p => p.id === oldItem.product.id);
    if (prod) {
      prod.stockQty += oldItem.quantity;
    }
  });

  // Deduct inventory stock for updated bill items
  editingBillState.items.forEach(newItem => {
    const prod = state.products.find(p => p.id === newItem.product.id);
    if (prod) {
      prod.stockQty = Math.max(0, prod.stockQty - newItem.quantity);
    }
  });

  // Update customer metadata & date
  const custName = document.getElementById('edit-cust-name')?.value.trim() || 'Cash Customer';
  const custPhone = document.getElementById('edit-cust-phone')?.value.trim() || '';
  const payMethod = document.getElementById('edit-payment-method')?.value || 'Cash';
  const dateVal = document.getElementById('edit-bill-date')?.value;

  editingBillState.customerName = custName;
  editingBillState.customerPhone = custPhone;
  editingBillState.paymentMethod = payMethod;

  if (dateVal) {
    const dateObj = new Date(dateVal);
    if (!isNaN(dateObj.getTime())) {
      editingBillState.createdAt = dateObj.toISOString();
    }
  }

  calculateEditBillTotals();

  // Save changes to state
  const billIndex = state.bills.findIndex(b => b.id === editingBillState.id);
  if (billIndex !== -1) {
    state.bills[billIndex] = editingBillState;
  }

  state.saveBills();
  state.saveProducts();

  renderInventoryTable();
  renderHistoryTable();
  renderDashboard();

  closeEditBillModal();
  showToast(`Bill ${editingBillState.invoiceNumber} updated successfully!`, 'success');
  playSound('success');
}

function deleteCurrentEditingBill() {
  if (!editingBillState) return;

  if (!confirm(`Are you sure you want to delete invoice ${editingBillState.invoiceNumber}? Stock will be restored.`)) {
    return;
  }

  // Restore inventory stock
  editingBillState.items.forEach(item => {
    const prod = state.products.find(p => p.id === item.product.id);
    if (prod) {
      prod.stockQty += item.quantity;
    }
  });

  state.bills = state.bills.filter(b => b.id !== editingBillState.id);
  state.saveBills();
  state.saveProducts();

  renderInventoryTable();
  renderHistoryTable();
  renderDashboard();

  closeEditBillModal();
  showToast(`Bill ${editingBillState.invoiceNumber} deleted and stock restored.`, 'info');
}

window.openEditBillModal = openEditBillModal;
window.closeEditBillModal = closeEditBillModal;
window.addSearchProductToEditBill = addSearchProductToEditBill;
window.updateEditItemPrice = updateEditItemPrice;
window.changeEditItemQty = changeEditItemQty;
window.removeEditItem = removeEditItem;
window.saveEditedBill = saveEditedBill;
window.deleteCurrentEditingBill = deleteCurrentEditingBill;

function viewBillDetails(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;
  state.currentReceiptBill = bill;
  populatePrintReceipt(bill);
  document.getElementById('receipt-modal')?.classList.add('show');
}

function shareExistingBill(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) return;
  state.currentReceiptBill = bill;
  shareBillOnWhatsApp();
}

window.viewBillDetails = viewBillDetails;
window.shareExistingBill = shareExistingBill;

function exportSalesCsv() {
  if (state.bills.length === 0) {
    showToast('No sales bills to export!', 'error');
    return;
  }

  let csv = 'Invoice Number,Date Time,Customer Name,Customer Phone,Items Count,Total MRP,Store Discount,Grand Total,Customer Savings,Payment Method\n';
  state.bills.forEach(b => {
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
      `"${b.paymentMethod}"`
    ];
    csv += row.join(',') + '\n';
  });

  downloadFile(csv, `Super_Bachat_Bazzar_Sales_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  showToast('Sales records exported to CSV!', 'success');
}

// ================= ANALYTICS MODULE =================
function setupAnalytics() {
  renderAnalytics();
}

function renderAnalytics() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBills = state.bills.filter(b => b.createdAt.startsWith(todayStr));

  const todaySales = todayBills.reduce((s, b) => s + b.grandTotal, 0);
  const todaySavings = todayBills.reduce((s, b) => s + b.totalCustomerSavings, 0);
  const allTimeSales = state.bills.reduce((s, b) => s + b.grandTotal, 0);

  const lowStockCount = state.products.filter(p => p.quantity < 10).length;

  document.getElementById('metric-today-sales').textContent = formatCurrency(todaySales);
  document.getElementById('metric-today-bills-count').textContent = `${todayBills.length} bills generated today`;
  document.getElementById('metric-today-savings').textContent = formatCurrency(todaySavings);
  document.getElementById('metric-total-products').textContent = state.products.length;
  document.getElementById('metric-low-stock-count').textContent = `${lowStockCount} low stock alerts (<10)`;
  document.getElementById('metric-alltime-sales').textContent = formatCurrency(allTimeSales);
  document.getElementById('metric-alltime-bills').textContent = `${state.bills.length} all-time invoices`;

  // Payment Breakdown
  const payStats = { Cash: 0, UPI: 0, Card: 0, Credit: 0 };
  state.bills.forEach(b => {
    if (payStats[b.paymentMethod] !== undefined) {
      payStats[b.paymentMethod] += b.grandTotal;
    }
  });

  const payContainer = document.getElementById('payment-stats-container');
  if (payContainer) {
    const totalRevenue = allTimeSales || 1;
    payContainer.innerHTML = Object.keys(payStats).map(key => {
      const amt = payStats[key];
      const pct = ((amt / totalRevenue) * 100).toFixed(1);
      return `
        <div class="stat-progress-item">
          <div class="stat-item-header">
            <span>${key} (${formatCurrency(amt)})</span>
            <span>${pct}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Top Selling Products
  const itemCounts = {};
  state.bills.forEach(b => {
    b.items.forEach(i => {
      itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
    });
  });

  const sortedTop = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topContainer = document.getElementById('top-products-container');
  if (topContainer) {
    if (sortedTop.length === 0) {
      topContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">No sales recorded yet.</p>`;
    } else {
      const maxSales = sortedTop[0][1] || 1;
      topContainer.innerHTML = sortedTop.map(([name, count]) => {
        const pct = ((count / maxSales) * 100).toFixed(1);
        return `
          <div class="stat-progress-item">
            <div class="stat-item-header">
              <span style="font-size: 12.5px;">${escapeHtml(name)}</span>
              <span>${count} units</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%; background: var(--savings-green);"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// ================= STORE SETTINGS & DATA BACKUP =================
function setupSettings() {
  const form = document.getElementById('store-settings-form');
  const nameInput = document.getElementById('set-store-name');
  const addrInput = document.getElementById('set-store-address');
  const phoneInput = document.getElementById('set-store-phone');
  const upiInput = document.getElementById('set-store-upi');
  const wishesInput = document.getElementById('set-store-wishes');

  const downloadBackupBtn = document.getElementById('download-backup-btn');
  const restoreInput = document.getElementById('restore-backup-input');
  const resetSampleBtn = document.getElementById('reset-sample-data-btn');

  // Fill current settings
  if (nameInput) nameInput.value = state.settings.storeName;
  if (addrInput) addrInput.value = state.settings.storeAddress;
  if (phoneInput) phoneInput.value = state.settings.storePhone;
  if (upiInput) upiInput.value = state.settings.storeUpi;
  if (wishesInput) wishesInput.value = state.settings.storeWishes;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.settings.storeName = nameInput.value.trim();
    state.settings.storeAddress = addrInput.value.trim();
    state.settings.storePhone = phoneInput.value.trim();
    state.settings.storeUpi = upiInput.value.trim();
    state.settings.storeWishes = wishesInput.value.trim();
    state.saveSettings();

    // Update banner UI
    document.querySelector('.store-title').textContent = state.settings.storeName;
    document.querySelector('.store-subtitle').innerHTML = `<i data-lucide="map-pin" class="mini-icon"></i> ${state.settings.storeAddress}`;
    if (window.lucide) window.lucide.createIcons();

    showToast('Store settings saved successfully!', 'success');
  });

  downloadBackupBtn?.addEventListener('click', () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      products: state.products,
      bills: state.bills,
      invoiceSeq: state.invoiceSeq
    };
    downloadFile(JSON.stringify(backupData, null, 2), `Super_Bachat_Bazzar_Backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    showToast('Backup JSON downloaded!', 'success');
  });

  restoreInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.products) state.products = data.products;
        if (data.bills) state.bills = data.bills;
        if (data.settings) state.settings = data.settings;
        if (data.invoiceSeq) state.invoiceSeq = data.invoiceSeq;

        state.saveProducts();
        state.saveBills();
        state.saveSettings();
        localStorage.setItem(STORAGE_KEYS.NEXT_INVOICE_NUM, state.invoiceSeq.toString());

        updateCounters();
        renderInventoryTable();
        renderQuickItems();
        renderHistoryTable();
        renderAnalytics();

        showToast('Store data restored successfully!', 'success');
      } catch (err) {
        showToast('Invalid backup JSON file!', 'error');
      }
    };
    reader.readAsText(file);
  });

  resetSampleBtn?.addEventListener('click', () => {
    if (confirm('This will replace current inventory with default Super Bachat Bazzar sample items. Continue?')) {
      state.products = [...SAMPLE_PRODUCTS];
      state.saveProducts();
      renderInventoryTable();
      renderQuickItems();
      showToast('Sample grocery inventory loaded!', 'success');
    }
  });
}

// ================= LIVE WEBCAM SCANNER MODULE =================
let activeScannerContext = 'pos'; // 'pos' or 'inward'

function openCameraScanner(context = 'pos') {
  activeScannerContext = context;
  const modal = document.getElementById('camera-modal');
  if (!modal) return;

  modal.classList.add('show');

  if (window.Html5Qrcode) {
    try {
      if (state.cameraScanner) {
        state.cameraScanner.stop().catch(() => {}).then(() => startScannerInstance());
      } else {
        startScannerInstance();
      }
    } catch (e) {
      console.warn('Camera start error:', e);
    }
  } else {
    showToast('Camera barcode library not available offline', 'error');
  }
}

function startScannerInstance() {
  const qrReader = new window.Html5Qrcode("camera-scanner-reader");
  state.cameraScanner = qrReader;

  const config = {
    fps: 10,
    qrbox: { width: 250, height: 200 },
    aspectRatio: 1.0
  };

  qrReader.start(
    { facingMode: "environment" },
    config,
    (decodedText) => {
      onBarcodeScannedFromCamera(decodedText);
    },
    (errorMessage) => {
      // Ignored for frame scans
    }
  ).catch(err => {
    console.warn('Unable to start camera stream:', err);
    showToast('Camera access blocked or not found', 'error');
  });
}

function onBarcodeScannedFromCamera(code) {
  closeCameraScanner();
  playSound('scan');

  if (activeScannerContext === 'pos') {
    handleBarcodeOrSearch(code);
  } else if (activeScannerContext === 'inward') {
    const barcodeInput = document.getElementById('prod-barcode');
    if (barcodeInput) {
      barcodeInput.value = code;
      showToast(`Scanned Barcode: ${code}`, 'success');
    }
  }
}

function closeCameraScanner() {
  const modal = document.getElementById('camera-modal');
  if (modal) modal.classList.remove('show');

  if (state.cameraScanner) {
    state.cameraScanner.stop().then(() => {
      state.cameraScanner.clear();
      state.cameraScanner = null;
    }).catch(() => {
      state.cameraScanner = null;
    });
  }
}

// ================= GLOBAL KEYBOARD SHORTCUTS =================
function setupGlobalShortcuts() {
  window.addEventListener('keydown', (e) => {
    // If in input field, don't hijack simple keys except function keys
    if (e.key === 'F2') {
      e.preventDefault();
      switchTab('pos');
      document.getElementById('barcode-input')?.focus();
    } else if (e.key === 'F4') {
      e.preventDefault();
      switchTab('pos');
      document.getElementById('barcode-input')?.focus();
    } else if (e.key === 'F8') {
      e.preventDefault();
      if (document.getElementById('view-pos')?.classList.contains('active')) {
        processCheckout(true);
      }
    } else if (e.key === 'F9') {
      e.preventDefault();
      openCameraScanner('pos');
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('show'));
      closeCameraScanner();
      const suggestions = document.getElementById('search-suggestions');
      if (suggestions) suggestions.style.display = 'none';
    }
  });
}

// Helper: Download text file
function downloadFile(content, fileName, mimeType) {
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
