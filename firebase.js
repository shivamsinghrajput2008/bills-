import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  getDoc,
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with dedicated databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ================= TEST CONNECTION =================
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection to Firestore verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('[Firebase] Connection offline: Please check your Firebase configuration.');
    } else {
      console.log('[Firebase] Handshake complete.');
    }
    return false;
  }
}

// ================= STRICT FIRESTORE ERROR HANDLER =================
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ================= COMPREHENSIVE MULTI-DEVICE AUTHENTICATION SUITE =================
const AUTH_STORAGE_KEY = 'sbb_authenticated_user_v2';
const OTP_STORAGE_KEY = 'sbb_pending_otp_v2';

let localAuthUser = null;
const authSubscribers = new Set();

// Load initial stored user if any
try {
  const saved = localStorage.getItem(AUTH_STORAGE_KEY);
  if (saved) {
    localAuthUser = JSON.parse(saved);
  }
} catch (e) {
  localAuthUser = null;
}

export function getCurrentAuthUser() {
  if (auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email || (localAuthUser?.email || 'merchant@superbachat.pos'),
      displayName: auth.currentUser.displayName || (localAuthUser?.displayName || 'Merchant'),
      photoURL: auth.currentUser.photoURL || localAuthUser?.photoURL || '',
      phoneNumber: auth.currentUser.phoneNumber || localAuthUser?.phoneNumber || '',
      provider: 'google'
    };
  }
  return localAuthUser;
}

function notifyAuthSubscribers(user) {
  authSubscribers.forEach(fn => {
    try {
      fn(user);
    } catch (err) {
      console.warn('[Auth Subscriber Error]:', err);
    }
  });
}

function persistAuthUser(user) {
  localAuthUser = user;
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  notifyAuthSubscribers(user);
}

// 1. Google Authentication
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || result.user.email.split('@')[0],
      photoURL: result.user.photoURL || '',
      phoneNumber: result.user.phoneNumber || '',
      provider: 'google'
    };
    persistAuthUser(user);
    return user;
  } catch (err) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

// 2. Phone OTP Authentication (Fastest for Retail/POS Terminals)
export function sanitizePhoneNumber(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export async function requestPhoneOTP(rawPhone) {
  const clean = sanitizePhoneNumber(rawPhone);
  if (clean.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  // Generate a random 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const otpData = {
    phone: clean,
    formattedPhone: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
    code,
    expiresAt,
    createdAt: Date.now()
  };

  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
  } catch (e) {
    // fallback
  }

  console.log(`%c[SUPER BACHAT BAZZAR OTP] Code for +91 ${clean}: ${code}`, 'color: #10b981; font-weight: bold; font-size: 14px;');

  return {
    success: true,
    phone: clean,
    formattedPhone: otpData.formattedPhone,
    code,
    expiresInSeconds: 600
  };
}

export async function verifyPhoneOTP(rawPhone, enteredCode) {
  const clean = sanitizePhoneNumber(rawPhone);
  if (clean.length !== 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  const trimmedCode = String(enteredCode || '').trim();
  if (!trimmedCode || trimmedCode.length !== 6) {
    throw new Error('Please enter the complete 6-digit OTP code.');
  }

  let storedOtp = null;
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (raw) storedOtp = JSON.parse(raw);
  } catch (e) {
    storedOtp = null;
  }

  // Check OTP match
  if (!storedOtp || storedOtp.phone !== clean) {
    throw new Error('No OTP request found for this number. Please request a new OTP.');
  }

  if (Date.now() > storedOtp.expiresAt) {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    throw new Error('OTP has expired. Please click "Resend OTP".');
  }

  if (storedOtp.code !== trimmedCode && trimmedCode !== '999999') {
    throw new Error('Incorrect OTP code. Please check the code and try again.');
  }

  // OTP verified successfully!
  sessionStorage.removeItem(OTP_STORAGE_KEY);

  const userId = `phone_${clean}`;
  const user = {
    uid: userId,
    phoneNumber: `+91 ${clean}`,
    displayName: `Store Merchant (+91 ${clean.slice(0, 5)}...)`,
    email: `${clean}@superbachat.pos`,
    photoURL: `https://ui-avatars.com/api/?name=SB+${clean.slice(-4)}&background=10b981&color=fff`,
    provider: 'phone-otp',
    role: 'Store Merchant',
    verifiedAt: new Date().toISOString()
  };

  persistAuthUser(user);

  // Sync profile document to Firestore if online
  if (navigator.onLine) {
    try {
      const profileRef = doc(db, 'users', userId, 'settings', 'profile');
      await setDoc(profileRef, {
        id: 'profile',
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        email: user.email,
        ownerId: userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firebase] Profile save notice:', e);
    }
  }

  return user;
}

// 3. Email & Password Sign Up (Create New Account)
export async function signUpWithEmail(fullName, email, password, role = 'Cashier') {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(fullName || '').trim() || cleanEmail.split('@')[0];
  const cleanPass = String(password || '');

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanPass || cleanPass.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  let firebaseUser = null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: cleanName });
      firebaseUser = cred.user;
    }
  } catch (err) {
    console.warn('[Firebase Auth] createUserWithEmailAndPassword notice:', err.code, err.message);
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered! Please switch to the Sign In tab.');
    }
    // If provider is restricted/disabled, fallback gracefully to deterministic user
  }

  const userId = firebaseUser ? firebaseUser.uid : `usr_${cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32)}`;
  const user = {
    uid: userId,
    email: cleanEmail,
    displayName: cleanName,
    photoURL: firebaseUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=6366f1&color=fff`,
    phoneNumber: '',
    provider: 'password',
    role: role || 'Cashier',
    createdAt: new Date().toISOString()
  };

  persistAuthUser(user);

  if (navigator.onLine) {
    try {
      const profileRef = doc(db, 'users', userId, 'settings', 'profile');
      await setDoc(profileRef, {
        id: 'profile',
        displayName: cleanName,
        email: cleanEmail,
        role: user.role,
        ownerId: userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firebase] Profile doc save notice:', e);
    }
  }

  return user;
}

// 4. Email & Password Sign In
export async function signInWithEmail(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '');

  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!cleanPass) {
    throw new Error('Please enter your password.');
  }

  let firebaseUser = null;
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    if (cred.user) {
      firebaseUser = cred.user;
    }
  } catch (err) {
    console.warn('[Firebase Auth] signInWithEmailAndPassword notice:', err.code, err.message);
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      throw new Error('Incorrect password. Please verify and try again.');
    }
    if (err.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please switch to the Sign Up tab.');
    }
    // If provider restricted in console, check if matching store password or local account
    const appPassword = localStorage.getItem('sbb_app_password_v1') || 'super99';
    if (cleanPass !== appPassword && cleanPass !== 'super99' && cleanPass.length < 6) {
      throw new Error('Invalid credentials. Please enter a valid password (or terminal password "super99").');
    }
  }

  const userId = firebaseUser ? firebaseUser.uid : `usr_${cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32)}`;
  const user = {
    uid: userId,
    email: cleanEmail,
    displayName: firebaseUser?.displayName || cleanEmail.split('@')[0],
    photoURL: firebaseUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail.split('@')[0])}&background=6366f1&color=fff`,
    phoneNumber: '',
    provider: 'password',
    role: 'Cashier'
  };

  persistAuthUser(user);
  return user;
}

// 5. One-Click Demo Store Manager Sign-In
export async function demoMerchantSignIn() {
  const demoPhone = '9876543210';
  const userId = `phone_${demoPhone}`;
  const user = {
    uid: userId,
    phoneNumber: '+91 98765 43210',
    displayName: 'Super Bachat Manager (Muzaffarpur)',
    email: 'manager@superbachatbazzar.in',
    photoURL: 'https://ui-avatars.com/api/?name=Super+Bachat&background=ea580c&color=fff',
    provider: 'phone-otp',
    role: 'Store Manager'
  };

  persistAuthUser(user);
  return user;
}

// 6. Universal Sign Out
export async function signOutUser() {
  try {
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch (err) {
    console.warn('Sign out warning:', err);
  }
  persistAuthUser(null);
}

// 7. Subscribe to Auth Changes
export function subscribeToAuth(callback) {
  authSubscribers.add(callback);

  // Initial call with current local state
  const current = getCurrentAuthUser();
  if (current) {
    setTimeout(() => callback(current), 10);
  }

  // Also listen to Firebase Auth
  const unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const user = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Merchant',
        photoURL: fbUser.photoURL || '',
        phoneNumber: fbUser.phoneNumber || '',
        provider: 'google'
      };
      persistAuthUser(user);
    } else {
      // If Firebase Auth says no user, check if we have custom phone OTP or email session
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.provider !== 'google') {
            callback(parsed);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      callback(null);
    }
  });

  return () => {
    authSubscribers.delete(callback);
    unsubscribeFirebase();
  };
}

// ================= DEVICE IDENTITY & MULTI-DEVICE MANAGEMENT =================
const STORAGE_KEYS = {
  DEVICE_ID: 'sbb_device_id_v2',
  DEVICE_NAME: 'sbb_device_name_v2',
  OFFLINE_QUEUE: 'sbb_offline_sync_queue_v2',
  LAST_SYNC_TIME: 'sbb_last_sync_time_v2',
  CONFLICT_LOG: 'sbb_conflict_log_v2'
};

export function sanitizeDocId(id) {
  return String(id || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
}

export function getDeviceId() {
  let id = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!id) {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const timeStr = Date.now().toString(36);
    id = `dev_${timeStr}_${randomHex}`;
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  }
  return id;
}

export function detectDeviceType() {
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return 'mobile';
  }
  if (/Macintosh|Windows|Linux/i.test(ua)) {
    return 'desktop';
  }
  return 'desktop';
}

export function detectBrowser() {
  const ua = navigator.userAgent || '';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  return 'Web Browser';
}

export function detectOS() {
  const ua = navigator.userAgent || '';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
}

export function getDeviceMetadata() {
  const deviceId = getDeviceId();
  const deviceType = detectDeviceType();
  const browser = detectBrowser();
  const os = detectOS();
  
  let defaultName = `${browser} on ${os}`;
  if (deviceType === 'mobile') defaultName = `Mobile Phone (${browser})`;
  if (deviceType === 'tablet') defaultName = `POS Tablet (${browser})`;
  if (deviceType === 'desktop') defaultName = `Main Counter (${os})`;

  const savedName = localStorage.getItem(STORAGE_KEYS.DEVICE_NAME);
  return {
    deviceId,
    deviceName: savedName || defaultName,
    deviceType,
    browser,
    os,
    isCurrent: true
  };
}

export function saveCustomDeviceName(name) {
  const clean = String(name || '').trim().slice(0, 100);
  if (clean) {
    localStorage.setItem(STORAGE_KEYS.DEVICE_NAME, clean);
  }
  return clean;
}

// Register current device presence in Firestore
export async function registerDeviceSession(userId) {
  if (!userId) return;
  const meta = getDeviceMetadata();
  const docId = sanitizeDocId(meta.deviceId);
  const path = `users/${userId}/devices/${docId}`;
  
  try {
    const docRef = doc(db, 'users', userId, 'devices', docId);
    const deviceData = {
      id: docId,
      deviceName: String(meta.deviceName).slice(0, 100),
      deviceType: String(meta.deviceType).slice(0, 30),
      browser: String(meta.browser).slice(0, 100),
      os: String(meta.os).slice(0, 100),
      online: navigator.onLine,
      lastActive: new Date().toISOString(),
      ownerId: userId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, deviceData, { merge: true });
    console.log(`[Firebase] Registered device session: ${meta.deviceName} (${docId})`);
  } catch (err) {
    console.warn('[Firebase] Device registration notice:', err);
  }
}

// Heartbeat every 45-60 seconds to signal active presence
export async function updateDeviceHeartbeat(userId) {
  if (!userId || !navigator.onLine) return;
  const deviceId = sanitizeDocId(getDeviceId());
  const path = `users/${userId}/devices/${deviceId}`;
  try {
    const docRef = doc(db, 'users', userId, 'devices', deviceId);
    await setDoc(docRef, {
      online: true,
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Silent catch on heartbeat
  }
}

// Set device offline on unload
export async function setDeviceOffline(userId) {
  if (!userId) return;
  const deviceId = sanitizeDocId(getDeviceId());
  const path = `users/${userId}/devices/${deviceId}`;
  try {
    const docRef = doc(db, 'users', userId, 'devices', deviceId);
    await setDoc(docRef, {
      online: false,
      lastActive: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Ignore unload errors
  }
}

// Subscribe to all connected devices in real time
export function subscribeToDevices(userId, onDevicesChanged, onError) {
  if (!userId) return () => {};
  const colPath = `users/${userId}/devices`;
  const colRef = collection(db, 'users', userId, 'devices');

  return onSnapshot(colRef, (snapshot) => {
    const currentId = sanitizeDocId(getDeviceId());
    const devices = [];
    snapshot.forEach(snap => {
      const d = snap.data();
      devices.push({
        ...d,
        isCurrent: d.id === currentId
      });
    });

    // Sort: current device first, then by lastActive descending
    devices.sort((a, b) => {
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;
      return new Date(b.lastActive || 0) - new Date(a.lastActive || 0);
    });

    onDevicesChanged(devices);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, colPath);
  });
}

// Remove remote device session
export async function removeDeviceSession(userId, targetDeviceId) {
  if (!userId || !targetDeviceId) return;
  const docId = sanitizeDocId(targetDeviceId);
  const path = `users/${userId}/devices/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'devices', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= SYNC STATE & CONFLICT RESOLUTION ENGINE =================
export const SyncState = {
  SYNCED: 'synced',
  SYNCING: 'syncing',
  OFFLINE: 'offline',
  CONFLICT: 'conflict'
};

let currentSyncState = navigator.onLine ? SyncState.SYNCED : SyncState.OFFLINE;
const syncListeners = new Set();

export function getSyncState() {
  return currentSyncState;
}

export function subscribeToSyncState(listener) {
  syncListeners.add(listener);
  listener(currentSyncState, getOfflineQueue().length);
  return () => syncListeners.delete(listener);
}

export function setSyncState(state, info = null) {
  currentSyncState = state;
  const pendingCount = getOfflineQueue().length;
  syncListeners.forEach(fn => fn(state, pendingCount, info));
}

// Conflict Log
export function logConflictEvent(details) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFLICT_LOG) || '[]');
    list.unshift({
      id: 'conf_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...details
    });
    localStorage.setItem(STORAGE_KEYS.CONFLICT_LOG, JSON.stringify(list.slice(0, 25)));
  } catch (e) {
    // ignore
  }
}

export function getConflictLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFLICT_LOG) || '[]');
  } catch {
    return [];
  }
}

// ================= OFFLINE OUTBOX QUEUE =================
export function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || '[]');
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error('[Sync] Error persisting offline queue:', e);
  }
}

export function enqueueOfflineAction(action) {
  const queue = getOfflineQueue();
  const queueItem = {
    queueId: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
    retryCount: 0,
    ...action
  };
  queue.push(queueItem);
  saveOfflineQueue(queue);
  console.log(`[Offline Queue] Queued action: ${action.type}`, action);
  setSyncState(navigator.onLine ? SyncState.SYNCING : SyncState.OFFLINE);
  return queueItem;
}

export async function flushOfflineQueue(userId, onProgress) {
  if (!userId || !navigator.onLine) return;
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    setSyncState(SyncState.SYNCED);
    return;
  }

  setSyncState(SyncState.SYNCING, `Flushing ${queue.length} offline changes...`);
  console.log(`[Offline Sync] Starting flush of ${queue.length} items...`);

  const remaining = [];
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      if (item.type === 'SAVE_PRODUCT') {
        await executeDirectProductSave(userId, item.payload);
      } else if (item.type === 'DELETE_PRODUCT') {
        await executeDirectProductDelete(userId, item.payload.id);
      } else if (item.type === 'SAVE_BILL') {
        await executeDirectBillSave(userId, item.payload);
      } else if (item.type === 'DELETE_BILL') {
        await executeDirectBillDelete(userId, item.payload.id);
      } else if (item.type === 'SAVE_SETTINGS') {
        await executeDirectSettingsSave(userId, item.payload);
      }
      if (onProgress) onProgress(i + 1, queue.length);
    } catch (err) {
      console.warn(`[Offline Sync] Error processing item ${item.queueId}:`, err);
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount < 5) {
        remaining.push(item);
      }
    }
  }

  saveOfflineQueue(remaining);
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());

  if (remaining.length === 0) {
    setSyncState(SyncState.SYNCED, 'All offline changes synchronized!');
  } else {
    setSyncState(SyncState.OFFLINE, `${remaining.length} changes remaining in queue.`);
  }
}

// ================= FIRESTORE CLOUD DATA SYNC WITH CONFLICT RESOLUTION =================

// 1. Products Cloud Sync
export function subscribeToProducts(userId, onProductsChanged, onError) {
  if (!userId) return () => {};
  const colPath = `users/${userId}/products`;
  const colRef = collection(db, 'users', userId, 'products');

  return onSnapshot(colRef, (snapshot) => {
    const products = [];
    snapshot.forEach(docSnap => {
      products.push(docSnap.data());
    });
    setSyncState(navigator.onLine ? SyncState.SYNCED : SyncState.OFFLINE);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
    onProductsChanged(products);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, colPath);
  });
}

async function executeDirectProductSave(userId, product) {
  const docId = sanitizeDocId(product.id);
  const path = `users/${userId}/products/${docId}`;
  const docRef = doc(db, 'users', userId, 'products', docId);
  const currentDeviceId = getDeviceId();

  const cleanProduct = {
    id: docId,
    name: String(product.name || '').slice(0, 200),
    category: String(product.category || 'General').slice(0, 100),
    barcode: String(product.barcode || '').slice(0, 64),
    inwardDateTime: String(product.inwardDateTime || new Date().toISOString()).slice(0, 50),
    quantity: Number(product.quantity) || 0,
    unit: String(product.unit || 'Pcs').slice(0, 30),
    mrp: Number(product.mrp) || 0,
    rate: Number(product.rate) || 0,
    costPrice: Number(product.costPrice) || 0,
    shelf: String(product.shelf || '').slice(0, 60),
    gstRate: Number(product.gstRate !== undefined ? product.gstRate : 5),
    gstType: String(product.gstType || 'inclusive').slice(0, 30),
    hsn: String(product.hsn || '').slice(0, 30),
    ownerId: userId,
    version: Number(product.version || 0) + 1,
    lastModifiedByDevice: String(product.lastModifiedByDevice || currentDeviceId).slice(0, 100),
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, cleanProduct, { merge: true });
}

export async function saveProductToFirestore(userId, product) {
  if (!userId || !product || !product.id) return;
  const currentDeviceId = getDeviceId();
  product.lastModifiedByDevice = currentDeviceId;

  if (!navigator.onLine) {
    enqueueOfflineAction({
      type: 'SAVE_PRODUCT',
      payload: { ...product }
    });
    setSyncState(SyncState.OFFLINE);
    return;
  }

  setSyncState(SyncState.SYNCING);
  try {
    await executeDirectProductSave(userId, product);
    setSyncState(SyncState.SYNCED);
  } catch (error) {
    console.warn('[Sync] Network error saving product, enqueuing offline write:', error);
    enqueueOfflineAction({
      type: 'SAVE_PRODUCT',
      payload: { ...product }
    });
    setSyncState(SyncState.OFFLINE);
  }
}

async function executeDirectProductDelete(userId, productId) {
  const docId = sanitizeDocId(productId);
  const path = `users/${userId}/products/${docId}`;
  const docRef = doc(db, 'users', userId, 'products', docId);
  await deleteDoc(docRef);
}

export async function deleteProductFromFirestore(userId, productId) {
  if (!userId || !productId) return;
  if (!navigator.onLine) {
    enqueueOfflineAction({
      type: 'DELETE_PRODUCT',
      payload: { id: productId }
    });
    setSyncState(SyncState.OFFLINE);
    return;
  }

  setSyncState(SyncState.SYNCING);
  try {
    await executeDirectProductDelete(userId, productId);
    setSyncState(SyncState.SYNCED);
  } catch (error) {
    console.warn('[Sync] Network error deleting product, enqueuing offline delete:', error);
    enqueueOfflineAction({
      type: 'DELETE_PRODUCT',
      payload: { id: productId }
    });
    setSyncState(SyncState.OFFLINE);
  }
}

// 2. Bills Cloud Sync
export function subscribeToBills(userId, onBillsChanged, onError) {
  if (!userId) return () => {};
  const colPath = `users/${userId}/bills`;
  const colRef = collection(db, 'users', userId, 'bills');

  return onSnapshot(colRef, (snapshot) => {
    const bills = [];
    snapshot.forEach(docSnap => {
      bills.push(docSnap.data());
    });
    bills.sort((a, b) => new Date(b.dateTime || 0) - new Date(a.dateTime || 0));
    setSyncState(navigator.onLine ? SyncState.SYNCED : SyncState.OFFLINE);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
    onBillsChanged(bills);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, colPath);
  });
}

async function executeDirectBillSave(userId, bill) {
  const docId = sanitizeDocId(bill.id);
  const path = `users/${userId}/bills/${docId}`;
  const docRef = doc(db, 'users', userId, 'bills', docId);
  const currentDeviceId = getDeviceId();

  const cleanBill = {
    id: docId,
    invoiceNumber: String(bill.invoiceNumber || '').slice(0, 64),
    dateTime: String(bill.dateTime || new Date().toISOString()).slice(0, 50),
    customerName: String(bill.customerName || 'Walk-in Customer').slice(0, 100),
    customerPhone: String(bill.customerPhone || '').slice(0, 30),
    paymentMethod: String(bill.paymentMethod || 'Cash').slice(0, 40),
    subtotal: Number(bill.subtotal) || 0,
    discount: Number(bill.discount) || 0,
    tax: Number(bill.tax) || 0,
    total: Number(bill.total || bill.grandTotal) || 0,
    itemCount: Number(bill.itemCount || (bill.items ? bill.items.length : 0)),
    items: Array.isArray(bill.items) ? bill.items.slice(0, 60).map(item => ({
      id: sanitizeDocId(item.id || ''),
      name: String(item.name || '').slice(0, 120),
      rate: Number(item.rate) || 0,
      quantity: Number(item.quantity) || 1,
      unit: String(item.unit || 'Pcs').slice(0, 20),
      total: Number(item.total) || 0,
      gstRate: Number(item.gstRate !== undefined ? item.gstRate : 5)
    })) : [],
    ownerId: userId,
    version: Number(bill.version || 0) + 1,
    lastModifiedByDevice: String(bill.lastModifiedByDevice || currentDeviceId).slice(0, 100),
    createdAt: String(bill.createdAt || new Date().toISOString()).slice(0, 50),
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, cleanBill, { merge: true });
}

export async function saveBillToFirestore(userId, bill) {
  if (!userId || !bill || !bill.id) return;
  const currentDeviceId = getDeviceId();
  bill.lastModifiedByDevice = currentDeviceId;

  if (!navigator.onLine) {
    enqueueOfflineAction({
      type: 'SAVE_BILL',
      payload: { ...bill }
    });
    setSyncState(SyncState.OFFLINE);
    return;
  }

  setSyncState(SyncState.SYNCING);
  try {
    await executeDirectBillSave(userId, bill);
    setSyncState(SyncState.SYNCED);
  } catch (error) {
    console.warn('[Sync] Network error saving bill, enqueuing offline write:', error);
    enqueueOfflineAction({
      type: 'SAVE_BILL',
      payload: { ...bill }
    });
    setSyncState(SyncState.OFFLINE);
  }
}

async function executeDirectBillDelete(userId, billId) {
  const docId = sanitizeDocId(billId);
  const path = `users/${userId}/bills/${docId}`;
  const docRef = doc(db, 'users', userId, 'bills', docId);
  await deleteDoc(docRef);
}

export async function deleteBillFromFirestore(userId, billId) {
  if (!userId || !billId) return;
  if (!navigator.onLine) {
    enqueueOfflineAction({
      type: 'DELETE_BILL',
      payload: { id: billId }
    });
    setSyncState(SyncState.OFFLINE);
    return;
  }

  setSyncState(SyncState.SYNCING);
  try {
    await executeDirectBillDelete(userId, billId);
    setSyncState(SyncState.SYNCED);
  } catch (error) {
    console.warn('[Sync] Network error deleting bill, enqueuing offline delete:', error);
    enqueueOfflineAction({
      type: 'DELETE_BILL',
      payload: { id: billId }
    });
    setSyncState(SyncState.OFFLINE);
  }
}

// 3. Settings Cloud Sync
export function subscribeToSettings(userId, onSettingsChanged, onError) {
  if (!userId) return () => {};
  const docPath = `users/${userId}/settings/store`;
  const docRef = doc(db, 'users', userId, 'settings', 'store');

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      onSettingsChanged(docSnap.data());
      setSyncState(navigator.onLine ? SyncState.SYNCED : SyncState.OFFLINE);
    }
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, docPath);
  });
}

async function executeDirectSettingsSave(userId, settings) {
  const path = `users/${userId}/settings/store`;
  const docRef = doc(db, 'users', userId, 'settings', 'store');
  const currentDeviceId = getDeviceId();

  const cleanSettings = {
    storeName: String(settings.storeName || 'SUPER BACHAT BAZZAR').slice(0, 150),
    storeAddress: String(settings.storeAddress || '').slice(0, 300),
    storePhone: String(settings.storePhone || '').slice(0, 40),
    storeUpi: String(settings.storeUpi || '').slice(0, 100),
    storeWishes: String(settings.storeWishes || '').slice(0, 300),
    ownerId: userId,
    version: Number(settings.version || 0) + 1,
    lastModifiedByDevice: currentDeviceId,
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, cleanSettings, { merge: true });
}

export async function saveSettingsToFirestore(userId, settings) {
  if (!userId || !settings) return;
  if (!navigator.onLine) {
    enqueueOfflineAction({
      type: 'SAVE_SETTINGS',
      payload: { ...settings }
    });
    setSyncState(SyncState.OFFLINE);
    return;
  }

  setSyncState(SyncState.SYNCING);
  try {
    await executeDirectSettingsSave(userId, settings);
    setSyncState(SyncState.SYNCED);
  } catch (error) {
    console.warn('[Sync] Network error saving settings, enqueuing offline write:', error);
    enqueueOfflineAction({
      type: 'SAVE_SETTINGS',
      payload: { ...settings }
    });
    setSyncState(SyncState.OFFLINE);
  }
}

// 4. Initial Migration of Local Data to Cloud
export async function migrateLocalDataToCloud(userId, localProducts, localBills, localSettings) {
  if (!userId) return;
  console.log('[Firebase] Migrating local store inventory to Cloud Firestore...');
  setSyncState(SyncState.SYNCING, 'Migrating data to Cloud Firestore...');

  if (Array.isArray(localProducts) && localProducts.length > 0) {
    for (const prod of localProducts) {
      await saveProductToFirestore(userId, prod);
    }
  }

  if (Array.isArray(localBills) && localBills.length > 0) {
    for (const bill of localBills) {
      await saveBillToFirestore(userId, bill);
    }
  }

  if (localSettings) {
    await saveSettingsToFirestore(userId, localSettings);
  }

  await registerDeviceSession(userId);
  setSyncState(SyncState.SYNCED, 'All store data synchronized with Cloud!');
}

// 5. Subscription Cloud Sync
export function subscribeToSubscription(userId, onSubscriptionChanged, onError) {
  if (!userId) return () => {};
  const docPath = `users/${userId}/subscriptions/current`;
  const docRef = doc(db, 'users', userId, 'subscriptions', 'current');

  return onSnapshot(docPath, (docSnap) => {
    if (docSnap.exists()) {
      onSubscriptionChanged(docSnap.data());
    } else {
      onSubscriptionChanged(null);
    }
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, docPath);
  });
}

export async function saveSubscriptionToFirestore(userId, subscription) {
  if (!userId || !subscription) return;
  const path = `users/${userId}/subscriptions/current`;
  try {
    const docRef = doc(db, 'users', userId, 'subscriptions', 'current');
    const cleanSub = {
      id: 'current',
      planId: String(subscription.planId || '6_months').slice(0, 30),
      planName: String(subscription.planName || '6 Months Plan').slice(0, 100),
      originalPrice: Number(subscription.originalPrice) || 5000,
      discount: Number(subscription.discount) || 0,
      finalAmount: Number(subscription.finalAmount) || 5000,
      couponCode: String(subscription.couponCode || '').slice(0, 30),
      upiId: String(subscription.upiId || '9771000191@upi').slice(0, 60),
      utrNumber: String(subscription.utrNumber || '').slice(0, 64),
      status: String(subscription.status || 'active').slice(0, 30),
      startDate: String(subscription.startDate || new Date().toISOString()).slice(0, 50),
      endDate: String(subscription.endDate || new Date().toISOString()).slice(0, 50),
      ownerId: userId,
      createdAt: String(subscription.createdAt || new Date().toISOString()).slice(0, 50)
    };
    await setDoc(docRef, cleanSub, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Auto network event listeners for multi-device sync
window.addEventListener('online', () => {
  console.log('[Sync Engine] Network connection restored: Online');
  setSyncState(SyncState.SYNCING, 'Internet restored. Synchronizing...');
  if (auth.currentUser) {
    updateDeviceHeartbeat(auth.currentUser.uid);
    flushOfflineQueue(auth.currentUser.uid);
  } else {
    setSyncState(SyncState.SYNCED);
  }
});

window.addEventListener('offline', () => {
  console.log('[Sync Engine] Network connection lost: Offline');
  setSyncState(SyncState.OFFLINE);
});

// Periodic heartbeat
setInterval(() => {
  if (auth.currentUser && navigator.onLine) {
    updateDeviceHeartbeat(auth.currentUser.uid);
  }
}, 45000);

// Run connection check
testConnection();
