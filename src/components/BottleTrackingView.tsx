import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Repeat,
  Package,
  AlertOctagon,
  CheckCircle,
  PlusCircle,
  DollarSign,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const BottleTrackingView: React.FC = () => {
  const { customers, bottleLedgers, recordBottleReturn, t } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [fullIssued, setFullIssued] = useState<number>(480);
  const [emptyReturned, setEmptyReturned] = useState<number>(450);
  const [broken, setBroken] = useState<number>(10);
  const [lost, setLost] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState('');

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    if (!cust) return;

    recordBottleReturn({
      customerId: cust.id,
      customerName: cust.businessName,
      fullIssuedBottles: Number(fullIssued),
      emptyReturnedBottles: Number(emptyReturned),
      brokenBottles: Number(broken),
      lostBottles: Number(lost),
      depositAmount: Number(emptyReturned) * 10,
    });

    setFullIssued(0);
    setEmptyReturned(0);
    setBroken(0);
    setLost(0);
  };

  const totalFullIssued = bottleLedgers.reduce((acc, b) => acc + b.fullIssuedBottles, 0);
  const totalEmptyReturned = bottleLedgers.reduce((acc, b) => acc + b.emptyReturnedBottles, 0);
  const totalBroken = bottleLedgers.reduce((acc, b) => acc + b.brokenBottles, 0);
  const totalLost = bottleLedgers.reduce((acc, b) => acc + b.lostBottles, 0);

  const filteredLedgers = bottleLedgers.filter((b) =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Repeat className="w-6 h-6 text-[#E41E26]" />
          <span>Glass Bottle & Deposit Management</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor glass bottle shells, empty crate returns, breakages, lost bottles, and customer deposit balances (10 ETB / bottle).
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Full Issued</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalFullIssued.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Bottles Delivered</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Empty Returned</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalEmptyReturned.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500">Collected Back</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-red-600 uppercase">Broken Bottles</div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
            {totalBroken.toLocaleString()}
          </div>
          <div className="text-[10px] text-red-500">Breakage Ledger</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Lost Bottles</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {totalLost.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-500">Unaccounted Shells</div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-bold text-amber-300 uppercase">Total Deposits</div>
          <div className="text-xl font-black text-white mt-1">
            {(totalEmptyReturned * 10).toLocaleString()} ETB
          </div>
          <div className="text-[10px] text-slate-400">Customer Deposit Credit</div>
        </div>
      </div>

      {/* Record Return Form & Deposit Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-[#E41E26]" />
            <span>Record Customer Bottle Return & Audit</span>
          </h3>

          <form onSubmit={handleRecord} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Customer Account
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.businessName} ({c.location}) - Deposit Balance: {c.depositBalance} ETB
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Issued (Btls)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fullIssued}
                  onChange={(e) => setFullIssued(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                  Empty Returned
                </label>
                <input
                  type="number"
                  min="0"
                  value={emptyReturned}
                  onChange={(e) => setEmptyReturned(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold text-emerald-700 dark:text-emerald-300"
                />
              </div>

              <div>
                <label className="block font-bold text-red-700 dark:text-red-400 mb-1">
                  Broken Bottles
                </label>
                <input
                  type="number"
                  min="0"
                  value={broken}
                  onChange={(e) => setBroken(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-700 dark:text-amber-400 mb-1">
                  Lost Bottles
                </label>
                <input
                  type="number"
                  min="0"
                  value={lost}
                  onChange={(e) => setLost(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-amber-600"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                Calculated Deposit Credit to Customer:
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                +{(emptyReturned * 10).toLocaleString()} ETB
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition"
            >
              Record Bottle Ledger & Update Deposit
            </button>
          </form>
        </div>

        {/* Deposit Policy Notice */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-[#E41E26] uppercase tracking-wider mb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Glass Bottle Deposit Policy</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
              <span>
                1. Standard deposit rate is <strong>10 ETB per 300ml glass bottle shell</strong> (240 ETB per crate).
              </span>
              <br />
              <br />
              <span>
                2. Returned empty crates are verified on arrival by the Warehouse Officer. Broken bottles are deducted from the deposit credit.
              </span>
            </p>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
            Authorized by East Africa Bottling Share Company (EABSC) regulations for Buno Bedele Zone.
          </div>
        </div>
      </div>

      {/* Bottle Return History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Customer Bottle Return Ledger History
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <th className="p-3">Date</th>
                <th className="p-3">Customer Business</th>
                <th className="p-3">Full Issued</th>
                <th className="p-3">Empty Returned</th>
                <th className="p-3">Broken</th>
                <th className="p-3">Lost</th>
                <th className="p-3">Deposit Credit (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLedgers.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-mono text-[11px] text-slate-500">{b.date}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{b.customerName}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    {b.fullIssuedBottles}
                  </td>
                  <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">
                    +{b.emptyReturnedBottles}
                  </td>
                  <td className="p-3 text-red-600 font-bold">{b.brokenBottles}</td>
                  <td className="p-3 text-amber-600 font-bold">{b.lostBottles}</td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">
                    +{b.depositAmount.toLocaleString()} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
