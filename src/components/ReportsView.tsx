import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Award,
  Users,
  CreditCard,
  Truck,
  CheckCircle2,
  Table,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const ReportsView: React.FC = () => {
  const { products, customers, invoices, deliveryRoutes, t } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'SALES' | 'PRODUCTS' | 'CUSTOMERS' | 'CREDIT' | 'DELIVERY'
  >('SALES');

  // Export CSV
  const handleExportCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF Summary
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(228, 30, 38);
    doc.text('MOHAMMED AWEL COCA DISTRIBUTOR', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`BUSINESS PERFORMANCE REPORT - ${activeReportTab}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    doc.setFontSize(10);
    doc.text(`Total Invoices Logged: ${invoices.length}`, 14, 48);
    doc.text(
      `Total Revenue: ${invoices.reduce((a, b) => a + b.grandTotal, 0).toLocaleString()} ETB`,
      14,
      54
    );
    doc.text(`Total Active Customers: ${customers.length}`, 14, 60);

    doc.save(`Coca_Distributor_${activeReportTab}_Report.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#E41E26]" />
            <span>Business Intelligence & Analytics Reports</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export comprehensive sales audits, top-performing beverages, customer credit ledgers, and delivery efficiency stats.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() =>
              handleExportCSV(
                `Mohammed_Awel_Coca_${activeReportTab}`,
                invoices.map((i) => [i.invoiceNo, i.date, i.customerName, i.grandTotal, i.paymentStatus])
              )
            }
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1"
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="bg-[#E41E26] hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Report Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 space-x-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveReportTab('SALES')}
          className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeReportTab === 'SALES'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sales & Invoicing Report
        </button>
        <button
          onClick={() => setActiveReportTab('PRODUCTS')}
          className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeReportTab === 'PRODUCTS'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Best Selling Beverages
        </button>
        <button
          onClick={() => setActiveReportTab('CUSTOMERS')}
          className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeReportTab === 'CUSTOMERS'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Top Customer Accounts
        </button>
        <button
          onClick={() => setActiveReportTab('CREDIT')}
          className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeReportTab === 'CREDIT'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Credit & Outstanding Balance
        </button>
        <button
          onClick={() => setActiveReportTab('DELIVERY')}
          className={`px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeReportTab === 'DELIVERY'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Delivery Route Performance
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {activeReportTab === 'SALES' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Sales Invoicing Audit
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Subtotal</th>
                    <th className="p-3">VAT (15%)</th>
                    <th className="p-3">Grand Total</th>
                    <th className="p-3">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {invoices.map((i) => (
                    <tr key={i.id}>
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                        {i.invoiceNo}
                      </td>
                      <td className="p-3 text-slate-500">{i.date}</td>
                      <td className="p-3 font-bold">{i.customerName}</td>
                      <td className="p-3">{i.subtotal.toLocaleString()} ETB</td>
                      <td className="p-3 text-amber-600">+{i.vatAmount.toLocaleString()} ETB</td>
                      <td className="p-3 font-black text-emerald-600">
                        {i.grandTotal.toLocaleString()} ETB
                      </td>
                      <td className="p-3">{i.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'PRODUCTS' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Best Selling Coca-Cola Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center space-x-3"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {p.name}
                    </div>
                    <div className="text-slate-500">{p.bottleSize} • {p.unitPrice} Birr/btl</div>
                    <div className="text-emerald-600 font-bold mt-1">
                      Current Stock: {p.stockBottles.toLocaleString()} Bottles ({p.cratesInStock} Crates)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeReportTab === 'CUSTOMERS' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Top Customer Accounts by Volume
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Business Name</th>
                    <th className="p-3">Owner</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Location Town</th>
                    <th className="p-3">Credit Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {c.businessName}
                      </td>
                      <td className="p-3">{c.ownerName}</td>
                      <td className="p-3 font-mono">{c.phone}</td>
                      <td className="p-3 text-red-600 font-medium">{c.location}</td>
                      <td className="p-3 font-black text-slate-900 dark:text-white">
                        {c.currentBalance.toLocaleString()} ETB
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'CREDIT' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Outstanding Credit Balance Report
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Credit Limit</th>
                    <th className="p-3">Current Balance</th>
                    <th className="p-3">Credit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customers.map((c) => {
                    const isOver = c.currentBalance > c.creditLimit;
                    return (
                      <tr key={c.id}>
                        <td className="p-3 font-bold">{c.businessName}</td>
                        <td className="p-3">{c.creditLimit.toLocaleString()} ETB</td>
                        <td className={`p-3 font-black ${isOver ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                          {c.currentBalance.toLocaleString()} ETB
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOver ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOver ? 'OVER CREDIT LIMIT' : 'WITHIN LIMIT'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReportTab === 'DELIVERY' && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              Delivery Route & Fleet Performance
            </h3>
            <div className="space-y-3 text-xs">
              {deliveryRoutes.map((r) => (
                <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Route {r.routeCode} ({r.vehiclePlate}) - Driver: {r.driverName}
                    </div>
                    <div className="text-slate-500">Towns: {r.towns.join(', ')}</div>
                  </div>
                  <div className="font-black text-red-600">
                    {r.totalBottlesToDeliver} Bottles Delivered
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
