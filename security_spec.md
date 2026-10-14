# Security Specification: Super Bachat Bazzar POS

## 1. Data Invariants
1. **User Data Isolation**: Every resource belongs strictly under `/users/{userId}/...` matching `request.auth.uid`. A merchant cannot read, modify, or list documents belonging to another merchant.
2. **Identity Integrity**: `incoming().ownerId` must strictly equal `request.auth.uid`. Spoofing ownership or delegating access across tenants is mathematically denied.
3. **Immutability of IDs & Ownership**: During updates, `incoming().id == existing().id` and `incoming().ownerId == existing().ownerId`.
4. **Boundary Limits**: Document ID path parameters must strictly satisfy `isValidId()` (length <= 128 characters, matching `^[a-zA-Z0-9_\-]+$`).
5. **No Blanket Reads**: All read and list operations evaluate `request.auth != null && request.auth.uid == userId`.
6. **Strict Key & Type Safety**: Required fields must exist, unknown ghost fields are blocked on updates, and numeric values (rate, quantity, mrp, total) cannot be poisoned with negative or non-numeric types.

---

## 2. The Dirty Dozen Payloads (Designed to Break Identity & Integrity)

1. **Payload 1: Unauthenticated Read**
   - Attempt: Read `/users/merchant_123/products/prod_1` with `request.auth == null`
   - Expected: `PERMISSION_DENIED`
2. **Payload 2: Cross-Tenant Product Read**
   - Attempt: Authenticated as `merchant_456`, attempt to read `/users/merchant_123/products/prod_1`
   - Expected: `PERMISSION_DENIED`
3. **Payload 3: Owner ID Identity Spoofing on Product Create**
   - Attempt: Authenticated as `merchant_123`, create product with `ownerId: "merchant_victim"`
   - Expected: `PERMISSION_DENIED`
4. **Payload 4: Path Traversal / Poisoned Document ID**
   - Attempt: Write to `/users/merchant_123/products/../../passwords/root`
   - Expected: `PERMISSION_DENIED`
5. **Payload 5: Oversized Junk Document ID Denial-of-Wallet Attack**
   - Attempt: Create product with ID consisting of 5,000 characters
   - Expected: `PERMISSION_DENIED`
6. **Payload 6: Missing Required Name Field on Product**
   - Attempt: Create product with `{ id: "prod_1", rate: 50, ownerId: "merchant_123" }` without `name`
   - Expected: `PERMISSION_DENIED`
7. **Payload 7: Shadow Field Injection (Ghost Admin Flag)**
   - Attempt: Update product with `{ isAdmin: true, role: "superadmin" }`
   - Expected: `PERMISSION_DENIED`
8. **Payload 8: Immutable Owner Tampering on Update**
   - Attempt: Authenticated as `merchant_123`, update product with `ownerId: "merchant_hacker"`
   - Expected: `PERMISSION_DENIED`
9. **Payload 9: Bill Negative Total / Poisoned Price Value**
   - Attempt: Create bill with `total: "free"` or `total: -500`
   - Expected: `PERMISSION_DENIED`
10. **Payload 10: Bill Cross-Merchant Theft**
    - Attempt: Authenticated as `merchant_456`, attempt to list `/users/merchant_123/bills`
    - Expected: `PERMISSION_DENIED`
11. **Payload 11: Store Settings Hijack by Third Party**
    - Attempt: Authenticated as `merchant_456`, update `/users/merchant_123/settings/store`
    - Expected: `PERMISSION_DENIED`
12. **Payload 12: Root Catch-All Denial**
    - Attempt: Write to `/admins/root` or arbitrary root documents
    - Expected: `PERMISSION_DENIED`

---

## 3. Test Runner (`firestore.rules.test.ts`)
The automated test runner asserts that all 12 dirty payloads are intercepted and return `PERMISSION_DENIED` by the security rules engine.
