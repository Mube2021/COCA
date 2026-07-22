import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Package,
  Users,
  Clock,
  Truck,
  DollarSign,
  AlertCircle,
  PlusCircle,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { products, customers, invoices, deliveryRoutes, setActiveTab, t } = useApp();

  // Calculate live values or fallback to default specs
  const totalStockBottles = products.reduce((acc, p) => acc + p.stockBottles, 0);
  const lowStockProducts = products.filter((p) => p.stockBottles <= p.minStockAlert);

  const salesTrendData = [
    { day: 'Mon', salesETB: 98000, bottles: 3900 },
    { day: 'Tue', salesETB: 112000, bottles: 4480 },
    { day: 'Wed', salesETB: 120500, bottles: 4850 },
    { day: 'Thu', salesETB: 105000, bottles: 4200 },
    { day: 'Fri', salesETB: 135000, bottles: 5400 },
    { day: 'Sat', salesETB: 142000, bottles: 5680 },
    { day: 'Sun', salesETB: 88000, bottles: 3500 },
  ];

  const productDistribution = products.map((p) => ({
    name: `${p.name} ${p.bottleSize}`,
    stock: p.stockBottles,
  }));

  const COLORS = ['#E41E26', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1'];

  return (
    <div className="space-y-4">
      {/* Top Welcome & Quick Actions Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Distribution Command Center
            </h1>
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Delivering Refreshment Across Buno Bedele Zone (Bedele, Chora, Dembi, Gechi, Metu)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('sales')}
            className="bg-[#E41E26] hover:bg-red-700 text-white text-xs font-extrabold px-3 py-2 rounded transition flex items-center space-x-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ NEW ORDER</span>
          </button>

          <button
            onClick={() => setActiveTab('bottle-tracking')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3 py-2 rounded transition flex items-center space-x-1.5 shadow-sm"
          >
            <Package className="w-3.5 h-3.5" />
            <span>BOTTLE RETURN</span>
          </button>

          <button
            onClick={() => setActiveTab('delivery')}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-3 py-2 rounded transition flex items-center space-x-1.5 shadow-sm"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>DISPATCH FLEET</span>
          </button>
        </div>
      </header>

      {/* Primary High-Density Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Today's Revenue */}
        <div className="high-density-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-[#E41E26]" />
          </div>
          <div className="mt-2">
            <div className="metric-val">
              120,500 <span className="text-xs font-normal text-slate-500">ETB</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>↑ 12% vs Yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 2: Bottles Sold */}
        <div className="high-density-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Bottles Sold</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="metric-val">
              4,850 <span className="text-xs font-normal text-slate-500">Units</span>
            </div>
            <div className="chart-bar mt-2">
              <div className="chart-progress" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="high-density-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="metric-val">
              18 <span className="text-xs font-normal text-slate-500">Active</span>
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">
              Needs Dispatch
            </div>
          </div>
        </div>

        {/* Card 4: Inventory Level */}
        <div className="high-density-card">
          <div className="flex items-center justify-between">
            <span className="metric-label">Inventory Level</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="metric-val">
              {totalStockBottles.toLocaleString()} <span className="text-xs font-normal text-slate-500">Total</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Across 12 Categories
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-900 dark:text-amber-200 uppercase text-[11px]">
                Low Stock Threshold Alert
              </span>
              <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                {lowStockProducts.map((p) => `${p.name} (${p.stockBottles} pcs)`).join(', ')}. Suggested re-order: 200 cases.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded shrink-0 transition"
          >
            RE-ORDER NOW
          </button>
        </div>
      )}

      {/* Main High-Density Layout Grid (Live Inventory + Fleet Logistics Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Inventory & Product Stock Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Live Inventory & Product Stock
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  EXPORT
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-2.5 py-1 bg-[#E41E26] text-white text-[11px] font-extrabold rounded hover:bg-red-700 transition"
                >
                  + ADD PRODUCT
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-4 py-2 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div>Product Name</div>
                <div>Size</div>
                <div>Price</div>
                <div className="text-right">Stock Status</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto pr-1">
                {products.map((prod) => {
                  const isLow = prod.stockBottles <= prod.minStockAlert;
                  return (
                    <div key={prod.id} className="grid grid-cols-4 py-2.5 items-center text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate pr-1">
                        {prod.name}
                      </div>
                      <div className="text-slate-500 text-[11px]">{prod.bottleSize}</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {prod.unitPrice} ETB
                      </div>
                      <div className="text-right">
                        <span className={isLow ? 'badge-orange' : 'badge-green'}>
                          {prod.stockBottles.toLocaleString()} Pcs
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-md">
            <div className="text-[11px] font-extrabold text-red-700 dark:text-red-400">
              Depot Stock Notice
            </div>
            <p className="text-[10px] text-red-600 dark:text-red-300">
              High turnover expected on 300ml Glass returnables for weekend events in Bedele & Metu.
            </p>
          </div>
        </div>

        {/* Fleet Logistics & Bottle Management Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Fleet & Dispatch Logistics
              </h2>
              <button
                onClick={() => setActiveTab('delivery')}
                className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                View Routes →
              </button>
            </div>

            <div className="space-y-2">
              {deliveryRoutes.slice(0, 3).map((route, idx) => (
                <div
                  key={route.id}
                  className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800"
                >
                  <div className="h-7 w-7 bg-[#E41E26] rounded flex items-center justify-center text-white text-[11px] font-black shrink-0">
                    D{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      Truck #{route.vehiclePlate} ({route.routeCode})
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      Driver: {route.driverName} • {route.towns.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  <span
                    className={
                      route.status === 'COMPLETED'
                        ? 'badge-green'
                        : route.status === 'IN_TRANSIT'
                        ? 'badge-green animate-pulse'
                        : 'badge-orange'
                    }
                  >
                    {route.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottle Management Quick Glance */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Bottle Crate Tracking
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-blue-700 dark:text-blue-300 font-bold">
                    EMPTY RETURNS TODAY
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    1,240 <span className="text-[10px] font-medium text-slate-500">Pcs</span>
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded border border-red-100 dark:border-red-900/50">
                  <div className="text-[10px] text-red-700 dark:text-red-300 font-bold">
                    BROKEN / MISSING
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    42 <span className="text-[10px] font-medium text-slate-500">Pcs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Forecast Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Monthly Net Revenue Goal
            </h3>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              875,000 <span className="text-xs font-normal text-slate-500">ETB</span>
            </div>
            <div className="chart-bar w-full mt-1.5">
              <div className="chart-progress bg-emerald-500" style={{ width: '87%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Target: 1,000,000 ETB (87% achieved)</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Revenue & Bottle Movement Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Daily Sales Revenue Trend
              </h3>
              <p className="text-[11px] text-slate-500">Revenue in ETB vs volume this week</p>
            </div>
            <span className="text-[10px] font-extrabold text-[#E41E26] bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
              Buno Bedele Zone
            </span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E41E26" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E41E26" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="salesETB" stroke="#E41E26" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Stock Breakdown Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-0.5">
              Stock Distribution
            </h3>
            <p className="text-[11px] text-slate-500">Volume breakdown by drink variant</p>
          </div>

          <div className="h-48 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="stock"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} bottles`, 'Stock']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            {productDistribution.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

