# Security Specification & Test Suite

## 1. Data Invariants

- **Authentication & Verification**: All write operations require an authenticated user.
- **Product Inventory**: Product ID must be non-empty, stock numbers must be numeric and non-negative, and name/bottle size must adhere to max length constraints.
- **Customer CRM**: Customer status must be one of 'ACTIVE', 'INACTIVE', or 'SUSPENDED'. Credit limit and balance must be numeric.
- **Sales Orders**: Grand total must be positive number. Invoice numbers must be strings up to 50 chars.
- **Delivery Routes**: Route status must be 'SCHEDULED', 'LOADING', 'IN_TRANSIT', or 'COMPLETED'.
- **Bottle Transactions**: Crates issued and returned must be numeric.
- **Financial Records**: Type must be 'REVENUE' or 'EXPENSE'. Amount must be a positive number.
- **Employees**: Monthly salary must be non-negative. Role must be a recognized distributor role.
- **Audit Logs**: Timestamps and user actions cannot be modified once created.

## 2. Dirty Dozen Security Test Payloads

1. **Unauthenticated Write**: Attempt to write a product without `request.auth`. Expected: `PERMISSION_DENIED`.
2. **Invalid Product String Size**: Write product with 500-char name. Expected: `PERMISSION_DENIED`.
3. **Negative Stock**: Write product with `stockBottles: -50`. Expected: `PERMISSION_DENIED`.
4. **Invalid Customer Status**: Set customer status to `HACKED`. Expected: `PERMISSION_DENIED`.
5. **Junk Document ID**: Attempt write to path `/products/!!!<script>alert(1)</script>!!!`. Expected: `PERMISSION_DENIED`.
6. **Negative Invoice Total**: Write SalesOrder with `grandTotal: -1000`. Expected: `PERMISSION_DENIED`.
7. **Invalid Financial Type**: Write FinancialRecord with `type: 'STOLEN'`. Expected: `PERMISSION_DENIED`.
8. **Negative Crate Return**: Write BottleTransaction with `cratesReturned: -10`. Expected: `PERMISSION_DENIED`.
9. **Shadow Field Injection**: Inject `__isSuperAdmin: true` into Employee record. Expected: `PERMISSION_DENIED`.
10. **Immutable Audit Timestamp Tampering**: Attempt to update `timestamp` on existing AuditLog. Expected: `PERMISSION_DENIED`.
11. **Excessive Field Injection**: Write Customer document with 30 arbitrary unlisted keys. Expected: `PERMISSION_DENIED`.
12. **Malicious Route Status Injection**: Update DeliveryRoute status to `HIJACKED`. Expected: `PERMISSION_DENIED`.

## 3. Test Runner Coverage

All tests assert that invalid schema writes, missing auth, and payload tampering result in explicit rule rejection.
