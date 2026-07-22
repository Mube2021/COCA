import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Navigation,
  FileCheck,
  User,
  ShieldCheck,
  Fuel,
  X,
  Camera,
} from 'lucide-react';

export const DeliveryManagementView: React.FC = () => {
  const { vehicles, deliveryRoutes, updateRouteStatus, t } = useApp();

  const [selectedRouteForPOD, setSelectedRouteForPOD] = useState<string | null>(null);
  const [podSignature, setPodSignature] = useState('Signed by Ato Kebede Tufa');

  const handleCompletePOD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRouteForPOD) return;
    updateRouteStatus(selectedRouteForPOD, 'COMPLETED');
    setSelectedRouteForPOD(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <Truck className="w-6 h-6 text-[#E41E26]" />
          <span>Fleet & Delivery Route Management</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor Isuzu delivery trucks, drivers, route progress across Buno Bedele Zone, fuel expenses, and proof of delivery signatures.
        </p>
      </div>

      {/* Fleet Vehicles Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg">
                  {v.plateNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    v.status === 'ON_DELIVERY'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-base mt-3">
                {v.model}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Assigned Driver: {v.assignedDriverName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-3.5 h-3.5 text-[#E41E26]" />
                  <span>Crate Capacity: {v.capacityCrates} Crates ({v.capacityCrates * 24} Bottles)</span>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-500" />
                  <span>Monthly Fuel Expense: {v.fuelCostThisMonth.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Map & Live Delivery Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Delivery Routes Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base uppercase tracking-wider flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-red-600" />
            <span>Active Buno Bedele Delivery Routes</span>
          </h3>

          <div className="space-y-3 text-xs">
            {deliveryRoutes.map((route) => (
              <div
                key={route.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      {route.routeCode}
                    </span>
                    <span className="ml-2 font-mono text-[11px] text-slate-500">
                      ({route.vehiclePlate})
                    </span>
                  </div>

                  <select
                    value={route.status}
                    onChange={(e) => updateRouteStatus(route.id, e.target.value as any)}
                    className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-[11px]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_TRANSIT">IN_TRANSIT</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="text-slate-400">Driver:</span>{' '}
                    <strong className="text-slate-800 dark:text-slate-100">{route.driverName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Cargo:</span>{' '}
                    <strong className="text-red-600">{route.totalBottlesToDeliver} Bottles</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Route Towns: {route.towns.join(' → ')}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setSelectedRouteForPOD(route.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Upload Proof of Delivery</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Simulated Route Map */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Buno Bedele Zone GPS Route Map</span>
            </h3>

            {/* Interactive SVG Map Simulation */}
            <div className="relative w-full h-64 bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden flex items-center justify-center">
              {/* Map Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40"></div>

              {/* Connecting Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50 160 Q 150 60 250 120 T 350 180"
                  fill="none"
                  stroke="#E41E26"
                  strokeWidth="3"
                  strokeDasharray="6,6"
                />
              </svg>

              {/* Map Location Pins */}
              <div className="absolute top-12 left-10 text-center">
                <div className="w-6 h-6 rounded-full bg-[#E41E26] text-white flex items-center justify-center text-[10px] font-bold mx-auto border-2 border-white shadow-lg animate-bounce">
                  DEP
                </div>
                <div className="text-[10px] font-bold text-white mt-1">Bedele Depot</div>
              </div>

              <div className="absolute top-20 left-44 text-center">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[9px] font-bold mx-auto border-2 border-slate-900">
                  CHO
                </div>
                <div className="text-[10px] font-bold text-amber-300 mt-1">Chora Market</div>
              </div>

              <div className="absolute bottom-12 right-16 text-center">
                <div className="w-5 h-5 rounded-full bg-blue-400 text-slate-900 flex items-center justify-center text-[9px] font-bold mx-auto border-2 border-slate-900">
                  DEM
                </div>
                <div className="text-[10px] font-bold text-blue-300 mt-1">Dembi Town</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Real-time GPS telemetry tracks delivery trucks on route between Bedele Main Depot and retail hubs across Buno Bedele Zone.
          </p>
        </div>
      </div>

      {/* Proof of Delivery Modal Dialog */}
      {selectedRouteForPOD && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-sm w-full p-6 relative">
            <button
              onClick={() => setSelectedRouteForPOD(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
              Submit Proof of Delivery (POD)
            </h3>
            <p className="text-xs text-slate-500 mb-4">Route ID: {selectedRouteForPOD}</p>

            <form onSubmit={handleCompletePOD} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Receiver Name & Signature
                </label>
                <input
                  type="text"
                  required
                  value={podSignature}
                  onChange={(e) => setPodSignature(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="font-bold text-slate-600 dark:text-slate-300">
                  Simulated Delivery Photo Captured
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">
                  ✔ Crates Verified at Storefront
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Confirm POD & Complete Delivery
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
