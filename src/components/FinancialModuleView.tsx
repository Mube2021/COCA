import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Landmark,
  CreditCard,
  PieChart as PieIcon,
  Calendar,
  X,
} from 'lucide-react';

export const FinancialModuleView: React.FC = () => {
  const { expenses, addExpense, invoices, customers, t } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [category, setCategory] = useState<any>('Fuel & Transport');

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Financial Calculations
  const totalInvoicedRevenue = invoices.reduce((acc, i) => acc + i.grandTotal, 0);
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalReceivables = customers.reduce((acc, c) => acc + c.currentBalance, 0);

  const netProfit = totalInvoicedRevenue - totalExpensesAmount;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category,
      description,
      amount: Number(amount),
      recordedBy: 'Finance Accountant',
    });
    setDescription('');
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-[#E41E26]" />
            <span>Financial & Cash Flow Control</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily gross revenue, operational expenses, net profit margins, bank deposits (CBE), and accounts receivable.
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="bg-[#E41E26] hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Total Revenue
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-2xl font-black mt-2">
            {totalInvoicedRevenue.toLocaleString()} ETB
          </div>
          <div className="text-xs text-emerald-200 mt-1">Gross Sales Invoiced</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Expenses
            </span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalExpensesAmount.toLocaleString()} ETB
          </div>
          <div className="text-xs text-slate-400 mt-1">Fuel, Salaries, Repairs</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Accounts Receivable
            </span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {totalReceivables.toLocaleString()} ETB
          </div>
          <div className="text-xs text-slate-400 mt-1">Customer Credit Owed</div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Calculated Net Profit
            </span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {netProfit.toLocaleString()} ETB
          </div>
          <div className="text-xs text-slate-400 mt-1">Estimated Net Earnings</div>
        </div>
      </div>

      {/* CBE Bank Deposits & Cash Flow Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Ledger */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base uppercase tracking-wider flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-[#E41E26]" />
            <span>Commercial Bank of Ethiopia (CBE) Ledger</span>
          </h3>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-300">CBE Account Number:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">1000 2840 9042</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-300">Account Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">Mohammed Awel Coca Distributor</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-black text-emerald-600">Current CBE Balance:</span>
              <span className="font-black text-emerald-600">1,840,500 ETB</span>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base uppercase tracking-wider">
            Operational Expenses History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-right">Amount (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                    <td className="p-2.5 text-slate-500 font-mono text-[11px]">{e.date}</td>
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">{e.category}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-300">{e.description}</td>
                    <td className="p-2.5 font-black text-red-600 text-right">
                      -{e.amount.toLocaleString()} ETB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 relative">
            <button
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4">
              Record Operational Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expense Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Fuel & Transport">Fuel & Transport</option>
                  <option value="Driver & Staff Salaries">Driver & Staff Salaries</option>
                  <option value="Warehouse Maintenance">Warehouse Maintenance</option>
                  <option value="Bottle Damage Expense">Bottle Damage Expense</option>
                  <option value="Bank Charges">Bank Charges</option>
                  <option value="Utilities & Rent">Utilities & Rent</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isuzu truck oil change & diesel refuel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (ETB)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-red-600 text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
