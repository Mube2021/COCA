import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem, SalesInvoice } from '../types';
import {
  ShoppingCart,
  Plus,
  Trash2,
  FileText,
  Printer,
  Mail,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  CreditCard,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export const SalesModuleView: React.FC = () => {
  const { products, customers, invoices, createInvoice, t } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || 'Coca-Cola Original',
      bottleSize: products[0]?.bottleSize || '300ml Glass',
      cratesQuantity: 10,
      totalBottles: 240,
      unitPrice: products[0]?.unitPrice || 18,
      totalPrice: 4320,
    },
  ]);

  const [discount, setDiscount] = useState<number>(0);
  const [includeVat, setIncludeVat] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<SalesInvoice['paymentMethod']>('Bank Transfer (CBE)');
  const [paymentStatus, setPaymentStatus] = useState<SalesInvoice['paymentStatus']>('PAID');
  const [notes, setNotes] = useState<string>('');

  // Printable Invoice Modal
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<SalesInvoice | null>(null);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  const handleAddItem = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;
    setItems((prev) => [
      ...prev,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        bottleSize: defaultProd.bottleSize,
        cratesQuantity: 5,
        totalBottles: 120,
        unitPrice: defaultProd.unitPrice,
        totalPrice: 120 * defaultProd.unitPrice,
      },
    ]);
  };

  const handleUpdateItem = (index: number, productId: string, crates: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const totalBottles = crates * 24;
    const totalPrice = totalBottles * prod.unitPrice;

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          return {
            productId: prod.id,
            productName: prod.name,
            bottleSize: prod.bottleSize,
            cratesQuantity: crates,
            totalBottles,
            unitPrice: prod.unitPrice,
            totalPrice,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
  const taxableAmount = Math.max(0, subtotal - discount);
  const vatAmount = includeVat ? taxableAmount * 0.15 : 0; // 15% Ethiopian VAT
  const grandTotal = taxableAmount + vatAmount;

  const totalBottlesInOrder = items.reduce((acc, i) => acc + i.totalBottles, 0);
  const depositCharged = totalBottlesInOrder * 10;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    createInvoice({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.businessName,
      items,
      subtotal,
      discount: Number(discount),
      vatAmount,
      grandTotal,
      paymentMethod,
      paymentStatus,
      fullBottlesDelivered: totalBottlesInOrder,
      emptyBottlesReturned: Math.floor(totalBottlesInOrder * 0.9), // estimated empties
      depositCharged,
      notes,
    });

    // Reset items
    setItems([]);
  };

  const generatePDFInvoice = (inv: SalesInvoice) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(228, 30, 38); // Coca Cola Red
    doc.text('MOHAMMED AWEL COCA DISTRIBUTOR', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Authorized Coca-Cola Distributor • Buno Bedele Zone, Ethiopia', 14, 26);
    doc.text('Bedele Town Main Depot • Phone: +251 91 700 0001', 14, 32);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`INVOICE: ${inv.invoiceNo}`, 14, 44);
    doc.text(`Date: ${inv.date}`, 140, 44);

    doc.setFontSize(10);
    doc.text(`Customer: ${inv.customerName}`, 14, 52);
    doc.text(`Payment Method: ${inv.paymentMethod}`, 14, 58);
    doc.text(`Payment Status: ${inv.paymentStatus}`, 140, 58);

    let startY = 70;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, startY - 5, 180, 8, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.text('Item / Product', 16, startY);
    doc.text('Crates', 90, startY);
    doc.text('Bottles', 115, startY);
    doc.text('Unit Price', 140, startY);
    doc.text('Total (ETB)', 170, startY);

    doc.setFont('Helvetica', 'normal');
    startY += 8;
    inv.items.forEach((item) => {
      doc.text(`${item.productName} (${item.bottleSize})`, 16, startY);
      doc.text(`${item.cratesQuantity}`, 90, startY);
      doc.text(`${item.totalBottles}`, 115, startY);
      doc.text(`${item.unitPrice} ETB`, 140, startY);
      doc.text(`${item.totalPrice.toLocaleString()} ETB`, 170, startY);
      startY += 7;
    });

    startY += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, startY, 194, startY);
    startY += 8;

    doc.text(`Subtotal: ${inv.subtotal.toLocaleString()} ETB`, 130, startY);
    startY += 6;
    doc.text(`Discount: -${inv.discount.toLocaleString()} ETB`, 130, startY);
    startY += 6;
    doc.text(`15% Ethiopian VAT: +${inv.vatAmount.toLocaleString()} ETB`, 130, startY);
    startY += 8;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`GRAND TOTAL: ${inv.grandTotal.toLocaleString()} ETB`, 130, startY);

    doc.save(`${inv.invoiceNo}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-[#E41E26]" />
          <span>Sales Invoicing & Orders Engine</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate wholesale sales invoices, apply Ethiopian VAT (15%), record CBE Bank or Telebirr payments, and print thermal receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Invoice Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              Create New Sales Order Invoice
            </h3>
            <span className="text-xs font-mono text-slate-400">
              DATE: {new Date().toISOString().split('T')[0]}
            </span>
          </div>

          <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
            {/* Customer Select */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Retail / Wholesale Customer
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.ownerName}) - Credit Limit: {c.creditLimit.toLocaleString()} ETB
                  </option>
                ))}
              </select>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Order Items (Beverage Crates)
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product Line</span>
                </button>
              </div>

              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5 sm:col-span-6">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => handleUpdateItem(idx, e.target.value, item.cratesQuantity)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.bottleSize}) - {p.unitPrice} Birr/btl
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Crates (24x)</label>
                    <input
                      type="number"
                      min="1"
                      value={item.cratesQuantity}
                      onChange={(e) =>
                        handleUpdateItem(idx, item.productId, Math.max(1, Number(e.target.value)))
                      }
                      className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-center"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3 text-right">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Line Total</label>
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {item.totalPrice.toLocaleString()} ETB
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment & VAT Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Bank Transfer (CBE)">Bank Transfer (CBE)</option>
                  <option value="Cash">Cash Payment</option>
                  <option value="Credit Account">Credit Account</option>
                  <option value="Mobile Money (Telebirr)">Telebirr / CBE Birr</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  <option value="PAID">PAID (Full Payment)</option>
                  <option value="PENDING">PENDING (On Credit)</option>
                  <option value="PARTIAL">PARTIAL</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Discount (ETB)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="vatCheck"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="vatCheck" className="font-bold text-slate-700 dark:text-slate-300">
                Apply 15% Ethiopian VAT (Value Added Tax)
              </label>
            </div>

            <button
              type="submit"
              disabled={items.length === 0}
              className="w-full bg-[#E41E26] hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg transition text-sm"
            >
              Generate Sales Invoice & Deduct Inventory
            </button>
          </form>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>Invoice Order Summary</span>
              <FileText className="w-4 h-4" />
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({totalBottlesInOrder} bottles):</span>
                <span className="font-bold text-white">{subtotal.toLocaleString()} ETB</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Discount Applied:</span>
                <span className="font-bold text-emerald-400">-{discount.toLocaleString()} ETB</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>15% Ethiopian VAT:</span>
                <span className="font-bold text-amber-300">+{vatAmount.toLocaleString()} ETB</span>
              </div>

              <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 my-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Grand Total Payable</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  {grandTotal.toLocaleString()} ETB
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-amber-300">Glass Bottle Shell Deposit Notice:</div>
                <p>
                  Requires return of {totalBottlesInOrder} empty glass bottles or deposit charge of{' '}
                  <strong>{depositCharged.toLocaleString()} ETB</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Invoices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
          Recent Generated Invoices History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-3">Invoice No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items Count</th>
                <th className="p-3">Grand Total (ETB)</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNo}
                  </td>
                  <td className="p-3 text-slate-500">{inv.date}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{inv.customerName}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {inv.items.reduce((acc, i) => acc + i.cratesQuantity, 0)} Crates ({inv.items.length} lines)
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">
                    {inv.grandTotal.toLocaleString()} ETB
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{inv.paymentMethod}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        inv.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setActiveInvoiceModal(inv)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition"
                        title="View Printable Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generatePDFInvoice(inv)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded transition"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal Dialog */}
      {activeInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setActiveInvoiceModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Receipt Area */}
            <div className="space-y-4 text-xs font-mono">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <div className="font-black text-lg text-[#E41E26]">MOHAMMED AWEL COCA DISTRIBUTOR</div>
                <div className="text-[10px] text-slate-600">Authorized Coca-Cola Bottling Distributor</div>
                <div className="text-[10px] text-slate-600">Bedele Town Main Depot • Buno Bedele Zone</div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Invoice No: {activeInvoiceModal.invoiceNo}</span>
                <span>Date: {activeInvoiceModal.date}</span>
              </div>

              <div className="text-[11px]">
                <span>Customer: {activeInvoiceModal.customerName}</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                {activeInvoiceModal.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>
                      {item.cratesQuantity}x {item.productName} ({item.bottleSize})
                    </span>
                    <span className="font-bold">{item.totalPrice.toLocaleString()} ETB</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-[11px]">
                <div>Subtotal: {activeInvoiceModal.subtotal.toLocaleString()} ETB</div>
                <div>Discount: -{activeInvoiceModal.discount.toLocaleString()} ETB</div>
                <div>15% VAT: +{activeInvoiceModal.vatAmount.toLocaleString()} ETB</div>
                <div className="font-bold text-sm text-slate-900 pt-1 border-t border-slate-300">
                  GRAND TOTAL: {activeInvoiceModal.grandTotal.toLocaleString()} ETB
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                Thank you for choosing Coca-Cola Refreshments! <br />
                "Delivering Refreshment Across Buno Bedele Zone"
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => generatePDFInvoice(activeInvoiceModal)}
                className="bg-[#E41E26] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
