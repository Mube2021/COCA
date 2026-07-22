export type Role = 
  | 'Administrator'
  | 'Manager'
  | 'Sales Officer'
  | 'Warehouse Officer'
  | 'Cashier'
  | 'Driver'
  | 'Accountant';

export type UserRole = Role;

export type Language = 'en' | 'om'; // English or Afaan Oromo

export type BottleType = '300ml Glass' | '1 Liter' | '350ml PET' | 'Can';

export interface Product {
  id: string;
  name: string;
  bottleSize: string;
  category: 'Carbonated Soft Drink' | 'Juice' | 'Energy' | 'Water';
  unitPrice: number; // in ETB (Ethiopian Birr)
  costPrice: number; // in ETB
  stockBottles: number;
  cratesInStock: number; // 24 bottles = 1 crate
  minStockAlert: number;
  barcode: string;
  qrCode: string;
  image: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'DAMAGED' | 'RETURN_EMPTY';
  quantityBottles: number;
  warehouse: string;
  handledBy: string;
  notes?: string;
}

export interface Customer {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  location: string; // e.g. Bedele Town, Metu Road, Chora Market
  creditLimit: number; // ETB
  currentBalance: number; // ETB (positive means money owed to distributor)
  depositBalance: number; // ETB for glass bottle deposits
  lastPurchaseDate: string;
  totalPurchases: number; // ETB
  status: 'ACTIVE' | 'CREDIT_LOCKED' | 'INACTIVE';
}

export interface OrderItem {
  productId: string;
  productName: string;
  bottleSize: string;
  cratesQuantity: number;
  totalBottles: number;
  unitPrice: number; // per bottle
  totalPrice: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  vatAmount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'Bank Transfer (CBE)' | 'Credit Account' | 'Mobile Money (Telebirr)';
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  fullBottlesDelivered: number;
  emptyBottlesReturned: number;
  depositCharged: number;
  notes?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string; // e.g. Isuzu FSR, Toyota Hilux
  capacityCrates: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'MAINTENANCE';
  fuelCostThisMonth: number;
}

export interface DeliveryRoute {
  id: string;
  routeCode: string;
  towns: string[]; // e.g. ['Bedele Town', 'Chora', 'Dembi']
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'DELAYED';
  assignedOrdersCount: number;
  totalBottlesToDeliver: number;
  scheduledDate: string;
  proofOfDeliverySubmitted?: boolean;
}

export interface BottleLedger {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  fullIssuedBottles: number;
  emptyReturnedBottles: number;
  brokenBottles: number;
  lostBottles: number;
  depositAmount: number;
}

export interface Expense {
  id: string;
  date: string;
  category: 'Fuel & Transport' | 'Driver & Staff Salaries' | 'Warehouse Maintenance' | 'Bottle Damage Expense' | 'Bank Charges' | 'Utilities & Rent' | 'Other';
  description: string;
  amount: number; // ETB
  recordedBy: string;
}

export interface Employee {
  id: string;
  fullName: string;
  role: Role;
  phone: string;
  department: string;
  monthlySalary: number;
  attendanceStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  deliveriesCompleted?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: string;
  userName: string;
  action: string;
  details: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  timestamp: string;
  read: boolean;
}
