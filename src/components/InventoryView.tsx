import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Calculator,
  Search,
  Filter,
  Package,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, stockMovements, addStockMovement, t } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [movementType, setMovementType] = useState<'IN' | 'OUT' | 'DAMAGED' | 'RETURN_EMPTY'>('IN');
  const [quantityBottles, setQuantityBottles] = useState<number>(240); // 10 crates
  const [warehouse, setWarehouse] = useState<string>('Main Warehouse - Bedele');
  const [notes, setNotes] = useState<string>('');

  // Converter state
  const [converterCrates, setConverterCrates] = useState<number>(100);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations for totals
  const totalInBottles = stockMovements
    .filter((m) => m.type === 'IN')
    .reduce((acc, m) => acc + m.quantityBottles, 0);

  const totalOutBottles = stockMovements
    .filter((m) => m.type === 'OUT')
    .reduce((acc, m) => acc + m.quantityBottles, 0);

  const totalDamagedBottles = stockMovements
    .filter((m) => m.type === 'DAMAGED')
    .reduce((acc, m) => acc + m.quantityBottles, 0);

  const totalReturnedEmptyBottles = stockMovements
    .filter((m) => m.type === 'RETURN_EMPTY')
    .reduce((acc, m) => acc + m.quantityBottles, 0);

  const totalRemainingStock = products.reduce((acc, p) => acc + p.stockBottles, 0);

  const handleRecordMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    addStockMovement({
      productId: prod.id,
      productName: `${prod.name} (${prod.bottleSize})`,
      type: movementType,
      quantityBottles: Number(quantityBottles),
      warehouse,
      handledBy: 'Inventory Officer',
      notes,
    });

    setNotes('');
  };

  const filteredMovements = stockMovements.filter(
    (m) =>
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-6 h-6 text-[#E41E26]" />
          <span>Central Warehouse & Inventory Control</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track incoming factory deliveries from EABSC, warehouse storage, dispatches to retailers, and glass bottle empties.
        </p>
      </div>

      {/* Bottle Status Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
            Incoming Bottles
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            +{totalInBottles.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">Factory Deliveries</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase">
            Warehouse Stock
          </div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {totalRemainingStock.toLocaleString()}
          </div>
          <div className="text-[10px] text-blue-600 font-medium">Full Bottles On Hand</div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">
            Outgoing Dispatched
          </div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
            -{totalOutBottles.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-600 font-medium">Delivered to Customers</div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-200 dark:border-red-800">
          <div className="text-[11px] font-bold text-red-800 dark:text-red-300 uppercase">
            Damaged Bottles
          </div>
          <div className="text-xl font-black text-red-700 dark:text-red-400 mt-1">
            {totalDamagedBottles.toLocaleString()}
          </div>
          <div className="text-[10px] text-red-600 font-medium">Breakage / Loss</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase">
            Returned Empties
          </div>
          <div className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1">
            {totalReturnedEmptyBottles.toLocaleString()}
          </div>
          <div className="text-[10px] text-purple-600 font-medium">Glass Shells Ready</div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
          <div className="text-[11px] font-bold text-amber-400 uppercase">
            Total Net Stock
          </div>
          <div className="text-xl font-black text-white mt-1">
            {totalRemainingStock.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            ~{Math.floor(totalRemainingStock / 24)} Crates
          </div>
        </div>
      </div>

      {/* Record Movement Form & Crate Converter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Record Stock Movement Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-[#E41E26]" />
            <span>Record New Stock Movement</span>
          </h3>

          <form onSubmit={handleRecordMovement} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.bottleSize}) - Current: {p.stockBottles} btls
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Movement Type
                </label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                >
                  <option value="IN">IN (Incoming Factory Stock)</option>
                  <option value="OUT">OUT (Customer Dispatch)</option>
                  <option value="DAMAGED">DAMAGED (Broken Bottles)</option>
                  <option value="RETURN_EMPTY">RETURN_EMPTY (Empty Glass Shells)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity in Bottles
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantityBottles}
                    onChange={(e) => setQuantityBottles(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                  <span className="text-slate-400 font-medium shrink-0">
                    = {Math.round((quantityBottles / 24) * 10) / 10} Crates
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Warehouse Location
                </label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Main Warehouse - Bedele">Main Warehouse - Bedele</option>
                  <option value="Empty Bottle Bay - Bedele">Empty Bottle Bay - Bedele</option>
                  <option value="Chora Depot Hub">Chora Depot Hub</option>
                  <option value="Gechi Secondary Storage">Gechi Secondary Storage</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Movement Notes / Reference
              </label>
              <input
                type="text"
                placeholder="e.g. Factory delivery invoice #EABSC-9042 or Truck offloading note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition"
            >
              Post Stock Movement
            </button>
          </form>
        </div>

        {/* Quick Crate <-> Bottle Converter */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center space-x-2 mb-3">
              <Calculator className="w-4 h-4" />
              <span>Standard Crate Converter</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Coca-Cola glass bottles (300ml) are packed at <strong>24 bottles per crate</strong>.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Enter Crates Amount:</label>
                <input
                  type="number"
                  min="1"
                  value={converterCrates}
                  onChange={(e) => setConverterCrates(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl font-bold text-white text-base"
                />
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 text-center">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Total Equivalent Bottles</div>
                <div className="text-2xl font-black text-emerald-400">
                  {(converterCrates * 24).toLocaleString()} Bottles
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 text-center">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Glass Bottle Shell Deposit</div>
                <div className="text-lg font-bold text-amber-300">
                  {(converterCrates * 24 * 10).toLocaleString()} ETB
                </div>
                <div className="text-[10px] text-slate-400">(At 10 ETB per empty bottle)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movements Audit Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Inventory Movement Audit History
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter movements..."
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
                <th className="p-3">Date & Time</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Quantity (Btls)</th>
                <th className="p-3">Warehouse</th>
                <th className="p-3">Handled By</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{m.date}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{m.productName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        m.type === 'IN'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : m.type === 'OUT'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : m.type === 'DAMAGED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {m.type}
                    </span>
                  </td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">
                    {m.quantityBottles.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{m.warehouse}</td>
                  <td className="p-3 text-slate-500">{m.handledBy}</td>
                  <td className="p-3 text-slate-400 italic text-[11px]">{m.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
