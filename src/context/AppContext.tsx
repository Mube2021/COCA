import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Customer,
  SalesInvoice,
  StockMovement,
  Vehicle,
  DeliveryRoute,
  BottleLedger,
  Expense,
  Employee,
  AuditLog,
  SystemNotification,
  Role,
  Language,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_MOVEMENTS,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_BOTTLE_LEDGERS,
  INITIAL_EXPENSES,
  INITIAL_EMPLOYEES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  db,
  auth,
  loginWithGoogle,
  logoutUser,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AppContextType {
  // Firebase Auth & Connectivity
  user: User | null;
  isFirebaseConnected: boolean;
  loginWithGoogle: () => Promise<User | void>;
  logoutUser: () => Promise<void>;

  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  t: (enText: string, omText: string) => string;

  // Data Collections
  products: Product[];
  customers: Customer[];
  invoices: SalesInvoice[];
  stockMovements: StockMovement[];
  vehicles: Vehicle[];
  deliveryRoutes: DeliveryRoute[];
  bottleLedgers: BottleLedger[];
  expenses: Expense[];
  employees: Employee[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];

  // Modals
  isBarcodeScannerOpen: boolean;
  setIsBarcodeScannerOpen: (open: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  scannedResult: string | null;
  setScannedResult: (res: string | null) => void;

  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  addCustomer: (customer: Omit<Customer, 'id' | 'currentBalance' | 'totalPurchases'>) => void;
  updateCustomer: (customer: Customer) => void;
  receiveCustomerPayment: (customerId: string, amountETB: number, paymentMethod: string) => void;

  createInvoice: (invoiceData: Omit<SalesInvoice, 'id' | 'invoiceNo' | 'date'>) => void;
  updateInvoiceStatus: (id: string, status: SalesInvoice['paymentStatus']) => void;

  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  recordBottleReturn: (ledger: Omit<BottleLedger, 'id' | 'date'>) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateRouteStatus: (routeId: string, status: DeliveryRoute['status']) => void;

  markNotificationRead: (id: string) => void;
  addAuditLog: (action: string, details: string) => void;

  // Public Order Submission
  submitPublicOrder: (customerName: string, phone: string, location: string, cartItems: { productId: string; crates: number }[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('HOME');
  const [currentRole, setCurrentRole] = useState<Role>('Administrator');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Local & Firestore synced state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_INVOICES);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_MOVEMENTS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [deliveryRoutes, setDeliveryRoutes] = useState<DeliveryRoute[]>(INITIAL_ROUTES);
  const [bottleLedgers, setBottleLedgers] = useState<BottleLedger[]>(INITIAL_BOTTLE_LEDGERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Modals
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync Products with Firestore
  useEffect(() => {
    const path = 'products';
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => items.push(docSnap.data() as Product));
          setProducts(items);
        } else {
          // Seed Firestore with initial mock products
          INITIAL_PRODUCTS.forEach(async (p) => {
            try {
              await setDoc(doc(db, path, p.id), p);
            } catch (err) {
              console.warn('Seeding product failed:', err);
            }
          });
        }
        setIsFirebaseConnected(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Sync Customers with Firestore
  useEffect(() => {
    const path = 'customers';
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Customer[] = [];
          snapshot.forEach((docSnap) => items.push(docSnap.data() as Customer));
          setCustomers(items);
        } else {
          INITIAL_CUSTOMERS.forEach(async (c) => {
            try {
              await setDoc(doc(db, path, c.id), c);
            } catch (err) {
              console.warn('Seeding customer failed:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Sync Sales Invoices with Firestore
  useEffect(() => {
    const path = 'salesOrders';
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: SalesInvoice[] = [];
          snapshot.forEach((docSnap) => items.push(docSnap.data() as SalesInvoice));
          setInvoices(items);
        } else {
          INITIAL_INVOICES.forEach(async (inv) => {
            try {
              await setDoc(doc(db, path, inv.id), inv);
            } catch (err) {
              console.warn('Seeding invoice failed:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Sync Delivery Routes with Firestore
  useEffect(() => {
    const path = 'deliveryRoutes';
    const unsub = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: DeliveryRoute[] = [];
          snapshot.forEach((docSnap) => items.push(docSnap.data() as DeliveryRoute));
          setDeliveryRoutes(items);
        } else {
          INITIAL_ROUTES.forEach(async (r) => {
            try {
              await setDoc(doc(db, path, r.id), r);
            } catch (err) {
              console.warn('Seeding route failed:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsub();
  }, []);

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (enText: string, omText: string) => {
    return language === 'om' ? omText : enText;
  };

  const addAuditLog = async (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      userRole: currentRole,
      userName: user ? (user.displayName || user.email || 'Google User') : (currentRole === 'Administrator' ? 'Mohammed Awel' : `${currentRole} User`),
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Firestore sync
    const path = `auditLogs/${newLog.id}`;
    try {
      await setDoc(doc(db, 'auditLogs', newLog.id), newLog);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id };
    setProducts((prev) => [newProduct, ...prev]);

    const path = `products/${id}`;
    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    addAuditLog('ADD_PRODUCT', `Added new product "${newProduct.name} ${newProduct.bottleSize}"`);
  };

  const editProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    const path = `products/${updated.id}`;
    try {
      await setDoc(doc(db, 'products', updated.id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    addAuditLog('EDIT_PRODUCT', `Updated product "${updated.name} ${updated.bottleSize}"`);
  };

  const deleteProduct = async (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
    addAuditLog('DELETE_PRODUCT', `Deleted product "${target?.name || id}"`);
  };

  const addCustomer = async (data: Omit<Customer, 'id' | 'currentBalance' | 'totalPurchases'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      currentBalance: 0,
      totalPurchases: 0,
    };
    setCustomers((prev) => [newCust, ...prev]);
    const path = `customers/${newCust.id}`;
    try {
      await setDoc(doc(db, 'customers', newCust.id), newCust);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    addAuditLog('ADD_CUSTOMER', `Registered customer "${newCust.businessName}" (${newCust.location})`);
  };

  const updateCustomer = async (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    const path = `customers/${updated.id}`;
    try {
      await setDoc(doc(db, 'customers', updated.id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
    addAuditLog('UPDATE_CUSTOMER', `Updated customer profile for "${updated.businessName}"`);
  };

  const receiveCustomerPayment = async (customerId: string, amountETB: number, paymentMethod: string) => {
    let updatedCust: Customer | null = null;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = Math.max(0, c.currentBalance - amountETB);
          const newStatus = newBal <= c.creditLimit ? 'ACTIVE' : c.status;
          updatedCust = {
            ...c,
            currentBalance: newBal,
            status: newStatus,
          };
          return updatedCust;
        }
        return c;
      })
    );
    if (updatedCust) {
      try {
        await setDoc(doc(db, 'customers', customerId), updatedCust);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `customers/${customerId}`);
      }
    }
    const target = customers.find((c) => c.id === customerId);
    addAuditLog('PAYMENT_RECEIVED', `Received ${amountETB.toLocaleString()} ETB payment from ${target?.businessName} via ${paymentMethod}`);
  };

  const createInvoice = async (invoiceData: Omit<SalesInvoice, 'id' | 'invoiceNo' | 'date'>) => {
    const date = new Date().toISOString().split('T')[0];
    const invoiceNo = `MACD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: SalesInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNo,
      date,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    try {
      await setDoc(doc(db, 'salesOrders', newInvoice.id), newInvoice);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `salesOrders/${newInvoice.id}`);
    }

    // Deduct Stock
    invoiceData.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId) {
            const newStock = Math.max(0, p.stockBottles - item.totalBottles);
            const newCrates = Math.floor(newStock / 24);
            const updatedP = {
              ...p,
              stockBottles: newStock,
              cratesInStock: newCrates,
            };
            setDoc(doc(db, 'products', p.id), updatedP).catch(() => {});
            return updatedP;
          }
          return p;
        })
      );

      // Record Stock Movement
      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        date: new Date().toLocaleString(),
        productId: item.productId,
        productName: `${item.productName} (${item.bottleSize})`,
        type: 'OUT',
        quantityBottles: item.totalBottles,
        warehouse: 'Main Warehouse - Bedele',
        handledBy: `${currentRole} - Sales Dispatch`,
        notes: `Sales Invoice #${invoiceNo}`,
      };
      setStockMovements((prev) => [movement, ...prev]);
    });

    addAuditLog('CREATE_INVOICE', `Created invoice #${invoiceNo} for ${invoiceData.customerName} - Total: ${invoiceData.grandTotal.toLocaleString()} ETB`);
  };

  const updateInvoiceStatus = async (id: string, status: SalesInvoice['paymentStatus']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updatedInv = { ...inv, paymentStatus: status };
          setDoc(doc(db, 'salesOrders', id), updatedInv).catch(() => {});
          return updatedInv;
        }
        return inv;
      })
    );
    addAuditLog('UPDATE_INVOICE_STATUS', `Updated invoice #${id} payment status to ${status}`);
  };

  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'date'>) => {
    const movement: StockMovement = {
      ...movementData,
      id: `mov-${Date.now()}`,
      date: new Date().toLocaleString(),
    };
    setStockMovements((prev) => [movement, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === movement.productId) {
          let change = 0;
          if (movement.type === 'IN' || movement.type === 'RETURN_EMPTY') change = movement.quantityBottles;
          if (movement.type === 'OUT' || movement.type === 'DAMAGED') change = -movement.quantityBottles;

          const updatedBottles = Math.max(0, p.stockBottles + change);
          const updatedP = {
            ...p,
            stockBottles: updatedBottles,
            cratesInStock: Math.floor(updatedBottles / 24),
          };
          setDoc(doc(db, 'products', p.id), updatedP).catch(() => {});
          return updatedP;
        }
        return p;
      })
    );

    addAuditLog('STOCK_MOVEMENT', `Stock adjustment [${movement.type}] ${movement.quantityBottles} bottles of ${movement.productName}`);
  };

  const recordBottleReturn = async (data: Omit<BottleLedger, 'id' | 'date'>) => {
    const ledger: BottleLedger = {
      ...data,
      id: `bot-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setBottleLedgers((prev) => [ledger, ...prev]);

    const path = `bottleTransactions/${ledger.id}`;
    try {
      await setDoc(doc(db, 'bottleTransactions', ledger.id), ledger);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === data.customerId) {
          const depositCredit = data.emptyReturnedBottles * 10;
          const updatedC = {
            ...c,
            depositBalance: Math.max(0, c.depositBalance + depositCredit),
          };
          setDoc(doc(db, 'customers', c.id), updatedC).catch(() => {});
          return updatedC;
        }
        return c;
      })
    );

    addAuditLog('BOTTLE_RETURN', `Recorded bottle return for ${data.customerName}: ${data.emptyReturnedBottles} empties returned, ${data.brokenBottles} broken`);
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses((prev) => [newExp, ...prev]);

    const path = `financialRecords/${newExp.id}`;
    try {
      await setDoc(doc(db, 'financialRecords', newExp.id), {
        id: newExp.id,
        type: 'EXPENSE',
        amountETB: newExp.amount,
        category: newExp.category,
        description: newExp.description,
        date: newExp.date,
        recordedBy: newExp.recordedBy || 'System',
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    addAuditLog('ADD_EXPENSE', `Recorded expense "${newExp.description}" - ${newExp.amount.toLocaleString()} ETB`);
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);

    const path = `employees/${newEmp.id}`;
    try {
      await setDoc(doc(db, 'employees', newEmp.id), newEmp);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }

    addAuditLog('ADD_EMPLOYEE', `Added employee ${newEmp.fullName} (${newEmp.role})`);
  };

  const updateRouteStatus = async (routeId: string, status: DeliveryRoute['status']) => {
    setDeliveryRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const updatedRoute = { ...r, status };
          setDoc(doc(db, 'deliveryRoutes', routeId), updatedRoute).catch(() => {});
          return updatedRoute;
        }
        return r;
      })
    );
    addAuditLog('UPDATE_ROUTE_STATUS', `Updated delivery route #${routeId} status to ${status}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const submitPublicOrder = (
    customerName: string,
    phone: string,
    location: string,
    cartItems: { productId: string; crates: number }[]
  ) => {
    const orderNo = `PUB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif: SystemNotification = {
      id: `notif-pub-${Date.now()}`,
      title: `New Online Order: ${orderNo}`,
      message: `Customer ${customerName} (${phone}, ${location}) requested ${cartItems.reduce((acc, i) => acc + i.crates, 0)} crates.`,
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('PUBLIC_ORDER_SUBMITTED', `Received online order request ${orderNo} from ${customerName}`);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isFirebaseConnected,
        loginWithGoogle,
        logoutUser,
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        products,
        customers,
        invoices,
        stockMovements,
        vehicles,
        deliveryRoutes,
        bottleLedgers,
        expenses,
        employees,
        auditLogs,
        notifications,
        isBarcodeScannerOpen,
        setIsBarcodeScannerOpen,
        isCopilotOpen,
        setIsCopilotOpen,
        scannedResult,
        setScannedResult,
        addProduct,
        editProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        receiveCustomerPayment,
        createInvoice,
        updateInvoiceStatus,
        addStockMovement,
        recordBottleReturn,
        addExpense,
        addEmployee,
        updateRouteStatus,
        markNotificationRead,
        addAuditLog,
        submitPublicOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
