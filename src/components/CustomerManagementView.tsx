import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Plus,
  Edit2,
  DollarSign,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertOctagon,
  Search,
  X,
  CreditCard,
} from 'lucide-react';

export const CustomerManagementView: React.FC = () => {
  const { customers, addCustomer, updateCustomer, receiveCustomerPayment, t } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Payment Receipt Modal State
  const [selectedPaymentCustomer, setSelectedPaymentCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(10000);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Transfer (CBE)');

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+251 91 ');
  const [location, setLocation] = useState('Bedele Town');
  const [creditLimit, setCreditLimit] = useState<number>(100000);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setBusinessName('');
    setOwnerName('');
    setPhone('+251 91 ');
    setLocation('Bedele Town Center');
    setCreditLimit(100000);
    setIsCustomerModalOpen(true);
  };

  const handleOpenEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setBusinessName(c.businessName);
    setOwnerName(c.ownerName);
    setPhone(c.phone);
    setLocation(c.location);
    setCreditLimit(c.creditLimit);
    setIsCustomerModalOpen(true);
  };

  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        businessName,
        ownerName,
        phone,
        location,
        creditLimit: Number(creditLimit),
      });
    } else {
      addCustomer({
        businessName,
        ownerName,
        phone,
        location,
        creditLimit: Number(creditLimit),
        depositBalance: 2400,
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
    }
    setIsCustomerModalOpen(false);
  };

  const handleReceivePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentCustomer) return;
    receiveCustomerPayment(selectedPaymentCustomer.id, Number(paymentAmount), paymentMethod);
    setSelectedPaymentCustomer(null);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#E41E26]" />
            <span>Customer & Credit Account Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered wholesale retailers, hotels, and supermarkets across Buno Bedele Zone.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-[#E41E26] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search business name, owner, phone, or town..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-medium"
        >
          <option value="ALL">All Account Statuses</option>
          <option value="ACTIVE">Active (Safe Credit)</option>
          <option value="CREDIT_LOCKED">Credit Locked (Over Limit)</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => {
          const isOverLimit = c.currentBalance > c.creditLimit;
          return (
            <div
              key={c.id}
              className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                isOverLimit
                  ? 'border-red-300 dark:border-red-900 bg-red-50/10'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {c.businessName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 flex items-center space-x-1 mt-0.5">
                      <span>Owner: {c.ownerName}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center ${
                      c.status === 'CREDIT_LOCKED' || isOverLimit
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isOverLimit || c.status === 'CREDIT_LOCKED' ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{c.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{c.location}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Credit Limit:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {c.creditLimit.toLocaleString()} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Outstanding Balance:</span>
                    <span
                      className={`font-black ${
                        isOverLimit ? 'text-red-600' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {c.currentBalance.toLocaleString()} ETB
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400">Glass Deposit Credit:</span>
                    <span className="font-bold text-emerald-600">
                      +{c.depositBalance.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedPaymentCustomer(c);
                    setPaymentAmount(Math.min(c.currentBalance, 25000));
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Receive Payment</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(c)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition"
                  title="Edit Customer Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              {editingCustomer ? 'Edit Customer Profile' : 'Register New Retail Customer'}
            </h3>

            <form onSubmit={handleSubmitCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bedele Supermarket"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Owner / Contact Manager Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ato Kebede Tufa"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Town / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Approved Credit Limit (ETB)
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-red-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E41E26] hover:bg-red-700 text-white rounded-lg font-bold shadow"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {selectedPaymentCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 relative">
            <button
              onClick={() => setSelectedPaymentCustomer(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
              Receive Customer Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedPaymentCustomer.businessName}</p>

            <form onSubmit={handleReceivePayment} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-slate-500">Current Balance Due:</span>
                <span className="font-black text-red-600 text-sm">
                  {selectedPaymentCustomer.currentBalance.toLocaleString()} ETB
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount Received (ETB)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedPaymentCustomer.currentBalance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-emerald-600 text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Cash">Cash Receipt</option>
                  <option value="Bank Transfer (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                  <option value="Bank Transfer (Awash)">Awash Bank Transfer</option>
                  <option value="Mobile Money (Telebirr)">Telebirr</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Record Payment & Deduct Balance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
