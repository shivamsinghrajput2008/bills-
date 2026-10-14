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

// ================= GOOGLE AUTHENTICATION =================
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In failed:', err);
    throw err;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
    throw err;
  }
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ================= FIRESTORE CLOUD DATA SYNC =================

// Sanitize string keys and characters for Firestore document IDs
export function sanitizeDocId(id) {
  return String(id || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
}

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
    onProductsChanged(products);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, colPath);
  });
}

export async function saveProductToFirestore(userId, product) {
  if (!userId || !product || !product.id) return;
  const docId = sanitizeDocId(product.id);
  const path = `users/${userId}/products/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'products', docId);
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
      ownerId: userId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, cleanProduct);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(userId, productId) {
  if (!userId || !productId) return;
  const docId = sanitizeDocId(productId);
  const path = `users/${userId}/products/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'products', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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
    // Sort by dateTime descending
    bills.sort((a, b) => new Date(b.dateTime || 0) - new Date(a.dateTime || 0));
    onBillsChanged(bills);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, colPath);
  });
}

export async function saveBillToFirestore(userId, bill) {
  if (!userId || !bill || !bill.id) return;
  const docId = sanitizeDocId(bill.id);
  const path = `users/${userId}/bills/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'bills', docId);
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
      total: Number(bill.total) || 0,
      itemCount: Number(bill.itemCount || (bill.items ? bill.items.length : 0)),
      items: Array.isArray(bill.items) ? bill.items.slice(0, 50).map(item => ({
        id: sanitizeDocId(item.id || ''),
        name: String(item.name || '').slice(0, 120),
        rate: Number(item.rate) || 0,
        quantity: Number(item.quantity) || 1,
        unit: String(item.unit || 'Pcs').slice(0, 20),
        total: Number(item.total) || 0
      })) : [],
      ownerId: userId,
      createdAt: String(bill.createdAt || new Date().toISOString()).slice(0, 50)
    };
    await setDoc(docRef, cleanBill);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBillFromFirestore(userId, billId) {
  if (!userId || !billId) return;
  const docId = sanitizeDocId(billId);
  const path = `users/${userId}/bills/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'bills', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
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
    }
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, docPath);
  });
}

export async function saveSettingsToFirestore(userId, settings) {
  if (!userId || !settings) return;
  const path = `users/${userId}/settings/store`;
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'store');
    const cleanSettings = {
      storeName: String(settings.storeName || 'SUPER BACHAT BAZZAR').slice(0, 150),
      storeAddress: String(settings.storeAddress || '').slice(0, 300),
      storePhone: String(settings.storePhone || '').slice(0, 40),
      storeUpi: String(settings.storeUpi || '').slice(0, 100),
      storeWishes: String(settings.storeWishes || '').slice(0, 300),
      ownerId: userId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, cleanSettings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 4. Initial Migration of Local Data to Cloud
export async function migrateLocalDataToCloud(userId, localProducts, localBills, localSettings) {
  if (!userId) return;
  console.log('[Firebase] Migrating local store inventory to Cloud Firestore...');

  // Upload products
  if (Array.isArray(localProducts) && localProducts.length > 0) {
    for (const prod of localProducts) {
      await saveProductToFirestore(userId, prod);
    }
  }

  // Upload bills
  if (Array.isArray(localBills) && localBills.length > 0) {
    for (const bill of localBills) {
      await saveBillToFirestore(userId, bill);
    }
  }

  // Upload settings
  if (localSettings) {
    await saveSettingsToFirestore(userId, localSettings);
  }

  console.log('[Firebase] Cloud data sync migration completed.');
}

// 5. Subscription Cloud Sync
export function subscribeToSubscription(userId, onSubscriptionChanged, onError) {
  if (!userId) return () => {};
  const docPath = `users/${userId}/subscriptions/current`;
  const docRef = doc(db, 'users', userId, 'subscriptions', 'current');

  return onSnapshot(docRef, (docSnap) => {
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
    await setDoc(docRef, cleanSub);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Run connection check
testConnection();

