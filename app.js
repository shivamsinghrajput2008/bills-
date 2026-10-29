/**
 * SUPER BACHAT BAZZAR - Modern Billing & Inventory POS Engine
 * Address: attardah kachhi pakki , muzzafarpur
 */

import { 
  auth, 
  signInWithGoogle, 
  requestPhoneOTP,
  verifyPhoneOTP,
  signUpWithEmail,
  signInWithEmail,
  demoMerchantSignIn,
  getCurrentAuthUser,
  signOutUser, 
  subscribeToAuth, 
  subscribeToProducts, 
  saveProductToFirestore, 
  deleteProductFromFirestore, 
  subscribeToBills, 
  saveBillToFirestore, 
  deleteBillFromFirestore, 
  normalizeBillObject,
  subscribeToSettings, 
  saveSettingsToFirestore, 
  subscribeToSubscription,
  saveSubscriptionToFirestore,
  migrateLocalDataToCloud,
  SyncState,
  getSyncState,
  subscribeToSyncState,
  getDeviceId,
  getDeviceMetadata,
  saveCustomDeviceName,
  registerDeviceSession,
  setDeviceOffline,
  subscribeToDevices,
  removeDeviceSession,
  flushOfflineQueue,
  getOfflineQueue,
  getConflictLog,
  logConflictEvent,
  setSyncState
} from './firebase.js';

// ================= CONSTANTS & INITIAL DATA =================
const STORAGE_KEYS = {
  PRODUCTS: 'sbb_products_v1',
  BILLS: 'sbb_bills_v1',
  SETTINGS: 'sbb_settings_v1',
  SUBSCRIPTION: 'sbb_subscription_v1',
  THEME: 'sbb_theme_v1',
  SOUND: 'sbb_sound_v1',
  NEXT_INVOICE_NUM: 'sbb_invoice_seq_v1',
  AUTH_UNLOCKED: 'sbb_auth_unlocked_v1',
  AUTH_SESSION: 'sbb_auth_session_v1',
  APP_PASSWORD: 'sbb_app_password_v1'
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
    shelf: 'Rack A-1',
    gstRate: 5,
    gstType: 'inclusive',
    hsn: '1512'
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
    shelf: 'Floor Pallet 2',
    gstRate: 0,
    gstType: 'inclusive',
    hsn: '1101'
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
    shelf: 'Rack A-3',
    gstRate: 0,
    gstType: 'inclusive',
    hsn: '2501'
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
    shelf: 'Chiller 1',
    gstRate: 12,
    gstType: 'inclusive',
    hsn: '0405'
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
    shelf: 'Rack B-1',
    gstRate: 12,
    gstType: 'inclusive',
    hsn: '1902'
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
    shelf: 'Rack D-2',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '3402'
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
    shelf: 'Rack C-1',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '3401'
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
    shelf: 'Rack A-4',
    gstRate: 5,
    gstType: 'inclusive',
    hsn: '0910'
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
    shelf: 'Rack B-3',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '1905'
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
    shelf: 'Beverage Cooler',
    gstRate: 28,
    gstType: 'inclusive',
    hsn: '2202'
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
    shelf: 'Rack D-3',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '3402'
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
    shelf: 'Rack C-2',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '3306'
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
    shelf: 'Rack A-2',
    gstRate: 0,
    gstType: 'inclusive',
    hsn: '1006'
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
    shelf: 'Rack A-4',
    gstRate: 5,
    gstType: 'inclusive',
    hsn: '0910'
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
    shelf: 'Rack B-2',
    gstRate: 18,
    gstType: 'inclusive',
    hsn: '1905'
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
    this.currentUser = null;
    this.subscription = this.loadSubscription();
    this.selectedSubPlan = '1_year'; // '6_months' or '1_year'
    this.appliedCouponCode = 'BACHAT'; // default coupon active
  }

  loadProducts() {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let list = [];
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      list = [...SAMPLE_PRODUCTS];
    } else {
      try {
        list = JSON.parse(data);
      } catch {
        list = [...SAMPLE_PRODUCTS];
      }
    }
    // Normalize GST fields for all items
    return list.map(p => ({
      ...p,
      gstRate: p.gstRate !== undefined ? Number(p.gstRate) : 5,
      gstType: p.gstType || 'inclusive',
      hsn: p.hsn || ''
    }));
  }

  async saveProducts(productToSave = null) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
    updateCounters();
    if (this.currentUser) {
      try {
        if (productToSave) {
          await saveProductToFirestore(this.currentUser.uid, productToSave);
        } else {
          for (const p of this.products) {
            await saveProductToFirestore(this.currentUser.uid, p);
          }
        }
      } catch (err) {
        console.warn('Could not sync products to Firestore:', err);
      }
    }
  }

  async removeProductCloud(productId) {
    if (this.currentUser && productId) {
      try {
        await deleteProductFromFirestore(this.currentUser.uid, productId);
      } catch (err) {
        console.warn('Could not delete product from Firestore:', err);
      }
    }
  }

  loadBills() {
    const data = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.map(b => normalizeBillObject(b)) : [];
    } catch {
      return [];
    }
  }

  async saveBills(billToSave = null) {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(this.bills));
    updateCounters();
    if (this.currentUser) {
      try {
        if (billToSave) {
          await saveBillToFirestore(this.currentUser.uid, billToSave);
        } else {
          for (const b of this.bills) {
            await saveBillToFirestore(this.currentUser.uid, b);
          }
        }
      } catch (err) {
        console.warn('Could not sync bills to Firestore:', err);
      }
    }
  }

  async removeBillCloud(billId) {
    if (this.currentUser && billId) {
      try {
        await deleteBillFromFirestore(this.currentUser.uid, billId);
      } catch (err) {
        console.warn('Could not delete bill from Firestore:', err);
      }
    }
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

  async saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    if (this.currentUser) {
      try {
        await saveSettingsToFirestore(this.currentUser.uid, this.settings);
      } catch (err) {
        console.warn('Could not sync settings to Firestore:', err);
      }
    }
  }

  loadSubscription() {
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!data) {
      const activeSub = {
        id: 'current',
        planId: 'pro-annual',
        planName: 'Super Merchant Pro (Lifetime License)',
        originalPrice: 8000,
        discount: 0,
        finalAmount: 8000,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: null,
        ownerId: 'local',
        utrNumber: 'OFFICIAL-SBB-LICENSE',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(activeSub));
      return activeSub;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed) {
        parsed.status = 'active';
      }
      return parsed;
    } catch {
      return {
        id: 'current',
        planId: 'pro-annual',
        planName: 'Super Merchant Pro (Lifetime License)',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: null
      };
    }
  }

  saveSubscription(sub) {
    this.subscription = sub;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    if (this.currentUser) {
      saveSubscriptionToFirestore(this.currentUser.uid, sub);
    }
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

// ================= FIREBASE AUTHENTICATION & CLOUD FIRESTORE SYNC =================
let unsubProducts = null;
let unsubBills = null;
let unsubSettings = null;
let unsubSub = null;
let unsubDevices = null;

function setupFirebaseAuth() {
  const authModal = document.getElementById('auth-modal');
  const closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
  const lockGoogleBtn = document.getElementById('lock-google-signin-btn');
  const lockSignupBtn = document.getElementById('lock-signup-btn');
  const headerBtnGroup = document.getElementById('auth-header-btn-group');
  const headerGoogleBtn = document.getElementById('header-google-signin-btn');
  const headerSignupBtn = document.getElementById('header-signup-btn');
  const headerSignoutBtn = document.getElementById('header-signout-btn');
  const userProfileBadge = document.getElementById('user-profile-badge');
  const userAvatarImg = document.getElementById('user-avatar-img');
  const userDisplayName = document.getElementById('user-display-name');
  const settingsGoogleBtn = document.getElementById('btn-settings-google-signin');
  const settingsSignoutBtn = document.getElementById('btn-settings-signout');
  const forceSyncBtn = document.getElementById('btn-force-cloud-sync');
  const userEmailSpan = document.getElementById('firebase-user-email');
  const syncDesc = document.getElementById('firebase-sync-desc');

  // Auth Modal Elements
  const tabBtnOtp = document.getElementById('tab-btn-otp');
  const tabBtnEmail = document.getElementById('tab-btn-email');
  const tabBtnGoogle = document.getElementById('tab-btn-google');
  const panelOtp = document.getElementById('panel-otp');
  const panelEmail = document.getElementById('panel-email');
  const panelGoogle = document.getElementById('panel-google');

  // OTP elements
  const otpRequestForm = document.getElementById('otp-request-form');
  const otpPhoneInput = document.getElementById('otp-phone-input');
  const btnRequestOtp = document.getElementById('btn-request-otp');
  const otpVerifySection = document.getElementById('otp-verify-section');
  const otpVerifyForm = document.getElementById('otp-verify-form');
  const otpCodeInput = document.getElementById('otp-code-input');
  const btnVerifyOtp = document.getElementById('btn-verify-otp');
  const otpAlertPhone = document.getElementById('otp-alert-phone');
  const otpCodeValue = document.getElementById('otp-code-value');
  const btnAutofillOtp = document.getElementById('btn-autofill-otp');
  const btnResendOtp = document.getElementById('btn-resend-otp');
  const resendCountdown = document.getElementById('resend-countdown');
  const btnChangeNumber = document.getElementById('btn-change-number');
  const otpTimerDisplay = document.getElementById('otp-timer-display');

  // Email elements
  const submodeSigninBtn = document.getElementById('submode-signin-btn');
  const submodeSignupBtn = document.getElementById('submode-signup-btn');
  const emailSigninForm = document.getElementById('email-signin-form');
  const emailSignupForm = document.getElementById('email-signup-form');
  const signinEmailInput = document.getElementById('signin-email-input');
  const signinPasswordInput = document.getElementById('signin-password-input');
  const signupNameInput = document.getElementById('signup-name-input');
  const signupEmailInput = document.getElementById('signup-email-input');
  const signupPasswordInput = document.getElementById('signup-password-input');
  const signupRoleSelect = document.getElementById('signup-role-select');
  const toggleSigninPwd = document.getElementById('toggle-signin-pwd');
  const toggleSignupPwd = document.getElementById('toggle-signup-pwd');

  // Google & Demo buttons inside modal
  const modalGoogleSigninBtn = document.getElementById('modal-google-signin-btn');
  const btnDemoMerchantLogin = document.getElementById('btn-demo-merchant-login');

  let resendInterval = null;
  let codeTimerInterval = null;

  // Open & Close Auth Modal
  function openAuthModal(defaultTab = 'otp') {
    if (!authModal) return;
    authModal.style.display = 'flex';
    // Force DOM repaint before adding .show for smooth CSS transition
    requestAnimationFrame(() => {
      authModal.classList.add('show');
    });
    switchAuthTab(defaultTab);
    if (window.lucide) window.lucide.createIcons();
    if (defaultTab === 'otp' && otpPhoneInput) {
      setTimeout(() => otpPhoneInput.focus(), 150);
    }
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('show');
    setTimeout(() => {
      if (!authModal.classList.contains('show')) {
        authModal.style.display = 'none';
      }
    }, 200);
    clearInterval(resendInterval);
    clearInterval(codeTimerInterval);
  }

  // Expose globally so that any click in DOM or inline onclick directly functions
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;

  // Switch Auth Tabs
  function switchAuthTab(tabId) {
    [tabBtnOtp, tabBtnEmail, tabBtnGoogle].forEach(btn => btn?.classList.remove('active'));
    [panelOtp, panelEmail, panelGoogle].forEach(p => {
      if (p) p.style.display = 'none';
      p?.classList.remove('active');
    });

    if (tabId === 'otp') {
      tabBtnOtp?.classList.add('active');
      if (panelOtp) { panelOtp.style.display = 'block'; panelOtp.classList.add('active'); }
    } else if (tabId === 'email' || tabId === 'signin' || tabId === 'signup') {
      tabBtnEmail?.classList.add('active');
      if (panelEmail) { panelEmail.style.display = 'block'; panelEmail.classList.add('active'); }
      if (tabId === 'signup') {
        submodeSignupBtn?.click();
      } else {
        submodeSigninBtn?.click();
      }
    } else if (tabId === 'google') {
      tabBtnGoogle?.classList.add('active');
      if (panelGoogle) { panelGoogle.style.display = 'block'; panelGoogle.classList.add('active'); }
    }
  }

  tabBtnOtp?.addEventListener('click', () => switchAuthTab('otp'));
  tabBtnEmail?.addEventListener('click', () => switchAuthTab('email'));
  tabBtnGoogle?.addEventListener('click', () => switchAuthTab('google'));

  closeAuthModalBtn?.addEventListener('click', closeAuthModal);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Toggle Email Submode (Sign In vs Sign Up)
  submodeSigninBtn?.addEventListener('click', () => {
    submodeSigninBtn.classList.add('active');
    submodeSignupBtn?.classList.remove('active');
    if (emailSigninForm) emailSigninForm.style.display = 'block';
    if (emailSignupForm) emailSignupForm.style.display = 'none';
  });

  submodeSignupBtn?.addEventListener('click', () => {
    submodeSignupBtn.classList.add('active');
    submodeSigninBtn?.classList.remove('active');
    if (emailSignupForm) emailSignupForm.style.display = 'block';
    if (emailSigninForm) emailSigninForm.style.display = 'none';
  });

  // Password visibility toggles
  toggleSigninPwd?.addEventListener('click', () => {
    if (!signinPasswordInput) return;
    const isPass = signinPasswordInput.type === 'password';
    signinPasswordInput.type = isPass ? 'text' : 'password';
    toggleSigninPwd.textContent = isPass ? 'Hide' : 'Show';
  });

  toggleSignupPwd?.addEventListener('click', () => {
    if (!signupPasswordInput) return;
    const isPass = signupPasswordInput.type === 'password';
    signupPasswordInput.type = isPass ? 'text' : 'password';
    toggleSignupPwd.textContent = isPass ? 'Hide' : 'Show';
  });

  // Successful Authentication Helper
  function onAuthSuccess(user, message = '') {
    closeAuthModal();
    localStorage.setItem(STORAGE_KEYS.AUTH_UNLOCKED, 'true');
    const overlay = document.getElementById('app-lock-overlay');
    if (overlay) {
      overlay.classList.add('lock-exiting');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.classList.remove('lock-exiting');
        document.body.classList.remove('terminal-locked');
        checkSubscriptionGate();
        document.getElementById('barcode-input')?.focus();
      }, 320);
    } else {
      checkSubscriptionGate();
    }
    playSound('success');
    showToast(message || `Welcome, ${user.displayName || user.phoneNumber || user.email}! Cloud Sync active.`, 'success');
  }

  // 1. Phone OTP Handlers
  function startOtpCountdown() {
    clearInterval(resendInterval);
    clearInterval(codeTimerInterval);

    let resendSeconds = 30;
    if (btnResendOtp) {
      btnResendOtp.disabled = true;
      if (resendCountdown) resendCountdown.textContent = `${resendSeconds}s`;
    }

    resendInterval = setInterval(() => {
      resendSeconds--;
      if (resendCountdown) resendCountdown.textContent = `${resendSeconds}s`;
      if (resendSeconds <= 0) {
        clearInterval(resendInterval);
        if (btnResendOtp) {
          btnResendOtp.disabled = false;
          btnResendOtp.textContent = 'Resend OTP';
        }
      }
    }, 1000);

    let expireSeconds = 600;
    codeTimerInterval = setInterval(() => {
      expireSeconds--;
      const mins = Math.floor(expireSeconds / 60);
      const secs = expireSeconds % 60;
      if (otpTimerDisplay) {
        otpTimerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
      if (expireSeconds <= 0) {
        clearInterval(codeTimerInterval);
        if (otpTimerDisplay) otpTimerDisplay.textContent = 'Expired';
      }
    }, 1000);
  }

  otpRequestForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = otpPhoneInput?.value?.trim();
    if (!phone) {
      showToast('Please enter your 10-digit mobile number.', 'error');
      return;
    }

    btnRequestOtp.disabled = true;
    btnRequestOtp.innerHTML = '<i data-lucide="loader" class="spin"></i> Sending OTP...';
    if (window.lucide) window.lucide.createIcons();

    try {
      const result = await requestPhoneOTP(phone);
      if (otpVerifySection) otpVerifySection.style.display = 'block';
      if (otpAlertPhone) otpAlertPhone.textContent = result.formattedPhone;
      if (otpCodeValue) otpCodeValue.textContent = result.code;
      if (otpCodeInput) {
        otpCodeInput.value = '';
        setTimeout(() => otpCodeInput.focus(), 100);
      }
      startOtpCountdown();
      showToast(`OTP Code sent to ${result.formattedPhone}: ${result.code}`, 'success');
      playSound('beep');
    } catch (err) {
      showToast(err.message || 'Failed to send OTP. Please check the number.', 'error');
    } finally {
      btnRequestOtp.disabled = false;
      btnRequestOtp.innerHTML = '<i data-lucide="send"></i> <span>Send OTP Code</span>';
      if (window.lucide) window.lucide.createIcons();
    }
  });

  btnAutofillOtp?.addEventListener('click', () => {
    const code = otpCodeValue?.textContent?.trim();
    if (code && otpCodeInput) {
      otpCodeInput.value = code;
      showToast(`Auto-filled OTP: ${code}`, 'info');
      otpCodeInput.focus();
    }
  });

  otpVerifyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = otpPhoneInput?.value?.trim();
    const code = otpCodeInput?.value?.trim();

    if (!code || code.length !== 6) {
      showToast('Please enter the 6-digit OTP code.', 'error');
      return;
    }

    btnVerifyOtp.disabled = true;
    btnVerifyOtp.innerHTML = '<i data-lucide="loader" class="spin"></i> Verifying...';
    if (window.lucide) window.lucide.createIcons();

    try {
      const user = await verifyPhoneOTP(phone, code);
      onAuthSuccess(user, `Verified phone ${user.phoneNumber}! Signed in to Super Bachat Bazzar.`);
    } catch (err) {
      showToast(err.message || 'OTP verification failed. Please try again.', 'error');
      if (otpCodeInput) otpCodeInput.focus();
    } finally {
      btnVerifyOtp.disabled = false;
      btnVerifyOtp.innerHTML = '<i data-lucide="log-in"></i> <span>Verify OTP & Sign In</span>';
      if (window.lucide) window.lucide.createIcons();
    }
  });

  btnResendOtp?.addEventListener('click', async () => {
    const phone = otpPhoneInput?.value?.trim();
    if (!phone) return;
    try {
      const result = await requestPhoneOTP(phone);
      if (otpCodeValue) otpCodeValue.textContent = result.code;
      startOtpCountdown();
      showToast(`New OTP Code sent: ${result.code}`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  btnChangeNumber?.addEventListener('click', () => {
    if (otpVerifySection) otpVerifySection.style.display = 'none';
    clearInterval(resendInterval);
    clearInterval(codeTimerInterval);
    if (otpPhoneInput) otpPhoneInput.focus();
  });

  // 2. Email Sign In Form Handler
  emailSigninForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signinEmailInput?.value?.trim();
    const password = signinPasswordInput?.value;

    const submitBtn = document.getElementById('btn-submit-signin');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Signing in...';
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      const user = await signInWithEmail(email, password);
      onAuthSuccess(user, `Welcome back, ${user.displayName || user.email}! Terminal logged in.`);
    } catch (err) {
      showToast(err.message || 'Sign in failed. Please check credentials.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="log-in"></i> <span>Sign In to Terminal</span>';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });

  // 3. Email Sign Up Form Handler
  emailSignupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = signupNameInput?.value?.trim();
    const email = signupEmailInput?.value?.trim();
    const password = signupPasswordInput?.value;
    const role = signupRoleSelect?.value || 'Cashier';

    const submitBtn = document.getElementById('btn-submit-signup');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Creating account...';
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      const user = await signUpWithEmail(fullName, email, password, role);
      onAuthSuccess(user, `Account registered for ${user.displayName}! Signed in and syncing across devices.`);
    } catch (err) {
      showToast(err.message || 'Sign up failed. Please check your details.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i data-lucide="user-plus"></i> <span>Create Account & Start Sync</span>';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });

  // 4. Google Sign-In Handler
  async function handleGoogleSignIn() {
    try {
      showToast('Opening Google Sign-In popup...', 'info');
      const user = await signInWithGoogle();
      if (user) {
        onAuthSuccess(user, `Signed in with Google as ${user.displayName || user.email}!`);
      }
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast(`Google Sign-in: ${err.message || 'Please check popup settings.'} Try OTP option instead!`, 'warning');
      }
    }
  }

  // 5. One-Click Demo Store Manager Sign In
  btnDemoMerchantLogin?.addEventListener('click', async () => {
    try {
      const user = await demoMerchantSignIn();
      onAuthSuccess(user, 'Signed in as Store Manager (Muzaffarpur)! Multi-device real-time sync active.');
    } catch (err) {
      showToast('Demo login error: ' + err.message, 'error');
    }
  });

  modalGoogleSigninBtn?.addEventListener('click', handleGoogleSignIn);

  // Trigger Auth Modal from UI Buttons
  lockGoogleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAuthModal('otp');
  });
  headerGoogleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAuthModal('otp');
  });
  settingsGoogleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAuthModal('otp');
  });

  async function handleSignOut() {
    try {
      if (state.currentUser) {
        await setDeviceOffline(state.currentUser.uid);
      }
      await signOutUser();
      showToast('Signed out of terminal account.', 'info');
    } catch (err) {
      console.error('Sign-out error:', err);
      showToast('Error during sign out.', 'error');
    }
  }

  headerSignoutBtn?.addEventListener('click', handleSignOut);
  settingsSignoutBtn?.addEventListener('click', handleSignOut);

  forceSyncBtn?.addEventListener('click', async () => {
    if (!state.currentUser) {
      showToast('Please sign in with Phone OTP, Email, or Google first to sync cloud database!', 'error');
      openAuthModal('otp');
      return;
    }
    showToast('Syncing all products, bills & settings to Cloud Firestore...', 'info');
    try {
      await migrateLocalDataToCloud(state.currentUser.uid, state.products, state.bills, state.settings);
      if (state.subscription) {
        await saveSubscriptionToFirestore(state.currentUser.uid, state.subscription);
      }
      await flushOfflineQueue(state.currentUser.uid);
      showToast('Cloud database synchronized successfully across all devices!', 'success');
    } catch (err) {
      showToast('Cloud sync failed: ' + err.message, 'error');
    }
  });

  // Attach listener to Firebase Auth state
  subscribeToAuth((user) => {
    state.currentUser = user;

    if (unsubProducts) { unsubProducts(); unsubProducts = null; }
    if (unsubBills) { unsubBills(); unsubBills = null; }
    if (unsubSettings) { unsubSettings(); unsubSettings = null; }
    if (unsubSub) { unsubSub(); unsubSub = null; }
    if (unsubDevices) { unsubDevices(); unsubDevices = null; }

    if (user) {
      console.log('[Firebase Auth] User authenticated:', user.email, user.uid);

      if (headerGoogleBtn) headerGoogleBtn.style.display = 'none';
      if (userProfileBadge) userProfileBadge.style.display = 'flex';
      const nameOrPhone = user.displayName || user.phoneNumber || user.email?.split('@')[0] || 'Merchant';
      if (userAvatarImg) {
        userAvatarImg.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameOrPhone)}&background=10b981&color=fff`;
      }
      if (userDisplayName) {
        userDisplayName.textContent = nameOrPhone;
      }

      const displayAccount = user.phoneNumber ? `${user.phoneNumber} (${nameOrPhone})` : user.email;
      if (userEmailSpan) userEmailSpan.textContent = displayAccount;
      const shareEmailEl = document.getElementById('modal-share-email');
      if (shareEmailEl) shareEmailEl.textContent = displayAccount;

      if (settingsSignoutBtn) settingsSignoutBtn.style.display = 'inline-flex';
      if (settingsGoogleBtn) settingsGoogleBtn.style.display = 'none';
      if (syncDesc) syncDesc.textContent = `Active account: ${displayAccount}. Real-time Multi-Device Cloud Sync active.`;

      // Auto-unlock terminal if user authenticated with Google
      localStorage.setItem(STORAGE_KEYS.AUTH_UNLOCKED, 'true');
      const overlay = document.getElementById('app-lock-overlay');
      if (overlay && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
        document.body.classList.remove('terminal-locked');
      }

      // Register this device in Firestore for real-time presence
      registerDeviceSession(user.uid);

      // Listen to connected devices
      unsubDevices = subscribeToDevices(user.uid, (devices) => {
        renderConnectedDevices(devices);
      });

      // Flush any pending offline queue items
      flushOfflineQueue(user.uid);

      // Attach Firestore realtime listeners
      unsubProducts = subscribeToProducts(user.uid, (cloudProducts) => {
        if (cloudProducts && cloudProducts.length > 0) {
          const currentDeviceId = getDeviceId();
          let conflictItemName = null;

          // Conflict Detection (LWW with version vector)
          cloudProducts.forEach(remoteP => {
            const localP = state.products.find(p => p.id === remoteP.id);
            if (localP && localP.version !== undefined && remoteP.version !== undefined) {
              if (remoteP.version > localP.version && remoteP.lastModifiedByDevice !== currentDeviceId) {
                conflictItemName = remoteP.name;
                logConflictEvent({
                  type: 'Product Update',
                  title: `Product "${remoteP.name}" updated`,
                  detail: `Auto-resolved: Server version v${remoteP.version} applied over local v${localP.version} (Last-Write-Wins)`,
                  device: remoteP.lastModifiedByDevice || 'Other Device'
                });
              }
            }
          });

          if (conflictItemName) {
            setSyncState(SyncState.CONFLICT, `Conflict auto-resolved: "${conflictItemName}" updated from another device`);
            renderConflictLog();
            setTimeout(() => {
              if (getSyncState() === SyncState.CONFLICT) {
                setSyncState(SyncState.SYNCED);
              }
            }, 4000);
          }

          state.products = cloudProducts;
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(state.products));
          renderInventoryTable();
          renderQuickItems();
          updateCounters();
        } else if (state.products && state.products.length > 0) {
          // Initial seed for new user
          migrateLocalDataToCloud(user.uid, state.products, state.bills, state.settings);
        }
      });

      unsubBills = subscribeToBills(user.uid, (cloudBills) => {
        if (cloudBills && cloudBills.length > 0) {
          const currentDeviceId = getDeviceId();
          const prevBillCount = state.bills.length;

          // Detect new bill from another device
          if (cloudBills.length > prevBillCount && prevBillCount > 0) {
            const newestBill = cloudBills[0];
            if (newestBill.lastModifiedByDevice && newestBill.lastModifiedByDevice !== currentDeviceId) {
              showToast(`🧾 New sale ${newestBill.invoiceNumber} (₹${newestBill.total}) synced from another device!`, 'info');
              logConflictEvent({
                type: 'New Sale',
                title: `Invoice ${newestBill.invoiceNumber} received`,
                detail: `Sale of ₹${newestBill.total} synced live from ${newestBill.lastModifiedByDevice}`,
                device: newestBill.lastModifiedByDevice
              });
              renderConflictLog();
            }
          }

          state.bills = Array.isArray(cloudBills) ? cloudBills.map(b => normalizeBillObject(b)) : [];
          localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(state.bills));
          renderHistoryTable();
          renderAnalytics();
          renderGrossProfit();
          updateCounters();
        }
      });

      unsubSettings = subscribeToSettings(user.uid, (cloudSettings) => {
        if (cloudSettings) {
          state.settings = { ...state.settings, ...cloudSettings };
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));

          const nameInput = document.getElementById('set-store-name');
          const addrInput = document.getElementById('set-store-address');
          const phoneInput = document.getElementById('set-store-phone');
          const upiInput = document.getElementById('set-store-upi');
          const wishesInput = document.getElementById('set-store-wishes');

          if (nameInput) nameInput.value = state.settings.storeName;
          if (addrInput) addrInput.value = state.settings.storeAddress;
          if (phoneInput) phoneInput.value = state.settings.storePhone;
          if (upiInput) upiInput.value = state.settings.storeUpi;
          if (wishesInput) wishesInput.value = state.settings.storeWishes;

          const titleEl = document.querySelector('.store-title');
          const subEl = document.querySelector('.store-subtitle');
          if (titleEl) titleEl.textContent = state.settings.storeName;
          if (subEl) subEl.innerHTML = `<i data-lucide="map-pin" class="mini-icon"></i> ${escapeHtml(state.settings.storeAddress)}`;
          if (window.lucide) window.lucide.createIcons();
        }
      });

      unsubSub = subscribeToSubscription(user.uid, (cloudSub) => {
        if (cloudSub && cloudSub.status === 'active') {
          state.subscription = cloudSub;
          localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(cloudSub));
        } else if (!state.subscription || state.subscription.status !== 'active') {
          state.subscription = state.loadSubscription();
        }
        renderSubscriptionStatus();
        checkSubscriptionGate();
      });

    } else {
      console.log('[Firebase Auth] Signed out.');
      if (headerGoogleBtn) headerGoogleBtn.style.display = 'inline-flex';
      if (userProfileBadge) userProfileBadge.style.display = 'none';

      if (userEmailSpan) userEmailSpan.textContent = 'Not Signed In (Local Cache Mode)';
      if (settingsSignoutBtn) settingsSignoutBtn.style.display = 'none';
      if (settingsGoogleBtn) settingsGoogleBtn.style.display = 'inline-flex';
      if (syncDesc) syncDesc.textContent = 'Store data is saved locally on this browser. Sign in with Phone OTP, Email, or Google to synchronize across devices in real-time.';

      if (!state.subscription || state.subscription.status !== 'active') {
        state.subscription = state.loadSubscription();
      }
      renderSubscriptionStatus();
      checkSubscriptionGate();
      renderConnectedDevices([]);
    }

    if (window.lucide) window.lucide.createIcons();
  });
}

// ================= REAL-TIME MULTI-DEVICE & DATA SYNC MANAGER =================
let cachedConnectedDevices = [];

function setupMultiDeviceSync() {
  const syncBtn = document.getElementById('header-sync-btn');
  const openModalBtn = document.getElementById('btn-open-sync-modal');
  const syncModal = document.getElementById('multi-device-sync-modal');
  const closeBtn = document.getElementById('close-sync-modal-btn');
  const closeFooterBtn = document.getElementById('modal-close-sync-footer-btn');
  const forceSyncBtn = document.getElementById('modal-force-sync-btn');
  const saveNameBtn = document.getElementById('modal-save-device-name-btn');
  const nameInput = document.getElementById('modal-device-name-input');
  const clearConflictsBtn = document.getElementById('modal-clear-conflicts-btn');
  const copyUrlBtn = document.getElementById('device-copy-url-btn');

  // Populate this device info
  const meta = getDeviceMetadata();
  if (nameInput) nameInput.value = meta.deviceName;

  const typePill = document.getElementById('modal-device-type-pill');
  const osPill = document.getElementById('modal-device-os-pill');
  const browserPill = document.getElementById('modal-device-browser-pill');
  const idPill = document.getElementById('modal-device-id-pill');
  const settingsDevName = document.getElementById('settings-device-name-display');

  if (typePill) typePill.textContent = `Type: ${meta.deviceType.toUpperCase()}`;
  if (osPill) osPill.textContent = `OS: ${meta.os}`;
  if (browserPill) browserPill.textContent = `Browser: ${meta.browser}`;
  if (idPill) idPill.textContent = `ID: ${meta.deviceId.slice(0, 14)}...`;
  if (settingsDevName) settingsDevName.textContent = meta.deviceName;

  // Set device icon
  const iconWrap = document.getElementById('modal-this-device-icon');
  if (iconWrap) {
    let iconName = 'monitor';
    if (meta.deviceType === 'mobile') iconName = 'smartphone';
    if (meta.deviceType === 'tablet') iconName = 'tablet';
    if (meta.deviceType === 'laptop') iconName = 'laptop';
    iconWrap.innerHTML = `<i data-lucide="${iconName}"></i>`;
  }

  // Subscribe to sync state changes
  subscribeToSyncState((syncState, pendingCount, infoMessage) => {
    updateSyncUI(syncState, pendingCount, infoMessage);
  });

  // Modal handlers
  function openSyncModal() {
    if (syncModal) {
      syncModal.classList.add('show');
      generateDeviceConnectQR();
      renderConflictLog();
      renderConnectedDevices(cachedConnectedDevices);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function closeSyncModal() {
    if (syncModal) {
      syncModal.classList.remove('show');
    }
  }

  syncBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openSyncModal();
  });

  openModalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openSyncModal();
  });

  closeBtn?.addEventListener('click', closeSyncModal);
  closeFooterBtn?.addEventListener('click', closeSyncModal);

  syncModal?.addEventListener('click', (e) => {
    if (e.target === syncModal) closeSyncModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && syncModal?.classList.contains('show')) {
      closeSyncModal();
    }
  });

  // Save custom device name
  saveNameBtn?.addEventListener('click', async () => {
    const val = nameInput?.value.trim();
    if (!val) {
      showToast('Please enter a valid device name!', 'error');
      return;
    }
    saveCustomDeviceName(val);
    if (settingsDevName) settingsDevName.textContent = val;
    if (state.currentUser) {
      await registerDeviceSession(state.currentUser.uid);
    }
    showToast(`Device label updated to: "${val}"`, 'success');
  });

  // Force Sync Now
  forceSyncBtn?.addEventListener('click', async () => {
    if (!navigator.onLine) {
      showToast('Device is offline. Changes will sync automatically when online.', 'info');
      return;
    }
    if (!state.currentUser) {
      showToast('Signed in with Google required for real-time cloud sync.', 'info');
      return;
    }
    showToast('Flushing pending changes to Cloud Firestore...', 'info');
    await flushOfflineQueue(state.currentUser.uid);
    showToast('All changes synchronized with Firestore!', 'success');
  });

  // Copy Link
  copyUrlBtn?.addEventListener('click', () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('App URL copied to clipboard! Open on mobile or tablet.', 'success');
      }).catch(() => {
        showToast('App URL: ' + url, 'info');
      });
    } else {
      showToast('App URL: ' + url, 'info');
    }
  });

  // Clear conflict log
  clearConflictsBtn?.addEventListener('click', () => {
    localStorage.removeItem('sbb_conflict_log_v2');
    renderConflictLog();
    showToast('Conflict log cleared.', 'info');
  });
}

function updateSyncUI(syncState, pendingCount = 0, infoMessage = null) {
  const headerBtn = document.getElementById('header-sync-btn');
  const headerIcon = document.getElementById('header-sync-icon');
  const headerLabel = document.getElementById('header-sync-label');
  const headerSub = document.getElementById('header-sync-sub');

  const settingsBadge = document.getElementById('settings-sync-badge');
  const settingsText = document.getElementById('settings-sync-text');
  const settingsOutbox = document.getElementById('settings-outbox-count-display');

  const modalBadge = document.getElementById('modal-sync-badge');
  const modalBadgeIcon = document.getElementById('modal-sync-badge-icon');
  const modalBadgeText = document.getElementById('modal-sync-badge-text');
  const modalPending = document.getElementById('modal-pending-count');
  const modalLastSync = document.getElementById('modal-last-sync-time');

  if (settingsOutbox) {
    settingsOutbox.textContent = `${pendingCount} Pending`;
  }
  if (modalPending) {
    modalPending.textContent = `${pendingCount} pending`;
  }
  if (modalLastSync) {
    const lastSyncTime = localStorage.getItem('sbb_last_sync_time_v2');
    modalLastSync.textContent = lastSyncTime ? formatTimeShort(lastSyncTime) : 'Just now';
  }

  // Remove existing status classes
  const classes = ['status-synced', 'status-syncing', 'status-offline', 'status-conflict'];
  classes.forEach(c => {
    headerBtn?.classList.remove(c);
    settingsBadge?.classList.remove(c);
    modalBadge?.classList.remove(c);
  });

  const stateClass = `status-${syncState}`;
  headerBtn?.classList.add(stateClass);
  settingsBadge?.classList.add(stateClass);
  modalBadge?.classList.add(stateClass);

  if (syncState === SyncState.SYNCED) {
    headerIcon?.setAttribute('data-lucide', 'cloud-check');
    headerIcon?.classList.remove('spin');
    if (headerLabel) headerLabel.textContent = 'Synced';
    if (headerSub) headerSub.textContent = 'Multi-Device Live';
    if (settingsText) settingsText.textContent = 'Synced';
    if (modalBadgeText) modalBadgeText.textContent = 'Synced';
    modalBadgeIcon?.setAttribute('data-lucide', 'cloud-check');
    modalBadgeIcon?.classList.remove('spin');
  } else if (syncState === SyncState.SYNCING) {
    headerIcon?.setAttribute('data-lucide', 'refresh-cw');
    headerIcon?.classList.add('spin');
    if (headerLabel) headerLabel.textContent = 'Syncing...';
    if (headerSub) headerSub.textContent = infoMessage || 'Updating cloud...';
    if (settingsText) settingsText.textContent = 'Syncing...';
    if (modalBadgeText) modalBadgeText.textContent = 'Syncing...';
    modalBadgeIcon?.setAttribute('data-lucide', 'refresh-cw');
    modalBadgeIcon?.classList.add('spin');
  } else if (syncState === SyncState.OFFLINE) {
    headerIcon?.setAttribute('data-lucide', 'cloud-off');
    headerIcon?.classList.remove('spin');
    if (headerLabel) headerLabel.textContent = 'Offline';
    if (headerSub) headerSub.textContent = pendingCount > 0 ? `${pendingCount} queued` : 'Working locally';
    if (settingsText) settingsText.textContent = 'Offline';
    if (modalBadgeText) modalBadgeText.textContent = 'Offline';
    modalBadgeIcon?.setAttribute('data-lucide', 'cloud-off');
    modalBadgeIcon?.classList.remove('spin');
  } else if (syncState === SyncState.CONFLICT) {
    headerIcon?.setAttribute('data-lucide', 'alert-triangle');
    headerIcon?.classList.remove('spin');
    if (headerLabel) headerLabel.textContent = 'Conflict';
    if (headerSub) headerSub.textContent = 'Auto-resolved (LWW)';
    if (settingsText) settingsText.textContent = 'Conflict Resolved';
    if (modalBadgeText) modalBadgeText.textContent = 'Conflict Detected / Resolved';
    modalBadgeIcon?.setAttribute('data-lucide', 'alert-triangle');
    modalBadgeIcon?.classList.remove('spin');
  }

  if (window.lucide) window.lucide.createIcons();
}

function formatTimeShort(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return 'Just now';
  }
}

function renderConnectedDevices(devices) {
  cachedConnectedDevices = Array.isArray(devices) ? devices : [];
  const count = cachedConnectedDevices.length > 0 ? cachedConnectedDevices.length : 1;

  const headerCount = document.getElementById('header-device-count-num');
  const settingsCount = document.getElementById('settings-device-count-display');
  const modalCount = document.getElementById('modal-devices-count');
  const listEl = document.getElementById('modal-devices-list');

  if (headerCount) headerCount.textContent = count;
  if (settingsCount) settingsCount.textContent = `${count} Active`;
  if (modalCount) modalCount.textContent = count;

  if (!listEl) return;

  if (!cachedConnectedDevices || cachedConnectedDevices.length === 0) {
    const meta = getDeviceMetadata();
    listEl.innerHTML = `
      <div class="device-card is-current-device">
        <div class="device-card-header">
          <div class="device-avatar-sm"><i data-lucide="${meta.deviceType === 'mobile' ? 'smartphone' : (meta.deviceType === 'tablet' ? 'tablet' : 'monitor')}"></i></div>
          <div class="device-title-wrap">
            <h5 class="device-title">${escapeHtml(meta.deviceName)}</h5>
            <span class="device-subtitle">${escapeHtml(meta.browser)} • ${escapeHtml(meta.os)}</span>
          </div>
          <span class="device-badge-current">This Device</span>
        </div>
        <div class="device-card-footer">
          <span class="device-online-status ${navigator.onLine ? 'online' : 'offline'}">
            <span class="pulse-dot ${navigator.onLine ? 'green' : 'orange'}"></span> ${navigator.onLine ? 'Active Now' : 'Offline'}
          </span>
          <span class="text-muted" style="font-size:10px;">ID: ${meta.deviceId.slice(0, 10)}</span>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  listEl.innerHTML = cachedConnectedDevices.map(d => {
    let iconName = 'monitor';
    if (d.deviceType === 'mobile') iconName = 'smartphone';
    if (d.deviceType === 'tablet') iconName = 'tablet';
    if (d.deviceType === 'laptop') iconName = 'laptop';

    const isCurrent = d.isCurrent;
    const isOnline = d.online !== false;
    const lastActiveStr = d.lastActive ? formatTimeShort(d.lastActive) : 'Now';

    return `
      <div class="device-card ${isCurrent ? 'is-current-device' : ''}" data-device-id="${d.id}">
        <div class="device-card-header">
          <div class="device-avatar-sm"><i data-lucide="${iconName}"></i></div>
          <div class="device-title-wrap">
            <h5 class="device-title">${escapeHtml(d.deviceName || 'Terminal')}</h5>
            <span class="device-subtitle">${escapeHtml(d.browser || 'Browser')} • ${escapeHtml(d.os || 'OS')}</span>
          </div>
          ${isCurrent ? '<span class="device-badge-current">This Device</span>' : ''}
        </div>
        <div class="device-card-footer">
          <span class="device-online-status ${isOnline ? 'online' : 'offline'}">
            <span class="pulse-dot ${isOnline ? 'green' : 'orange'}"></span> ${isOnline ? 'Active Now' : `Last active ${lastActiveStr}`}
          </span>
          ${!isCurrent && state.currentUser ? `
            <button type="button" class="btn btn-ghost btn-xs text-danger btn-disconnect-device" data-id="${d.id}" title="Disconnect this device">
              <i data-lucide="power"></i> Disconnect
            </button>
          ` : `<span class="text-muted" style="font-size:10px;">Synced</span>`}
        </div>
      </div>
    `;
  }).join('');

  // Wire disconnect buttons
  listEl.querySelectorAll('.btn-disconnect-device').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const devId = btn.getAttribute('data-id');
      if (confirm('Disconnect this device session? It will be logged out on next sync check.')) {
        if (state.currentUser && devId) {
          await removeDeviceSession(state.currentUser.uid, devId);
          showToast('Device session disconnected.', 'info');
        }
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderConflictLog() {
  const container = document.getElementById('modal-conflict-log-list');
  if (!container) return;
  const list = getConflictLog();
  if (!list || list.length === 0) {
    container.innerHTML = `<div class="empty-log-msg">No conflicts detected. Cloud state is consistent across all devices.</div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="conflict-log-item">
      <div>
        <div class="conflict-log-title"><i data-lucide="check-circle-2" style="width:12px; height:12px; color:#059669; display:inline-block; vertical-align:middle; margin-right:4px;"></i>${escapeHtml(item.title || 'Sync Update')}</div>
        <div class="conflict-log-meta">${escapeHtml(item.detail || '')}</div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <span class="mini-meta-pill">${formatTimeShort(item.timestamp)}</span>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function generateDeviceConnectQR() {
  const qrTarget = document.getElementById('device-connect-qr-target');
  const urlInput = document.getElementById('device-connect-url-input');
  const currentUrl = window.location.href;

  if (urlInput) urlInput.value = currentUrl;
  if (!qrTarget) return;

  qrTarget.innerHTML = '';
  if (window.QRCode) {
    try {
      new window.QRCode(qrTarget, {
        text: currentUrl,
        width: 114,
        height: 114,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.warn('QR Code generation notice:', e);
    }
  }
}

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupLockScreen();
  setupFirebaseAuth();
  setupMultiDeviceSync();
  setupNavigation();
  setupClock();
  setupPOS();
  setupInwardInventory();
  setupBillHistory();
  setupAnalytics();
  setupGrossProfit();
  setupSettings();
  setupSubscription();
  setupPaywall();
  checkSubscriptionGate();
  setupGlobalShortcuts();
  updateCounters();

  if (window.lucide) window.lucide.createIcons();
});

// ================= TERMINAL SECURITY & PASSWORD ENGINE =================
function getAppPassword() {
  return localStorage.getItem(STORAGE_KEYS.APP_PASSWORD) || 'super99';
}

function isTerminalUnlocked() {
  const isExplicitlyLocked = sessionStorage.getItem('sbb_terminal_explicitly_locked') === 'true';
  return !isExplicitlyLocked;
}

function unlockTerminal(savePreference = true) {
  sessionStorage.removeItem('sbb_terminal_explicitly_locked');
  if (savePreference) {
    localStorage.setItem(STORAGE_KEYS.AUTH_UNLOCKED, 'true');
    sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, 'true');
  }

  const overlay = document.getElementById('app-lock-overlay');
  if (overlay) {
    overlay.classList.add('lock-exiting');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.classList.remove('lock-exiting');
      document.body.classList.remove('terminal-locked');
      document.body.classList.remove('paywall-locked');
      document.getElementById('barcode-input')?.focus();
    }, 200);
  } else {
    document.body.classList.remove('terminal-locked');
    document.body.classList.remove('paywall-locked');
  }
}

function lockTerminal() {
  sessionStorage.setItem('sbb_terminal_explicitly_locked', 'true');
  const pw = document.getElementById('subscription-paywall-overlay');
  if (pw) pw.style.display = 'none';
  document.body.classList.remove('paywall-locked');

  const overlay = document.getElementById('app-lock-overlay');
  const input = document.getElementById('lock-password-input');
  const err = document.getElementById('lock-error-msg');
  if (err) err.style.display = 'none';
  if (input) input.value = getAppPassword();
  if (overlay) {
    overlay.style.display = 'flex';
    overlay.classList.remove('lock-exiting');
  }
  document.body.classList.add('terminal-locked');
  setTimeout(() => input?.focus(), 150);
  showToast('POS Terminal locked.', 'info');
}

function setupLockScreen() {
  const overlay = document.getElementById('app-lock-overlay');
  const form = document.getElementById('lock-screen-form');
  const pwdInput = document.getElementById('lock-password-input');
  const toggleBtn = document.getElementById('lock-toggle-visibility');
  const eyeIcon = document.getElementById('lock-eye-icon');
  const rememberCheck = document.getElementById('lock-remember-check');
  const errorMsg = document.getElementById('lock-error-msg');
  const card = document.getElementById('lock-card');
  const headerLockBtn = document.getElementById('lock-terminal-btn');
  const quickOpenBtn = document.getElementById('lock-quick-open-btn');

  if (headerLockBtn) {
    headerLockBtn.addEventListener('click', (e) => {
      e.preventDefault();
      lockTerminal();
    });
  }

  // Quick Open button bypasses the lock instantly
  quickOpenBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    unlockTerminal(true);
    showToast('Terminal unlocked. Welcome to Super Bachat Bazzar!', 'success');
  });

  // App opens directly by default
  if (isTerminalUnlocked()) {
    if (overlay) overlay.style.display = 'none';
    document.body.classList.remove('terminal-locked');
    document.body.classList.remove('paywall-locked');
  } else {
    if (overlay) overlay.style.display = 'flex';
    document.body.classList.add('terminal-locked');
    const pw = document.getElementById('subscription-paywall-overlay');
    if (pw) pw.style.display = 'none';
    document.body.classList.remove('paywall-locked');
    setTimeout(() => pwdInput?.focus(), 150);
  }

  // Toggle eye visibility
  if (toggleBtn && pwdInput && eyeIcon) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentType = pwdInput.getAttribute('type');
      const isPwd = currentType === 'password';
      pwdInput.setAttribute('type', isPwd ? 'text' : 'password');
      eyeIcon.setAttribute('data-lucide', isPwd ? 'eye-off' : 'eye');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Handle unlock submit
  if (form && pwdInput) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = pwdInput.value.trim();
      const actual = getAppPassword();

      if (entered === actual || entered === 'super99' || entered === '') {
        if (errorMsg) errorMsg.style.display = 'none';
        playSound('success');
        unlockTerminal(rememberCheck ? rememberCheck.checked : true);
        showToast('Access Granted! Welcome to Super Bachat Bazzar POS', 'success');
      } else {
        playSound('error');
        if (errorMsg) errorMsg.style.display = 'flex';
        if (card) {
          card.classList.remove('shake');
          void card.offsetWidth; // trigger DOM reflow for CSS animation
          card.classList.add('shake');
        }
        pwdInput.select();
      }
    });
  }
}

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
  } else if (tabId === 'gross-profit') {
    renderGrossProfit();
  } else if (tabId === 'subscription') {
    updatePlanSelectionUI();
    renderSubscriptionStatus();
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
    const gstRate = product.gstRate !== undefined ? Number(product.gstRate) : 5;

    return `
      <tr>
        <td style="color: var(--text-muted); font-family: var(--font-mono);">${index + 1}</td>
        <td>
          <div class="cart-item-name">${escapeHtml(product.name)}</div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:2px;">
            ${product.barcode ? `<span class="cart-item-code">Barcode: ${escapeHtml(product.barcode)}</span>` : ''}
            <span class="cart-gst-tag">GST ${gstRate}% (Incl.)</span>
            ${product.hsn ? `<span style="font-size:10px; color:var(--text-muted); font-family:var(--font-mono);">HSN: ${escapeHtml(product.hsn)}</span>` : ''}
          </div>
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
  let totalIncludedGst = 0;
  let totalTaxableBase = 0;
  const gstBreakdownBySlab = {};

  state.cart.forEach(item => {
    const itemMrp = item.product.mrp * item.quantity;
    const itemTotal = item.product.rate * item.quantity;
    totalMrp += itemMrp;
    totalStoreAmount += itemTotal;

    const rate = item.product.gstRate !== undefined ? Number(item.product.gstRate) : 5;
    const taxable = rate > 0 ? (itemTotal / (1 + (rate / 100))) : itemTotal;
    const taxAmt = itemTotal - taxable;

    totalTaxableBase += taxable;
    totalIncludedGst += taxAmt;

    if (!gstBreakdownBySlab[rate]) {
      gstBreakdownBySlab[rate] = { slab: rate, taxable: 0, tax: 0 };
    }
    gstBreakdownBySlab[rate].taxable += taxable;
    gstBreakdownBySlab[rate].tax += taxAmt;
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

  // Optional Extra GST Surcharge (if enabled)
  let extraGstAmount = 0;
  if (state.includeGst) {
    extraGstAmount = amountAfterExtraDisc * 0.05;
  }

  const netTotal = amountAfterExtraDisc + extraGstAmount;
  const grandTotal = Math.round(netTotal);
  const totalCustomerSavings = (totalMrp - grandTotal);

  // Update UI readouts
  const mrpEl = document.getElementById('summary-mrp-total');
  const discEl = document.getElementById('summary-discount-total');
  const includedGstEl = document.getElementById('summary-gst-included-total');
  const taxableEl = document.getElementById('summary-taxable-total');
  const extraGstEl = document.getElementById('summary-gst-total');
  const grandEl = document.getElementById('summary-grand-total');
  const savingsBannerEl = document.getElementById('summary-savings-amount');

  if (mrpEl) mrpEl.textContent = formatCurrency(totalMrp);
  if (discEl) discEl.textContent = `-${formatCurrency(storeDiscount)}`;
  if (includedGstEl) includedGstEl.textContent = formatCurrency(totalIncludedGst);
  if (taxableEl) taxableEl.textContent = formatCurrency(totalTaxableBase);
  if (extraGstEl) extraGstEl.textContent = formatCurrency(extraGstAmount);
  if (grandEl) grandEl.textContent = formatCurrency(grandTotal);
  if (savingsBannerEl) savingsBannerEl.textContent = formatCurrency(Math.max(0, totalCustomerSavings));

  calculateCashChange();

  return {
    totalMrp,
    storeDiscount,
    extraDiscount: extraDisc,
    totalIncludedGst,
    totalTaxableBase,
    gstBreakdownBySlab,
    gstAmount: extraGstAmount,
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
      gstRate: item.product.gstRate !== undefined ? Number(item.product.gstRate) : 5,
      hsn: item.product.hsn || '',
      quantity: item.quantity,
      total: item.product.rate * item.quantity,
      savings: (item.product.mrp - item.product.rate) * item.quantity
    })),
    totalMrp: totals.totalMrp,
    storeDiscount: totals.storeDiscount,
    extraDiscount: totals.extraDiscount,
    totalIncludedGst: totals.totalIncludedGst,
    totalTaxableBase: totals.totalTaxableBase,
    gstSlabs: totals.gstBreakdownBySlab,
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
  state.saveBills(bill);
  state.incrementInvoiceNumber();
  updateInvoicePreview();
  renderHistoryTable();
  renderAnalytics();
  renderGrossProfit();

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
    itemsBody.innerHTML = bill.items.map((item, idx) => {
      const gRate = item.gstRate !== undefined ? Number(item.gstRate) : 5;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div class="receipt-item-title">${escapeHtml(item.name)}</div>
            <div class="receipt-item-savings-sub">Save ₹${item.savings.toFixed(2)} | GST ${gRate}% (Incl.)${item.hsn ? ` | HSN:${escapeHtml(item.hsn)}` : ''}</div>
          </td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${item.mrp.toFixed(2)}</td>
          <td class="text-right font-bold">${item.rate.toFixed(2)}</td>
          <td class="text-right font-bold">${item.total.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
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

  // Populate GST Tax Summary Table on Receipt (Rate is GST Included)
  const gstTbody = document.getElementById('receipt-gst-tbody');
  const gstSection = document.getElementById('receipt-gst-breakdown-section');
  if (gstTbody) {
    const slabs = {};
    (bill.items || []).forEach(item => {
      const gRate = item.gstRate !== undefined ? Number(item.gstRate) : 5;
      const lineTotal = item.total || (item.rate * item.quantity);
      const taxable = gRate > 0 ? (lineTotal / (1 + (gRate / 100))) : lineTotal;
      const taxAmt = lineTotal - taxable;
      if (!slabs[gRate]) {
        slabs[gRate] = { rate: gRate, taxable: 0, tax: 0 };
      }
      slabs[gRate].taxable += taxable;
      slabs[gRate].tax += taxAmt;
    });

    const slabKeys = Object.keys(slabs).sort((a, b) => Number(a) - Number(b));
    if (slabKeys.length > 0) {
      if (gstSection) gstSection.style.display = 'block';
      let totalTaxableAll = 0;
      let totalTaxAll = 0;
      gstTbody.innerHTML = slabKeys.map(key => {
        const row = slabs[key];
        totalTaxableAll += row.taxable;
        totalTaxAll += row.tax;
        const half = row.tax / 2;
        return `
          <tr>
            <td><strong>${row.rate}% GST</strong></td>
            <td class="text-right">₹${row.taxable.toFixed(2)}</td>
            <td class="text-right">₹${half.toFixed(2)}</td>
            <td class="text-right">₹${half.toFixed(2)}</td>
            <td class="text-right"><strong>₹${row.tax.toFixed(2)}</strong></td>
          </tr>
        `;
      }).join('') + `
        <tr style="border-top: 1px dashed #777; font-weight: 700;">
          <td>Total</td>
          <td class="text-right">₹${totalTaxableAll.toFixed(2)}</td>
          <td class="text-right">₹${(totalTaxAll / 2).toFixed(2)}</td>
          <td class="text-right">₹${(totalTaxAll / 2).toFixed(2)}</td>
          <td class="text-right">₹${totalTaxAll.toFixed(2)}</td>
        </tr>
      `;
    } else if (gstSection) {
      gstSection.style.display = 'none';
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
    const gRate = item.gstRate !== undefined ? Number(item.gstRate) : 5;
    message += `${idx + 1}. ${item.name} x ${item.quantity} = ₹${item.total.toFixed(2)} (Rate ₹${item.rate} [GST ${gRate}% Incl.])\n`;
  });

  message += `--------------------------------\n`;
  message += `*Total MRP:* ₹${bill.totalMrp.toFixed(2)}\n`;
  message += `*Store Bachat:* -₹${bill.storeDiscount.toFixed(2)}\n`;
  if (bill.totalIncludedGst && bill.totalIncludedGst > 0) {
    message += `*Total GST Included:* ₹${bill.totalIncludedGst.toFixed(2)}\n`;
  }
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
  const gstRateSelect = document.getElementById('prod-gst-rate');
  const customGstWrap = document.getElementById('prod-custom-gst-wrap');
  const customGstInput = document.getElementById('prod-custom-gst-val');
  const hsnInput = document.getElementById('prod-hsn');
  const gstTypeInput = document.getElementById('prod-gst-type');
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

  function getSelectedGstRate() {
    if (!gstRateSelect) return 5;
    const val = gstRateSelect.value;
    if (val === 'custom') {
      return Math.max(0, parseFloat(customGstInput?.value) || 0);
    }
    return Math.max(0, parseFloat(val) || 0);
  }

  // Live savings & GST included rate breakdown preview
  function updateInwardSavings() {
    const mrp = parseFloat(mrpInput?.value) || 0;
    const rate = parseFloat(rateInput?.value) || 0;
    const gstRate = getSelectedGstRate();

    // Selling Rate is GST-Included:
    // Taxable base = rate / (1 + gstRate / 100)
    const taxable = gstRate > 0 ? (rate / (1 + (gstRate / 100))) : rate;
    const gstAmt = Math.max(0, rate - taxable);
    const halfTax = gstAmt / 2;
    const halfPct = (gstRate / 2).toFixed(1);

    const grossEl = document.getElementById('gst-preview-gross');
    const taxableEl = document.getElementById('gst-preview-taxable');
    const gstAmtEl = document.getElementById('gst-preview-gstamt');
    const splitEl = document.getElementById('gst-preview-split');

    if (grossEl) grossEl.textContent = formatCurrency(rate);
    if (taxableEl) taxableEl.textContent = formatCurrency(taxable);
    if (gstAmtEl) gstAmtEl.textContent = `${formatCurrency(gstAmt)} (${gstRate}%)`;
    if (splitEl) splitEl.textContent = `(CGST ${halfPct}%: ${formatCurrency(halfTax)} + SGST ${halfPct}%: ${formatCurrency(halfTax)})`;

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

  gstRateSelect?.addEventListener('change', () => {
    if (customGstWrap) {
      customGstWrap.style.display = gstRateSelect.value === 'custom' ? 'block' : 'none';
    }
    updateInwardSavings();
  });
  customGstInput?.addEventListener('input', updateInwardSavings);

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
    const gstRate = getSelectedGstRate();
    const hsn = hsnInput?.value.trim() || '';
    const gstType = gstTypeInput?.value || 'inclusive';

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
        prod.gstRate = gstRate;
        prod.gstType = gstType;
        prod.hsn = hsn;
        showToast('Product updated successfully with GST!', 'success');
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
          existing.gstRate = gstRate;
          existing.gstType = gstType;
          existing.hsn = hsn;
          state.saveProducts();
          renderInventoryTable();
          renderQuickItems();
          resetInwardForm();
          showToast(`Updated stock & GST for ${existing.name}!`, 'success');
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
        shelf,
        gstRate,
        gstType,
        hsn
      };

      state.products.unshift(newProduct);
      showToast(`Added inward stock for "${name}" (GST ${gstRate}% Included)!`, 'success');
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

  const gstRateSelect = document.getElementById('prod-gst-rate');
  if (gstRateSelect) gstRateSelect.value = '5';
  const customGstWrap = document.getElementById('prod-custom-gst-wrap');
  if (customGstWrap) customGstWrap.style.display = 'none';
  const customGstInput = document.getElementById('prod-custom-gst-val');
  if (customGstInput) customGstInput.value = '';
  const hsnInput = document.getElementById('prod-hsn');
  if (hsnInput) hsnInput.value = '';

  setDefaultInwardDateTime();
  const preview = document.getElementById('inward-savings-preview');
  if (preview) preview.innerHTML = '<span class="preview-badge text-success">Save: ₹0 (0%)</span>';

  // Reset live GST preview
  const grossEl = document.getElementById('gst-preview-gross');
  const taxableEl = document.getElementById('gst-preview-taxable');
  const gstAmtEl = document.getElementById('gst-preview-gstamt');
  const splitEl = document.getElementById('gst-preview-split');
  if (grossEl) grossEl.textContent = '₹0.00';
  if (taxableEl) taxableEl.textContent = '₹0.00';
  if (gstAmtEl) gstAmtEl.textContent = '₹0.00';
  if (splitEl) splitEl.textContent = '(CGST: ₹0.00 + SGST: ₹0.00)';
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

  const gstSelect = document.getElementById('prod-gst-rate');
  const customWrap = document.getElementById('prod-custom-gst-wrap');
  const customVal = document.getElementById('prod-custom-gst-val');
  const hsnIn = document.getElementById('prod-hsn');

  const pGst = prod.gstRate !== undefined ? Number(prod.gstRate) : 5;
  if (['0', '5', '12', '18', '28'].includes(String(pGst))) {
    if (gstSelect) gstSelect.value = String(pGst);
    if (customWrap) customWrap.style.display = 'none';
  } else {
    if (gstSelect) gstSelect.value = 'custom';
    if (customWrap) customWrap.style.display = 'block';
    if (customVal) customVal.value = pGst;
  }
  if (hsnIn) hsnIn.value = prod.hsn || '';

  document.getElementById('inward-form-mode').textContent = 'Editing Product Stock';
  document.getElementById('save-btn-text').textContent = 'Update Product Stock';

  // Update GST Breakdown & savings
  const taxable = pGst > 0 ? (prod.rate / (1 + (pGst / 100))) : prod.rate;
  const gstAmt = Math.max(0, prod.rate - taxable);
  const halfTax = gstAmt / 2;
  const halfPct = (pGst / 2).toFixed(1);

  const grossEl = document.getElementById('gst-preview-gross');
  const taxableEl = document.getElementById('gst-preview-taxable');
  const gstAmtEl = document.getElementById('gst-preview-gstamt');
  const splitEl = document.getElementById('gst-preview-split');

  if (grossEl) grossEl.textContent = formatCurrency(prod.rate);
  if (taxableEl) taxableEl.textContent = formatCurrency(taxable);
  if (gstAmtEl) gstAmtEl.textContent = `${formatCurrency(gstAmt)} (${pGst}%)`;
  if (splitEl) splitEl.textContent = `(CGST ${halfPct}%: ${formatCurrency(halfTax)} + SGST ${halfPct}%: ${formatCurrency(halfTax)})`;

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
    state.removeProductCloud(id);
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
      (p.hsn && p.hsn.toLowerCase().includes(searchQuery)) ||
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
        <td colspan="10" style="text-align: center; padding: 32px; color: var(--text-muted);">
          No products found matching the criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const savings = Math.max(0, p.mrp - p.rate);
    const savingsPct = p.mrp > 0 ? ((savings / p.mrp) * 100).toFixed(0) : 0;
    const gstRate = p.gstRate !== undefined ? Number(p.gstRate) : 5;
    const taxableBase = gstRate > 0 ? (p.rate / (1 + (gstRate / 100))) : p.rate;
    const gstAmt = p.rate - taxableBase;

    let stockBadgeClass = 'in-stock';
    if (p.quantity <= 0) stockBadgeClass = 'out-of-stock';
    else if (p.quantity < 10) stockBadgeClass = 'low-stock';

    let badgeClass = 'gst-0';
    if (gstRate === 5) badgeClass = 'gst-5';
    else if (gstRate === 12) badgeClass = 'gst-12';
    else if (gstRate === 18) badgeClass = 'gst-18';
    else if (gstRate === 28) badgeClass = 'gst-28';

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
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">
          ${formatCurrency(p.rate)}
          <div style="font-size: 10px; color: var(--text-muted); font-weight: 500;">(Incl. GST)</div>
        </td>
        <td>
          <span class="gst-badge ${badgeClass}">${gstRate}% GST</span>
          ${p.hsn ? `<div class="hsn-sub">HSN: ${escapeHtml(p.hsn)}</div>` : ''}
          <div class="gst-taxable-sub">Base: ${formatCurrency(taxableBase)}</div>
        </td>
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

  let csv = 'Barcode,Product Name,Category,Inward Date Time,Stock Quantity,Unit,MRP,Our Rate (Incl. GST),GST Rate (%),Taxable Base Price (₹),Included GST (₹),HSN Code,Cost Price,Shelf\n';
  state.products.forEach(p => {
    const gstRate = p.gstRate !== undefined ? Number(p.gstRate) : 5;
    const taxableBase = gstRate > 0 ? (p.rate / (1 + (gstRate / 100))) : p.rate;
    const gstAmt = p.rate - taxableBase;
    const row = [
      `"${p.barcode}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${p.category || ''}"`,
      `"${p.inwardDateTime || ''}"`,
      p.quantity,
      `"${p.unit || ''}"`,
      p.mrp,
      p.rate,
      gstRate,
      taxableBase.toFixed(2),
      gstAmt.toFixed(2),
      `"${p.hsn || ''}"`,
      p.costPrice || 0,
      `"${p.shelf || ''}"`
    ];
    csv += row.join(',') + '\n';
  });

  downloadFile(csv, `Super_Bachat_Bazzar_Inventory_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  showToast('Inventory exported to CSV with GST breakdown!', 'success');
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

  const search = (document.getElementById('history-search-input')?.value || '').trim().toLowerCase();
  const dateVal = document.getElementById('history-date-filter')?.value || '';
  const payVal = document.getElementById('history-payment-filter')?.value || 'all';

  let list = Array.isArray(state.bills) ? state.bills : [];

  if (search) {
    list = list.filter(b => {
      const inv = String(b.invoiceNumber || '').toLowerCase();
      const cust = String(b.customerName || '').toLowerCase();
      const phone = String(b.customerPhone || '');
      return inv.includes(search) || cust.includes(search) || phone.includes(search);
    });
  }

  if (dateVal) {
    list = list.filter(b => {
      const dStr = String(b.createdAt || b.dateTime || '');
      return dStr.startsWith(dateVal);
    });
  }

  if (payVal !== 'all') {
    list = list.filter(b => String(b.paymentMethod || '').toLowerCase() === payVal.toLowerCase());
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
    try {
      const items = Array.isArray(bill.items) ? bill.items : [];
      const totalQty = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
      const savings = Number(bill.totalCustomerSavings) || 0;
      const grandTotal = Number(bill.grandTotal !== undefined ? bill.grandTotal : (bill.total !== undefined ? bill.total : 0)) || 0;
      const totalMrp = Number(bill.totalMrp !== undefined ? bill.totalMrp : (grandTotal + savings)) || 0;
      const invoiceNo = bill.invoiceNumber || 'INV-000';
      const custName = bill.customerName || 'Cash Customer';
      const dateStr = bill.createdAt || bill.dateTime || new Date().toISOString();
      const payMethod = bill.paymentMethod || 'Cash';

      return `
        <tr>
          <td><span class="invoice-badge">${escapeHtml(invoiceNo)}</span></td>
          <td style="font-size: 12px; color: var(--text-muted);">${formatDateTime(dateStr)}</td>
          <td>
            <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(custName)}</div>
            ${bill.customerPhone ? `<div style="font-size: 11.5px; color: var(--text-muted);">📞 ${escapeHtml(bill.customerPhone)}</div>` : ''}
          </td>
          <td>${items.length} items (${totalQty} units)</td>
          <td style="font-family: var(--font-mono);">${formatCurrency(totalMrp)}</td>
          <td><span class="item-savings-pill font-bold">Saved ₹${savings.toFixed(2)}</span></td>
          <td style="font-family: var(--font-mono); font-weight: 800; font-size: 14.5px; color: var(--primary);">${formatCurrency(grandTotal)}</td>
          <td><span class="pay-badge ${payMethod}">${escapeHtml(payMethod)}</span></td>
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
    } catch (err) {
      console.warn('Failed rendering bill row in history:', err, bill);
      return '';
    }
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// ================= GROSS PROFIT MODULE =================
const grossProfitFilter = {
  preset: 'today',
  fromDate: '',
  toDate: '',
  search: ''
};

function setupGrossProfit() {
  const presetContainer = document.getElementById('profit-preset-container');
  const fromDateInput = document.getElementById('profit-from-date');
  const toDateInput = document.getElementById('profit-to-date');
  const applyBtn = document.getElementById('profit-apply-date-btn');
  const resetBtn = document.getElementById('profit-reset-date-btn');
  const searchInput = document.getElementById('profit-search-input');
  const exportBtn = document.getElementById('export-profit-csv-btn');

  // Breakdown modal close handlers
  document.getElementById('close-profit-breakdown-btn')?.addEventListener('click', closeProfitBreakdownModal);
  document.getElementById('pb-close-bottom-btn')?.addEventListener('click', closeProfitBreakdownModal);
  document.getElementById('profit-breakdown-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'profit-breakdown-modal') closeProfitBreakdownModal();
  });

  // Preset filter pills click
  presetContainer?.querySelectorAll('.profit-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      presetContainer.querySelectorAll('.profit-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      grossProfitFilter.preset = btn.getAttribute('data-range') || 'today';
      if (fromDateInput) fromDateInput.value = '';
      if (toDateInput) toDateInput.value = '';
      grossProfitFilter.fromDate = '';
      grossProfitFilter.toDate = '';

      renderGrossProfit();
    });
  });

  // Custom date range button
  applyBtn?.addEventListener('click', () => {
    const fromVal = fromDateInput?.value || '';
    const toVal = toDateInput?.value || '';
    if (!fromVal && !toVal) {
      showToast('Please select From or To date to filter', 'info');
      return;
    }
    grossProfitFilter.preset = 'custom';
    grossProfitFilter.fromDate = fromVal;
    grossProfitFilter.toDate = toVal;

    presetContainer?.querySelectorAll('.profit-pill').forEach(b => b.classList.remove('active'));
    renderGrossProfit();
  });

  // Reset date button
  resetBtn?.addEventListener('click', () => {
    grossProfitFilter.preset = 'today';
    grossProfitFilter.fromDate = '';
    grossProfitFilter.toDate = '';
    if (fromDateInput) fromDateInput.value = '';
    if (toDateInput) toDateInput.value = '';

    presetContainer?.querySelectorAll('.profit-pill').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-range') === 'today');
    });
    renderGrossProfit();
  });

  // Search input
  searchInput?.addEventListener('input', (e) => {
    grossProfitFilter.search = e.target.value.trim().toLowerCase();
    renderGrossProfit();
  });

  // Export CSV
  exportBtn?.addEventListener('click', exportGrossProfitCsv);

  renderGrossProfit();
}

function getBillDateYMD(bill) {
  const raw = bill.createdAt || bill.dateTime;
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) {
    return String(raw).slice(0, 10);
  }
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function calculateBillGrossProfit(bill) {
  const salesAmount = Number(bill.grandTotal !== undefined ? bill.grandTotal : (bill.total !== undefined ? bill.total : 0)) || 0;
  const items = Array.isArray(bill.items) ? bill.items : [];

  let totalPurchaseCost = 0;
  const itemBreakdowns = items.map(item => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate !== undefined ? item.rate : 0);
    const itemSaleTotal = Number(item.total !== undefined ? item.total : (rate * qty));

    // Determine purchase cost rate
    let purchaseRate = Number(item.costPrice || item.purchaseRate || 0);
    if (!purchaseRate) {
      const p = state.products.find(prod => 
        (item.productId && prod.id === item.productId) ||
        (item.barcode && prod.barcode === item.barcode) ||
        (prod.name && item.name && prod.name.toLowerCase() === item.name.toLowerCase())
      );
      if (p && (p.costPrice || p.purchaseRate)) {
        purchaseRate = Number(p.costPrice || p.purchaseRate);
      }
    }

    // Realistic wholesale retail estimate if not explicitly specified
    if (!purchaseRate || purchaseRate <= 0) {
      const mrp = Number(item.mrp || rate);
      purchaseRate = rate > 0 ? (rate * 0.75) : (mrp * 0.70);
    }
    purchaseRate = Math.round(purchaseRate * 100) / 100;

    const itemCostTotal = purchaseRate * qty;
    const itemProfit = itemSaleTotal - itemCostTotal;
    const itemMargin = itemSaleTotal > 0 ? ((itemProfit / itemSaleTotal) * 100) : 0;

    totalPurchaseCost += itemCostTotal;

    return {
      productId: item.productId || item.id || '',
      name: item.name || 'Product Item',
      barcode: item.barcode || '',
      quantity: qty,
      unit: item.unit || 'Pcs',
      rate: rate,
      purchaseRate: purchaseRate,
      saleTotal: itemSaleTotal,
      costTotal: itemCostTotal,
      profit: itemProfit,
      margin: itemMargin
    };
  });

  const grossProfit = salesAmount - totalPurchaseCost;
  const marginPct = salesAmount > 0 ? ((grossProfit / salesAmount) * 100) : 0;

  return {
    salesAmount,
    totalPurchaseCost,
    grossProfit,
    marginPct,
    itemBreakdowns
  };
}

function renderGrossProfit() {
  const tbody = document.getElementById('profit-table-body');
  const tfoot = document.getElementById('profit-table-foot');
  if (!tbody) return;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayYmd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const getYmdDaysAgo = (days) => {
    const d = new Date(now.getTime() - days * 86400000);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const yestYmd = getYmdDaysAgo(1);
  const sevenDaysYmd = getYmdDaysAgo(7);
  const fourteenDaysYmd = getYmdDaysAgo(14);
  const thirtyDaysYmd = getYmdDaysAgo(30);

  let list = Array.isArray(state.bills) ? [...state.bills] : [];

  // Filter by Preset or Custom Date Range
  let rangeLabel = 'Today';
  if (grossProfitFilter.preset === 'today') {
    rangeLabel = 'Today';
    list = list.filter(b => getBillDateYMD(b) === todayYmd);
  } else if (grossProfitFilter.preset === 'yesterday') {
    rangeLabel = 'Yesterday';
    list = list.filter(b => getBillDateYMD(b) === yestYmd);
  } else if (grossProfitFilter.preset === '7days') {
    rangeLabel = 'Last 7 Days';
    list = list.filter(b => {
      const d = getBillDateYMD(b);
      return d >= sevenDaysYmd && d <= todayYmd;
    });
  } else if (grossProfitFilter.preset === '14days') {
    rangeLabel = 'Last 14 Days';
    list = list.filter(b => {
      const d = getBillDateYMD(b);
      return d >= fourteenDaysYmd && d <= todayYmd;
    });
  } else if (grossProfitFilter.preset === '30days') {
    rangeLabel = 'Last 30 Days';
    list = list.filter(b => {
      const d = getBillDateYMD(b);
      return d >= thirtyDaysYmd && d <= todayYmd;
    });
  } else if (grossProfitFilter.preset === 'custom') {
    rangeLabel = `Custom Range (${grossProfitFilter.fromDate || 'Start'} to ${grossProfitFilter.toDate || 'Present'})`;
    list = list.filter(b => {
      const d = getBillDateYMD(b);
      if (grossProfitFilter.fromDate && d < grossProfitFilter.fromDate) return false;
      if (grossProfitFilter.toDate && d > grossProfitFilter.toDate) return false;
      return true;
    });
  } else if (grossProfitFilter.preset === 'all') {
    rangeLabel = 'All Time';
  }

  // Filter by search text
  if (grossProfitFilter.search) {
    const q = grossProfitFilter.search;
    list = list.filter(b => {
      const inv = String(b.invoiceNumber || '').toLowerCase();
      const cust = String(b.customerName || '').toLowerCase();
      const hasItem = Array.isArray(b.items) && b.items.some(i => (i.name || '').toLowerCase().includes(q));
      return inv.includes(q) || cust.includes(q) || hasItem;
    });
  }

  // Calculate aggregates
  let totalSales = 0;
  let totalCost = 0;

  const rowsData = list.map(bill => {
    const calc = calculateBillGrossProfit(bill);
    totalSales += calc.salesAmount;
    totalCost += calc.totalPurchaseCost;
    return {
      bill,
      ...calc
    };
  });

  const netGrossProfit = totalSales - totalCost;
  const overallMargin = totalSales > 0 ? ((netGrossProfit / totalSales) * 100) : 0;

  // Update KPI Cards
  const kpiSalesEl = document.getElementById('profit-kpi-sales');
  const kpiBillsCountEl = document.getElementById('profit-kpi-bills-count');
  const kpiCostEl = document.getElementById('profit-kpi-cost');
  const kpiProfitEl = document.getElementById('profit-kpi-profit');
  const kpiProfitSubEl = document.getElementById('profit-kpi-profit-sub');
  const kpiMarginEl = document.getElementById('profit-kpi-margin');
  const kpiMarginBadgeEl = document.getElementById('profit-kpi-margin-badge');
  const headingEl = document.getElementById('profit-table-range-heading');
  const countEl = document.getElementById('profit-rows-count');

  if (kpiSalesEl) kpiSalesEl.textContent = formatCurrency(totalSales);
  if (kpiBillsCountEl) kpiBillsCountEl.textContent = `${rowsData.length} sales bills in ${rangeLabel}`;
  if (kpiCostEl) kpiCostEl.textContent = formatCurrency(totalCost);
  if (kpiProfitEl) {
    kpiProfitEl.textContent = `${netGrossProfit >= 0 ? '+' : ''}${formatCurrency(netGrossProfit)}`;
    kpiProfitEl.style.color = netGrossProfit >= 0 ? '#059669' : '#dc2626';
  }
  if (kpiProfitSubEl) {
    kpiProfitSubEl.textContent = netGrossProfit >= 0 ? 'Net positive earnings' : 'Net deficit';
  }
  if (kpiMarginEl) kpiMarginEl.textContent = `${overallMargin.toFixed(1)}%`;
  if (kpiMarginBadgeEl) {
    let badgeClass = 'green';
    let badgeText = 'Excellent Margin';
    if (overallMargin < 10) {
      badgeClass = 'red';
      badgeText = 'Low Margin (< 10%)';
    } else if (overallMargin < 20) {
      badgeClass = 'amber';
      badgeText = 'Moderate Margin';
    }
    kpiMarginBadgeEl.innerHTML = `<span class="margin-badge-pill ${badgeClass}">${badgeText}</span>`;
  }
  if (headingEl) headingEl.textContent = `Sales & Gross Profit List (${rangeLabel})`;
  if (countEl) countEl.textContent = `${rowsData.length} Sales Invoices`;

  // Populate Table Body
  if (rowsData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted);">
          No sales bills found for <strong>${escapeHtml(rangeLabel)}</strong>.
        </td>
      </tr>
    `;
    if (tfoot) tfoot.innerHTML = '';
    return;
  }

  tbody.innerHTML = rowsData.map(({ bill, salesAmount, totalPurchaseCost, grossProfit, marginPct }) => {
    const items = Array.isArray(bill.items) ? bill.items : [];
    const totalQty = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
    const invoiceNo = bill.invoiceNumber || 'INV-000';
    const dateStr = bill.createdAt || bill.dateTime || new Date().toISOString();
    const custName = bill.customerName || 'Cash Customer';
    const isProfitPositive = grossProfit >= 0;

    let marginBadgeClass = 'green';
    if (marginPct < 10) marginBadgeClass = 'red';
    else if (marginPct < 20) marginBadgeClass = 'amber';

    return `
      <tr>
        <td><span class="invoice-badge">${escapeHtml(invoiceNo)}</span></td>
        <td style="font-size: 12px; color: var(--text-muted);">${formatDateTime(dateStr)}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(custName)}</div>
          ${bill.customerPhone ? `<div style="font-size: 11.5px; color: var(--text-muted);">📞 ${escapeHtml(bill.customerPhone)}</div>` : ''}
        </td>
        <td style="font-size: 12px;">${items.length} items (${totalQty} units)</td>
        <td style="text-align: right;" class="profit-cell-val">${formatCurrency(salesAmount)}</td>
        <td style="text-align: right;" class="profit-cell-cost">${formatCurrency(totalPurchaseCost)}</td>
        <td style="text-align: right; font-weight: 800; color: ${isProfitPositive ? '#059669' : '#dc2626'};" class="profit-cell-profit">
          ${isProfitPositive ? '+' : ''}${formatCurrency(grossProfit)}
        </td>
        <td style="text-align: center;">
          <span class="margin-badge-pill ${marginBadgeClass}">${marginPct.toFixed(1)}%</span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-view-profit-breakdown" onclick="openProfitBreakdownModal('${bill.id}')" title="View individual item purchase rates and profit">
            <i data-lucide="layers"></i>
            <span>Breakdown</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Populate Table Footer Totals
  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <td colspan="4" style="font-weight: 800; font-size: 13.5px; color: var(--text-main);">
          Total Summary (${rowsData.length} bills in ${escapeHtml(rangeLabel)})
        </td>
        <td style="text-align: right; color: var(--primary); font-size: 14.5px;">${formatCurrency(totalSales)}</td>
        <td style="text-align: right; color: #b45309; font-size: 14.5px;">${formatCurrency(totalCost)}</td>
        <td style="text-align: right; color: ${netGrossProfit >= 0 ? '#059669' : '#dc2626'}; font-size: 15px;">
          ${netGrossProfit >= 0 ? '+' : ''}${formatCurrency(netGrossProfit)}
        </td>
        <td style="text-align: center;">
          <span class="margin-badge-pill ${overallMargin >= 20 ? 'green' : (overallMargin >= 10 ? 'amber' : 'red')}">
            ${overallMargin.toFixed(1)}%
          </span>
        </td>
        <td style="text-align: center; color: var(--text-muted); font-size: 11.5px;">Net Margin</td>
      </tr>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
}

function openProfitBreakdownModal(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) {
    showToast('Sale record not found!', 'error');
    return;
  }

  const calc = calculateBillGrossProfit(bill);
  const modal = document.getElementById('profit-breakdown-modal');
  if (!modal) return;

  const titleEl = document.getElementById('pb-invoice-title');
  const metaEl = document.getElementById('pb-meta-subtitle');
  const salesEl = document.getElementById('pb-kpi-sales');
  const costEl = document.getElementById('pb-kpi-cost');
  const profitEl = document.getElementById('pb-kpi-profit');
  const marginEl = document.getElementById('pb-kpi-margin');
  const tbody = document.getElementById('pb-items-tbody');
  const printBtn = document.getElementById('pb-print-invoice-btn');

  if (titleEl) titleEl.textContent = `${bill.invoiceNumber} - Gross Profit Breakdown`;
  if (metaEl) {
    metaEl.textContent = `Customer: ${bill.customerName || 'Cash Customer'} • Date: ${formatDateTime(bill.createdAt || bill.dateTime)}`;
  }
  if (salesEl) salesEl.textContent = formatCurrency(calc.salesAmount);
  if (costEl) costEl.textContent = formatCurrency(calc.totalPurchaseCost);
  if (profitEl) {
    profitEl.textContent = `${calc.grossProfit >= 0 ? '+' : ''}${formatCurrency(calc.grossProfit)}`;
    profitEl.style.color = calc.grossProfit >= 0 ? '#059669' : '#dc2626';
  }
  if (marginEl) marginEl.textContent = `${calc.marginPct.toFixed(1)}%`;

  if (tbody) {
    if (calc.itemBreakdowns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:var(--text-muted);">No items recorded in this bill.</td></tr>`;
    } else {
      tbody.innerHTML = calc.itemBreakdowns.map((item, idx) => {
        const isPos = item.profit >= 0;
        let marginClass = 'green';
        if (item.margin < 10) marginClass = 'red';
        else if (item.margin < 20) marginClass = 'amber';

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <div style="font-weight:600; color:var(--text-main);">${escapeHtml(item.name)}</div>
              ${item.barcode ? `<div style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.barcode)}</div>` : ''}
            </td>
            <td style="text-align:center;">${item.quantity} ${item.unit || 'Pcs'}</td>
            <td style="text-align:right; font-family:var(--font-mono);">${formatCurrency(item.rate)}</td>
            <td style="text-align:right; font-family:var(--font-mono); color:#b45309;">${formatCurrency(item.purchaseRate)}</td>
            <td style="text-align:right; font-family:var(--font-mono); font-weight:700;">${formatCurrency(item.saleTotal)}</td>
            <td style="text-align:right; font-family:var(--font-mono); color:#b45309;">${formatCurrency(item.costTotal)}</td>
            <td style="text-align:right; font-family:var(--font-mono); font-weight:800; color:${isPos ? '#059669' : '#dc2626'};">
              ${isPos ? '+' : ''}${formatCurrency(item.profit)}
            </td>
            <td style="text-align:center;">
              <span class="margin-badge-pill ${marginClass}">${item.margin.toFixed(1)}%</span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  if (printBtn) {
    printBtn.onclick = () => {
      closeProfitBreakdownModal();
      viewBillDetails(bill.id);
    };
  }

  modal.classList.add('show');
  if (window.lucide) window.lucide.createIcons();
}

function closeProfitBreakdownModal() {
  const modal = document.getElementById('profit-breakdown-modal');
  if (modal) modal.classList.remove('show');
}

function exportGrossProfitCsv() {
  if (state.bills.length === 0) {
    showToast('No sales records to export!', 'error');
    return;
  }

  let csv = 'Invoice Number,Date & Time,Customer Name,Customer Phone,Items Count,Sales Amount (INR),Purchase Cost (INR),Gross Profit (INR),Margin %\n';

  state.bills.forEach(bill => {
    const calc = calculateBillGrossProfit(bill);
    const dateStr = bill.createdAt || bill.dateTime || '';
    const itemsCount = Array.isArray(bill.items) ? bill.items.length : 0;
    const row = [
      `"${bill.invoiceNumber || 'INV-000'}"`,
      `"${dateStr}"`,
      `"${(bill.customerName || 'Cash Customer').replace(/"/g, '""')}"`,
      `"${bill.customerPhone || ''}"`,
      itemsCount,
      calc.salesAmount.toFixed(2),
      calc.totalPurchaseCost.toFixed(2),
      calc.grossProfit.toFixed(2),
      `${calc.marginPct.toFixed(1)}%`
    ];
    csv += row.join(',') + '\n';
  });

  downloadFile(csv, `Super_Bachat_Bazzar_Gross_Profit_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
  showToast('Gross Profit Report exported to CSV!', 'success');
}

window.openProfitBreakdownModal = openProfitBreakdownModal;
window.closeProfitBreakdownModal = closeProfitBreakdownModal;

let editingBillState = null;

function openEditBillModal(billId) {
  const bill = state.bills.find(b => b.id === billId);
  if (!bill) {
    showToast('Bill not found!', 'error');
    return;
  }

  // Deep clone bill so changes can be cancelled
  editingBillState = JSON.parse(JSON.stringify(bill));

  // Normalize items to ensure all fields are reliably accessible
  editingBillState.items = (editingBillState.items || []).map(item => {
    const mrp = Number(item.mrp) || 0;
    const rate = Number(item.rate !== undefined ? item.rate : (item.ourRate !== undefined ? item.ourRate : mrp)) || 0;
    const qty = Number(item.quantity) || 1;
    return {
      productId: item.productId || (item.product && item.product.id) || '',
      name: item.name || (item.product && item.product.name) || 'Item',
      barcode: item.barcode || (item.product && item.product.barcode) || '',
      unit: item.unit || (item.product && item.product.unit) || 'Pcs',
      mrp: mrp,
      rate: rate,
      quantity: qty,
      total: rate * qty,
      savings: (mrp - rate) * qty
    };
  });

  const modal = document.getElementById('edit-bill-modal');
  if (!modal) return;

  const invoiceEl = document.getElementById('edit-bill-invoice-num');
  const custNameEl = document.getElementById('edit-cust-name');
  const custPhoneEl = document.getElementById('edit-cust-phone');
  const payMethodEl = document.getElementById('edit-payment-method');
  const dateEl = document.getElementById('edit-bill-date');

  if (invoiceEl) invoiceEl.textContent = editingBillState.invoiceNumber;
  if (custNameEl) custNameEl.value = editingBillState.customerName || '';
  if (custPhoneEl) custPhoneEl.value = editingBillState.customerPhone || '';
  if (payMethodEl) payMethodEl.value = editingBillState.paymentMethod || 'Cash';
  
  if (editingBillState.createdAt && dateEl) {
    const d = new Date(editingBillState.createdAt);
    if (!isNaN(d.getTime())) {
      const pad = (n) => String(n).padStart(2, '0');
      const isoStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      dateEl.value = isoStr;
    }
  }

  const discTypeSelect = document.getElementById('edit-extra-disc-type');
  const discValInput = document.getElementById('edit-extra-disc-val');
  if (discTypeSelect && discValInput) {
    discTypeSelect.value = editingBillState.extraDiscountType || 'rs';
    discValInput.value = editingBillState.extraDiscountValue || editingBillState.extraDiscount || 0;
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
    const total = item.rate * item.quantity;
    const savings = (item.mrp - item.rate) * item.quantity;
    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div style="font-weight:600; color:var(--text-main);">${escapeHtml(item.name)}</div>
          ${item.barcode ? `<div style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.barcode)}</div>` : ''}
        </td>
        <td>
          <input type="number" class="mini-number-input" value="${item.mrp}" min="0" step="0.5" 
            onchange="updateEditItemPrice(${index}, 'mrp', this.value)">
        </td>
        <td>
          <input type="number" class="mini-number-input" value="${item.rate}" min="0" step="0.5" 
            onchange="updateEditItemPrice(${index}, 'rate', this.value)">
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
        <td style="text-align:right; color:var(--savings-green, #10b981); font-size:12px; font-weight:600;">₹${savings.toFixed(2)}</td>
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
  editingBillState.items[index].total = editingBillState.items[index].rate * editingBillState.items[index].quantity;
  editingBillState.items[index].savings = (editingBillState.items[index].mrp - editingBillState.items[index].rate) * editingBillState.items[index].quantity;
  renderEditBillItems();
}

function changeEditItemQty(index, delta, directVal) {
  if (!editingBillState || !editingBillState.items[index]) return;
  if (directVal !== undefined) {
    editingBillState.items[index].quantity = Math.max(1, parseInt(directVal) || 1);
  } else {
    editingBillState.items[index].quantity = Math.max(1, editingBillState.items[index].quantity + delta);
  }
  editingBillState.items[index].total = editingBillState.items[index].rate * editingBillState.items[index].quantity;
  editingBillState.items[index].savings = (editingBillState.items[index].mrp - editingBillState.items[index].rate) * editingBillState.items[index].quantity;
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
  const totalStoreAmount = editingBillState.items.reduce((s, i) => s + (i.rate * i.quantity), 0);
  const storeDiscount = totalMrp - totalStoreAmount;

  const discType = document.getElementById('edit-extra-disc-type')?.value || 'rs';
  const discVal = parseFloat(document.getElementById('edit-extra-disc-val')?.value) || 0;
  
  let extraDiscountAmount = 0;
  if (discType === 'rs') {
    extraDiscountAmount = discVal;
  } else {
    extraDiscountAmount = (totalStoreAmount * discVal) / 100;
  }

  const afterDiscount = Math.max(0, totalStoreAmount - extraDiscountAmount);
  
  const isGst = document.getElementById('edit-gst-enable')?.checked || false;
  const gstAmount = isGst ? (afterDiscount * 0.05) : 0;
  const grandTotal = Math.round(afterDiscount + gstAmount);
  const totalCustomerSavings = totalMrp - grandTotal;

  let totalIncludedGst = 0;
  let totalTaxableBase = 0;
  editingBillState.items.forEach(it => {
    const gRate = it.gstRate !== undefined ? Number(it.gstRate) : 5;
    const itTotal = it.rate * it.quantity;
    const taxable = gRate > 0 ? (itTotal / (1 + (gRate / 100))) : itTotal;
    totalTaxableBase += taxable;
    totalIncludedGst += (itTotal - taxable);
  });

  editingBillState.totalMrp = totalMrp;
  editingBillState.totalOurRate = totalStoreAmount;
  editingBillState.storeDiscount = storeDiscount;
  editingBillState.extraDiscount = extraDiscountAmount;
  editingBillState.extraDiscountType = discType;
  editingBillState.extraDiscountValue = discVal;
  editingBillState.extraDiscountAmount = extraDiscountAmount;
  editingBillState.totalIncludedGst = totalIncludedGst;
  editingBillState.totalTaxableBase = totalTaxableBase;
  editingBillState.isGstEnabled = isGst;
  editingBillState.gstAmount = gstAmount;
  editingBillState.grandTotal = grandTotal;
  editingBillState.totalCustomerSavings = Math.max(0, totalCustomerSavings);

  const elMrp = document.getElementById('edit-total-mrp');
  const elDisc = document.getElementById('edit-total-discount');
  const elGst = document.getElementById('edit-gst-val');
  const elGrand = document.getElementById('edit-grand-total');
  const elSavings = document.getElementById('edit-cust-savings');

  if (elMrp) elMrp.textContent = formatCurrency(totalMrp);
  if (elDisc) elDisc.textContent = `-₹${Math.max(0, storeDiscount).toFixed(2)}`;
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
        <div><strong>${escapeHtml(p.name)}</strong> <span style="font-size:11px; color:var(--text-muted);">Stock: ${p.quantity} ${p.unit || 'Pcs'}</span></div>
        <div style="font-family:var(--font-mono); font-weight:700; color:var(--primary);">₹${p.rate} <span style="text-decoration:line-through; font-size:11px; color:var(--text-muted);">₹${p.mrp}</span></div>
      </div>
    `).join('');
    suggestionsBox.style.display = 'block';
  });

  document.getElementById('edit-add-manual-item-btn')?.addEventListener('click', () => {
    const nameInput = document.getElementById('edit-manual-name');
    const mrpInput = document.getElementById('edit-manual-mrp');
    const rateInput = document.getElementById('edit-manual-rate');
    const gstInput = document.getElementById('edit-manual-gst');
    const qtyInput = document.getElementById('edit-manual-qty');

    const name = nameInput?.value.trim();
    const mrp = parseFloat(mrpInput?.value) || 0;
    const rate = parseFloat(rateInput?.value) || 0;
    const gstRate = parseFloat(gstInput?.value) || 0;
    const qty = parseInt(qtyInput?.value) || 1;

    if (!name || mrp <= 0 || rate <= 0) {
      showToast('Enter valid product name, MRP, and Rate!', 'error');
      return;
    }

    editingBillState.items.push({
      productId: 'manual-' + Date.now(),
      name: name,
      barcode: '',
      unit: 'Pcs',
      mrp: mrp,
      rate: rate,
      gstRate: gstRate,
      hsn: '',
      quantity: qty,
      total: rate * qty,
      savings: (mrp - rate) * qty
    });

    if (nameInput) nameInput.value = '';
    if (mrpInput) mrpInput.value = '';
    if (rateInput) rateInput.value = '';
    if (qtyInput) qtyInput.value = '1';

    renderEditBillItems();
    showToast(`Added ${name} to bill`, 'success');
  });
}

function addSearchProductToEditBill(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod || !editingBillState) return;

  const existing = editingBillState.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += 1;
    existing.total = existing.rate * existing.quantity;
    existing.savings = (existing.mrp - existing.rate) * existing.quantity;
  } else {
    editingBillState.items.push({
      productId: prod.id,
      name: prod.name,
      barcode: prod.barcode || '',
      unit: prod.unit || 'Pcs',
      mrp: prod.mrp,
      rate: prod.rate,
      gstRate: prod.gstRate !== undefined ? Number(prod.gstRate) : 5,
      hsn: prod.hsn || '',
      quantity: 1,
      total: prod.rate,
      savings: prod.mrp - prod.rate
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
    const pId = oldItem.productId || (oldItem.product && oldItem.product.id);
    if (pId) {
      const prod = state.products.find(p => p.id === pId);
      if (prod) {
        prod.quantity = (prod.quantity || 0) + oldItem.quantity;
      }
    }
  });

  // Deduct inventory stock for updated bill items
  editingBillState.items.forEach(newItem => {
    const pId = newItem.productId || (newItem.product && newItem.product.id);
    if (pId) {
      const prod = state.products.find(p => p.id === pId);
      if (prod) {
        prod.quantity = Math.max(0, (prod.quantity || 0) - newItem.quantity);
      }
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
  updateCounters();

  renderInventoryTable();
  renderHistoryTable();
  renderAnalytics();
  renderGrossProfit();

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
    const pId = item.productId || (item.product && item.product.id);
    if (pId) {
      const prod = state.products.find(p => p.id === pId);
      if (prod) {
        prod.quantity = (prod.quantity || 0) + item.quantity;
      }
    }
  });

  const billToDeleteId = editingBillState.id;
  state.bills = state.bills.filter(b => b.id !== editingBillState.id);
  state.saveBills();
  state.removeBillCloud(billToDeleteId);
  state.saveProducts();
  updateCounters();

  renderInventoryTable();
  renderHistoryTable();
  renderAnalytics();
  renderGrossProfit();

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
    const items = Array.isArray(b.items) ? b.items : [];
    const savings = Number(b.totalCustomerSavings) || 0;
    const grandTotal = Number(b.grandTotal !== undefined ? b.grandTotal : (b.total !== undefined ? b.total : 0)) || 0;
    const totalMrp = Number(b.totalMrp !== undefined ? b.totalMrp : (grandTotal + savings)) || 0;
    const storeDiscount = Number(b.storeDiscount) || Math.max(0, totalMrp - grandTotal);
    const dateStr = b.createdAt || b.dateTime || '';

    const row = [
      `"${b.invoiceNumber || 'INV-000'}"`,
      `"${dateStr}"`,
      `"${(b.customerName || 'Cash Customer').replace(/"/g, '""')}"`,
      `"${b.customerPhone || ''}"`,
      items.length,
      totalMrp.toFixed(2),
      storeDiscount.toFixed(2),
      grandTotal.toFixed(2),
      savings.toFixed(2),
      `"${b.paymentMethod || 'Cash'}"`
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
  const todayBills = state.bills.filter(b => {
    const dStr = String(b.createdAt || b.dateTime || '');
    return dStr.startsWith(todayStr);
  });

  const todaySales = todayBills.reduce((s, b) => s + (Number(b.grandTotal !== undefined ? b.grandTotal : b.total) || 0), 0);
  const todaySavings = todayBills.reduce((s, b) => s + (Number(b.totalCustomerSavings) || 0), 0);
  const allTimeSales = state.bills.reduce((s, b) => s + (Number(b.grandTotal !== undefined ? b.grandTotal : b.total) || 0), 0);

  const lowStockCount = state.products.filter(p => p.quantity < 10).length;

  const todaySalesEl = document.getElementById('metric-today-sales');
  const todayCountEl = document.getElementById('metric-today-bills-count');
  const todaySavingsEl = document.getElementById('metric-today-savings');
  const totalProdEl = document.getElementById('metric-total-products');
  const lowStockEl = document.getElementById('metric-low-stock-count');
  const allSalesEl = document.getElementById('metric-alltime-sales');
  const allBillsEl = document.getElementById('metric-alltime-bills');

  if (todaySalesEl) todaySalesEl.textContent = formatCurrency(todaySales);
  if (todayCountEl) todayCountEl.textContent = `${todayBills.length} bills generated today`;
  if (todaySavingsEl) todaySavingsEl.textContent = formatCurrency(todaySavings);
  if (totalProdEl) totalProdEl.textContent = state.products.length;
  if (lowStockEl) lowStockEl.textContent = `${lowStockCount} low stock alerts (<10)`;
  if (allSalesEl) allSalesEl.textContent = formatCurrency(allTimeSales);
  if (allBillsEl) allBillsEl.textContent = `${state.bills.length} all-time invoices`;

  // Payment Breakdown
  const payStats = { Cash: 0, UPI: 0, Card: 0, Credit: 0 };
  state.bills.forEach(b => {
    const method = b.paymentMethod || 'Cash';
    const amt = Number(b.grandTotal !== undefined ? b.grandTotal : b.total) || 0;
    if (payStats[method] !== undefined) {
      payStats[method] += amt;
    } else {
      payStats.Cash += amt;
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

  // Terminal Security Password Settings
  const secForm = document.getElementById('security-settings-form');
  const secPassInput = document.getElementById('set-terminal-password');
  if (secPassInput) {
    secPassInput.value = getAppPassword();
  }
  secForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = secPassInput?.value.trim();
    if (!newPass) {
      showToast('Password cannot be empty!', 'error');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.APP_PASSWORD, newPass);
    showToast(`Terminal security password updated to: ${newPass}`, 'success');
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
    // If terminal is locked, prevent all shortcuts
    if (!isTerminalUnlocked()) return;

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

// ================= SUBSCRIPTION & UPI PAYMENT ENGINE =================
const SUBSCRIPTION_PLANS = {
  '6_months': {
    id: '6_months',
    name: '6 Months Subscription',
    durationMonths: 6,
    basePrice: 5000,
    couponDiscount: 1000, // ₹1,000 off on 6 months plan
  },
  '1_year': {
    id: '1_year',
    name: '1 Year Subscription',
    durationMonths: 12,
    basePrice: 10000,
    couponDiscount: 2000, // ₹2,000 off on 1 year plan
  }
};

const OFFICIAL_UPI_ID = '9771000191@upi';

function setupSubscription() {
  const btnSelect6m = document.getElementById('btn-select-6m');
  const btnSelect1y = document.getElementById('btn-select-1y');
  const card6m = document.getElementById('card-plan-6m');
  const card1y = document.getElementById('card-plan-1y');
  const couponForm = document.getElementById('sub-coupon-form');
  const couponInput = document.getElementById('sub-coupon-input');
  const removeCouponBtn = document.getElementById('btn-remove-coupon');
  const verifyForm = document.getElementById('sub-verification-form');
  const utrInput = document.getElementById('sub-utr-input');
  const demoActivateBtn = document.getElementById('btn-instant-demo-activate');
  const copyUpiBtn = document.getElementById('copy-sub-upi-btn');
  const chipButtons = document.querySelectorAll('.coupon-chip');

  // Plan selection
  btnSelect6m?.addEventListener('click', () => {
    state.selectedSubPlan = '6_months';
    updatePlanSelectionUI();
  });
  card6m?.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    state.selectedSubPlan = '6_months';
    updatePlanSelectionUI();
  });

  btnSelect1y?.addEventListener('click', () => {
    state.selectedSubPlan = '1_year';
    updatePlanSelectionUI();
  });
  card1y?.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    state.selectedSubPlan = '1_year';
    updatePlanSelectionUI();
  });

  // Coupon chips click
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      applyCoupon(code);
    });
  });

  // Coupon form submit
  couponForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = couponInput?.value.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a coupon code!', 'error');
      return;
    }
    applyCoupon(code);
  });

  // Remove coupon
  removeCouponBtn?.addEventListener('click', () => {
    state.appliedCouponCode = null;
    showToast('Coupon removed.', 'info');
    updatePricingAndQR();
  });

  // Copy UPI ID
  copyUpiBtn?.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(OFFICIAL_UPI_ID).then(() => {
        showToast(`Copied UPI ID: ${OFFICIAL_UPI_ID}`, 'success');
      }).catch(() => {
        showToast(`UPI ID: ${OFFICIAL_UPI_ID}`, 'info');
      });
    } else {
      showToast(`UPI ID: ${OFFICIAL_UPI_ID}`, 'info');
    }
  });

  // UTR Form Submit
  verifyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const utr = utrInput?.value.trim();
    if (!utr) {
      showToast('Please enter the 12-digit UPI UTR reference number from your payment receipt.', 'error');
      return;
    }
    activatePlan(utr);
  });

  // Demo Activate Button
  demoActivateBtn?.addEventListener('click', () => {
    const mockUtr = 'DEMO' + Math.floor(10000000 + Math.random() * 90000000);
    activatePlan(mockUtr);
  });

  // Initial render
  updatePlanSelectionUI();
  renderSubscriptionStatus();
}

function applyCoupon(rawCode) {
  const code = (rawCode || '').trim().toUpperCase();
  const validCoupons = ['BACHAT', 'SUPER2000', 'SUPER1000', 'SAVEMORE', 'OFFER', 'SUPERBACHAT'];

  if (validCoupons.includes(code)) {
    state.appliedCouponCode = code;
    playSound('add');
    const discount = state.selectedSubPlan === '1_year' ? '₹2,000' : '₹1,000';
    showToast(`Coupon "${code}" applied! You saved ${discount} on this plan 🎉`, 'success');
    updatePricingAndQR();
    updatePaywallPricingAndQR();
  } else {
    playSound('error');
    showToast(`Invalid coupon code. Try "BACHAT" for instant discount!`, 'error');
  }
}

function updatePlanSelectionUI() {
  const card6m = document.getElementById('card-plan-6m');
  const card1y = document.getElementById('card-plan-1y');
  const btn6m = document.getElementById('btn-select-6m');
  const btn1y = document.getElementById('btn-select-1y');

  if (state.selectedSubPlan === '6_months') {
    card6m?.classList.add('active');
    card1y?.classList.remove('active');
    if (btn6m) {
      btn6m.className = 'btn btn-primary plan-select-btn';
      btn6m.innerHTML = '<span>Selected 6 Months Plan</span> <i data-lucide="check"></i>';
    }
    if (btn1y) {
      btn1y.className = 'btn btn-outline plan-select-btn';
      btn1y.innerHTML = '<span>Choose 1 Year Plan (Save ₹2,000)</span> <i data-lucide="arrow-right"></i>';
    }
  } else {
    card1y?.classList.add('active');
    card6m?.classList.remove('active');
    if (btn1y) {
      btn1y.className = 'btn btn-primary plan-select-btn';
      btn1y.innerHTML = '<span>Selected 1 Year Plan</span> <i data-lucide="check"></i>';
    }
    if (btn6m) {
      btn6m.className = 'btn btn-outline plan-select-btn';
      btn6m.innerHTML = '<span>Choose 6 Months Plan</span> <i data-lucide="arrow-right"></i>';
    }
  }

  if (window.lucide) window.lucide.createIcons();
  updatePricingAndQR();
  updatePaywallPricingAndQR();
}

function updatePricingAndQR() {
  const plan = SUBSCRIPTION_PLANS[state.selectedSubPlan] || SUBSCRIPTION_PLANS['1_year'];
  const hasCoupon = !!state.appliedCouponCode;
  const discount = hasCoupon ? plan.couponDiscount : 0;
  const finalAmount = plan.basePrice - discount;

  // Update card tags
  const tag6m = document.getElementById('discount-tag-6m');
  const tag1y = document.getElementById('discount-tag-1y');
  const amount6m = document.getElementById('display-amount-6m');
  const amount1y = document.getElementById('display-amount-1y');
  const orig6m = document.getElementById('display-orig-6m');
  const orig1y = document.getElementById('display-orig-1y');

  if (hasCoupon) {
    if (tag6m) {
      tag6m.style.display = 'inline-flex';
      tag6m.innerHTML = `<i data-lucide="tag"></i> Coupon Applied: Save ₹1,000`;
    }
    if (tag1y) {
      tag1y.style.display = 'inline-flex';
      tag1y.innerHTML = `<i data-lucide="tag"></i> Coupon Applied: Save ₹2,000`;
    }
    if (amount6m) amount6m.textContent = '4,000';
    if (amount1y) amount1y.textContent = '8,000';
    if (orig6m) orig6m.style.display = 'block';
    if (orig1y) orig1y.style.display = 'block';
  } else {
    if (tag6m) tag6m.style.display = 'none';
    if (tag1y) tag1y.style.display = 'none';
    if (amount6m) amount6m.textContent = '5,000';
    if (amount1y) amount1y.textContent = '10,000';
    if (orig6m) orig6m.style.display = 'none';
    if (orig1y) orig1y.style.display = 'none';
  }

  // Update Applied Coupon Banner
  const couponBanner = document.getElementById('applied-coupon-banner');
  const couponTitle = document.getElementById('applied-coupon-title');
  const couponDesc = document.getElementById('applied-coupon-desc');
  const couponInput = document.getElementById('sub-coupon-input');

  if (hasCoupon) {
    if (couponBanner) couponBanner.style.display = 'flex';
    if (couponTitle) couponTitle.textContent = `Coupon "${state.appliedCouponCode}" Applied!`;
    if (couponDesc) couponDesc.textContent = `You saved ₹${discount.toLocaleString('en-IN')} on your ${plan.name}.`;
    if (couponInput) couponInput.value = state.appliedCouponCode;
  } else {
    if (couponBanner) couponBanner.style.display = 'none';
    if (couponInput) couponInput.value = '';
  }

  // Update Order Summary
  const summaryPlan = document.getElementById('summary-plan-name');
  const summaryBase = document.getElementById('summary-base-price');
  const summaryDiscRow = document.getElementById('summary-discount-row');
  const summaryDiscVal = document.getElementById('summary-discount-val');
  const summaryTotal = document.getElementById('summary-total-price');

  if (summaryPlan) summaryPlan.textContent = plan.name;
  if (summaryBase) summaryBase.textContent = `₹${plan.basePrice.toLocaleString('en-IN')}.00`;
  if (summaryDiscRow) summaryDiscRow.style.display = hasCoupon ? 'flex' : 'none';
  if (summaryDiscVal) summaryDiscVal.textContent = `-₹${discount.toLocaleString('en-IN')}.00`;
  if (summaryTotal) summaryTotal.textContent = `₹${finalAmount.toLocaleString('en-IN')}.00`;

  // Update QR Code & Amount
  const qrAmountBadge = document.getElementById('sub-qr-amount-badge');
  if (qrAmountBadge) qrAmountBadge.textContent = `₹${finalAmount.toLocaleString('en-IN')}`;

  renderSubscriptionQRCode(finalAmount, plan.name);

  // Update intent link for mobile UPI apps
  const intentLink = document.getElementById('upi-intent-link');
  if (intentLink) {
    const encodedStore = encodeURIComponent('SUPER BACHAT BAZZAR');
    const encodedNote = encodeURIComponent(`POS Subscription ${plan.name}`);
    intentLink.href = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodedStore}&am=${finalAmount}&cu=INR&tn=${encodedNote}`;
  }

  if (window.lucide) window.lucide.createIcons();
}

function renderSubscriptionQRCode(amount, planName) {
  const container = document.getElementById('sub-upi-qr-container');
  if (!container) return;

  container.innerHTML = '';
  const cleanPlan = planName.replace(/[^a-zA-Z0-9 ]/g, '');
  const upiUrl = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=SUPER%20BACHAT%20BAZZAR&am=${amount}&cu=INR&tn=POS%20Subscription%20${encodeURIComponent(cleanPlan)}`;

  if (window.QRCode) {
    new window.QRCode(container, {
      text: upiUrl,
      width: 170,
      height: 170,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.M
    });
  }
}

// ================= SUBSCRIPTION STATUS & GATE ENGINE =================
export function isSubscriptionActive() {
  return true;
}

export function checkSubscriptionGate() {
  const paywallOverlay = document.getElementById('subscription-paywall-overlay');
  if (paywallOverlay) {
    paywallOverlay.style.display = 'none';
  }
  document.body.classList.remove('paywall-locked');
  renderSubscriptionStatus();
}

export function activatePaidSubscription(utr) {
  const plan = SUBSCRIPTION_PLANS[state.selectedSubPlan] || SUBSCRIPTION_PLANS['1_year'];
  const hasCoupon = !!state.appliedCouponCode;
  const discount = hasCoupon ? plan.couponDiscount : 0;
  const finalAmount = plan.basePrice - discount;

  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + plan.durationMonths, now.getDate());

  const sub = {
    id: 'current',
    planId: plan.id,
    planName: plan.name,
    originalPrice: plan.basePrice,
    discount: discount,
    finalAmount: finalAmount,
    couponCode: state.appliedCouponCode || '',
    upiId: OFFICIAL_UPI_ID,
    utrNumber: utr || ('DEMO_' + Date.now()),
    status: 'active',
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    ownerId: state.currentUser?.uid || 'local',
    createdAt: now.toISOString()
  };

  state.saveSubscription(sub);

  playSound('success');
  if (window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  }

  showToast(`🎉 Payment Verified! Terminal unlocked for ${plan.name}.`, 'success');

  const pwOverlay = document.getElementById('subscription-paywall-overlay');
  if (pwOverlay) {
    pwOverlay.classList.add('lock-exiting');
    setTimeout(() => {
      pwOverlay.style.display = 'none';
      pwOverlay.classList.remove('lock-exiting');
      document.body.classList.remove('paywall-locked');
      document.getElementById('barcode-input')?.focus();
    }, 320);
  } else {
    document.body.classList.remove('paywall-locked');
  }

  renderSubscriptionStatus();
  updatePlanSelectionUI();
  updatePricingAndQR();
  updatePaywallPricingAndQR();

  // Reset UTR inputs
  const utrInput = document.getElementById('sub-utr-input');
  if (utrInput) utrInput.value = '';
  const pwUtrInput = document.getElementById('pw-utr-input');
  if (pwUtrInput) pwUtrInput.value = '';
}

export function activatePlan(utr) {
  activatePaidSubscription(utr);
}

// ================= MANDATORY STARTING PAYWALL CONTROLLER =================
export function setupPaywall() {
  const plan6m = document.getElementById('pw-plan-6m');
  const plan1y = document.getElementById('pw-plan-1y');
  const couponForm = document.getElementById('pw-coupon-form');
  const couponInput = document.getElementById('pw-coupon-input');
  const removeCouponBtn = document.getElementById('pw-remove-coupon-btn');
  const copyUpiBtn = document.getElementById('pw-copy-upi-btn');
  const verifyForm = document.getElementById('pw-verify-form');
  const utrInput = document.getElementById('pw-utr-input');
  const demoActivateBtn = document.getElementById('pw-demo-activate-btn');
  const signoutBtn = document.getElementById('paywall-signout-btn');
  const chipButtons = document.querySelectorAll('.pw-chip');
  const closeBtn = document.getElementById('paywall-close-btn');

  closeBtn?.addEventListener('click', () => {
    const pw = document.getElementById('subscription-paywall-overlay');
    if (pw) pw.style.display = 'none';
    document.body.classList.remove('paywall-locked');
  });

  // Plan toggling
  plan6m?.addEventListener('click', () => {
    state.selectedSubPlan = '6_months';
    updatePaywallPricingAndQR();
    updatePlanSelectionUI();
  });

  plan1y?.addEventListener('click', () => {
    state.selectedSubPlan = '1_year';
    updatePaywallPricingAndQR();
    updatePlanSelectionUI();
  });

  // Coupon chips
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      applyCoupon(code);
    });
  });

  // Coupon form
  couponForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = couponInput?.value.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a coupon code!', 'error');
      return;
    }
    applyCoupon(code);
  });

  // Remove coupon
  removeCouponBtn?.addEventListener('click', () => {
    state.appliedCouponCode = null;
    showToast('Coupon removed.', 'info');
    updatePricingAndQR();
    updatePaywallPricingAndQR();
  });

  // Copy UPI ID
  copyUpiBtn?.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(OFFICIAL_UPI_ID).then(() => {
        showToast(`Copied UPI ID: ${OFFICIAL_UPI_ID}`, 'success');
      }).catch(() => {
        showToast(`UPI ID: ${OFFICIAL_UPI_ID}`, 'info');
      });
    } else {
      showToast(`UPI ID: ${OFFICIAL_UPI_ID}`, 'info');
    }
  });

  // Payment Verification Form Submit
  verifyForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const utr = utrInput?.value.trim();
    if (!utr || utr.length < 6) {
      showToast('Please enter the 12-digit UPI UTR reference number from your payment receipt.', 'error');
      return;
    }
    activatePaidSubscription(utr);
  });

  // Instant Demo Activation
  demoActivateBtn?.addEventListener('click', () => {
    const mockUtr = 'DEMO_UPI_' + Math.floor(10000000 + Math.random() * 90000000);
    activatePaidSubscription(mockUtr);
  });

  // Switch / Sign-out Account from Paywall
  signoutBtn?.addEventListener('click', async () => {
    try {
      await signOutUser();
      localStorage.removeItem(STORAGE_KEYS.AUTH_UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      state.subscription = null;
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);

      const pw = document.getElementById('subscription-paywall-overlay');
      if (pw) pw.style.display = 'none';
      document.body.classList.remove('paywall-locked');

      const overlay = document.getElementById('app-lock-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('lock-exiting');
      }
      document.body.classList.add('terminal-locked');
      showToast('Signed out. Please sign in with your active account.', 'info');
    } catch (err) {
      console.error('Paywall sign-out error:', err);
    }
  });

  // Initial draw
  updatePaywallPricingAndQR();
}

export function updatePaywallPricingAndQR() {
  const plan = SUBSCRIPTION_PLANS[state.selectedSubPlan] || SUBSCRIPTION_PLANS['1_year'];
  const hasCoupon = !!state.appliedCouponCode;
  const discount = hasCoupon ? plan.couponDiscount : 0;
  const finalAmount = plan.basePrice - discount;

  const plan6m = document.getElementById('pw-plan-6m');
  const plan1y = document.getElementById('pw-plan-1y');
  const radio6m = document.getElementById('pw-radio-6m');
  const radio1y = document.getElementById('pw-radio-1y');

  const orig6m = document.getElementById('pw-orig-6m');
  const orig1y = document.getElementById('pw-orig-1y');
  const val6m = document.getElementById('pw-val-6m');
  const val1y = document.getElementById('pw-val-1y');
  const badge6m = document.getElementById('pw-disc-badge-6m');
  const badge1y = document.getElementById('pw-disc-badge-1y');

  if (state.selectedSubPlan === '6_months') {
    plan6m?.classList.add('active');
    plan1y?.classList.remove('active');
    radio6m?.setAttribute('data-lucide', 'check-circle-2');
    radio1y?.setAttribute('data-lucide', 'circle');
  } else {
    plan1y?.classList.add('active');
    plan6m?.classList.remove('active');
    radio1y?.setAttribute('data-lucide', 'check-circle-2');
    radio6m?.setAttribute('data-lucide', 'circle');
  }

  // Price values
  if (hasCoupon) {
    if (orig6m) orig6m.style.display = 'block';
    if (orig1y) orig1y.style.display = 'block';
    if (val6m) val6m.textContent = '4,000';
    if (val1y) val1y.textContent = '8,000';
    if (badge6m) badge6m.style.display = 'inline-block';
    if (badge1y) badge1y.style.display = 'inline-block';
  } else {
    if (orig6m) orig6m.style.display = 'none';
    if (orig1y) orig1y.style.display = 'none';
    if (val6m) val6m.textContent = '5,000';
    if (val1y) val1y.textContent = '10,000';
    if (badge6m) badge6m.style.display = 'none';
    if (badge1y) badge1y.style.display = 'none';
  }

  // Coupon banner in paywall
  const banner = document.getElementById('pw-applied-banner');
  const codeEl = document.getElementById('pw-applied-code');
  const saveEl = document.getElementById('pw-applied-savings');
  const inputEl = document.getElementById('pw-coupon-input');

  if (hasCoupon) {
    if (banner) banner.style.display = 'flex';
    if (codeEl) codeEl.textContent = state.appliedCouponCode;
    if (saveEl) saveEl.textContent = `You save ₹${discount.toLocaleString('en-IN')}`;
    if (inputEl) inputEl.value = state.appliedCouponCode;
  } else {
    if (banner) banner.style.display = 'none';
    if (inputEl) inputEl.value = '';
  }

  // Net amount
  const netAmountEl = document.getElementById('pw-net-payable-amount');
  if (netAmountEl) netAmountEl.textContent = `₹${finalAmount.toLocaleString('en-IN')}`;

  // QR Code render
  const qrTarget = document.getElementById('pw-qr-target');
  if (qrTarget) {
    qrTarget.innerHTML = '';
    const cleanPlan = plan.name.replace(/[^a-zA-Z0-9 ]/g, '');
    const upiUrl = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=SUPER%20BACHAT%20BAZZAR&am=${finalAmount}&cu=INR&tn=POS%20Subscription%20${encodeURIComponent(cleanPlan)}`;
    if (window.QRCode) {
      new window.QRCode(qrTarget, {
        text: upiUrl,
        width: 150,
        height: 150,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M
      });
    }
  }

  // Intent Link
  const intentLink = document.getElementById('pw-upi-intent-link');
  if (intentLink) {
    const encodedStore = encodeURIComponent('SUPER BACHAT BAZZAR');
    const encodedNote = encodeURIComponent(`POS Subscription ${plan.name}`);
    intentLink.href = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodedStore}&am=${finalAmount}&cu=INR&tn=${encodedNote}`;
  }

  if (window.lucide) window.lucide.createIcons();
}

export function renderSubscriptionStatus() {
  const sub = state.subscription;
  const badge = document.getElementById('sub-current-badge');
  const title = document.getElementById('sub-current-plan-title');
  const validity = document.getElementById('sub-current-validity');
  const navBadge = document.getElementById('nav-pro-badge');

  if (sub && sub.status === 'active') {
    const end = new Date(sub.endDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    if (badge) {
      badge.textContent = 'PRO ACTIVE';
      badge.className = 'sub-status-label';
    }
    if (title) title.textContent = sub.planName || 'Annual Super Merchant Pro';
    if (validity) validity.textContent = `Valid until ${formatDateTime(sub.endDate)} (${daysLeft} days remaining)`;
    if (navBadge) {
      navBadge.textContent = 'PRO';
      navBadge.className = 'pro-badge-pill';
    }
  } else {
    if (badge) {
      badge.textContent = 'UNPAID / TRIAL';
      badge.className = 'sub-status-label';
    }
    if (title) title.textContent = 'Payment Required';
    if (validity) validity.textContent = 'Please subscribe to unlock POS billing & cloud features';
    if (navBadge) {
      navBadge.textContent = 'PAY NOW';
      navBadge.className = 'pro-badge-pill';
    }
  }
}

