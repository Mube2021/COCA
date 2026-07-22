import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Users, PackageCheck, Award, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface HeroPublicProps {
  onOpenOrderModal: () => void;
}

export const HeroPublic: React.FC<HeroPublicProps> = ({ onOpenOrderModal }) => {
  const { setActiveTab, t } = useApp();

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 my-4">
      {/* Background Graphic Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Branding & Tagline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-red-600/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-red-400" />
            <span>Authorized Coca-Cola Distributor</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-none">
              MOHAMMED AWEL <br />
              <span className="text-[#E41E26]">COCA DISTRIBUTOR</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-amber-300 italic">
              "Delivering Refreshment Across Buno Bedele Zone"
            </p>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Serving Bedele Town, Metu, Chora, Dembi, Gechi, Dabo Hana, and Chewaka with direct factory-fresh Coca-Cola beverages, glass bottle management, bulk wholesale delivery, and real-time order tracking.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('products')}
              className="bg-[#E41E26] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-red-600/30 transition transform active:scale-95 flex items-center space-x-2 text-sm"
            >
              <span>{t('View Products', 'Oomshaalee Ilaali')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenOrderModal}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl shadow transition transform active:scale-95 text-sm flex items-center space-x-2 border border-slate-200"
            >
              <PackageCheck className="w-4 h-4 text-[#E41E26]" />
              <span>{t('Place Order', 'Ajaja Ergi')}</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-5 py-3 rounded-xl transition text-sm flex items-center space-x-2 border border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Internal Portal', 'Seensa Seeraa')}</span>
            </button>
          </div>

          {/* Location Badge */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Main Central Depot: Bedele Town, Oromia Region, Ethiopia</span>
          </div>
        </div>

        {/* Right Column: Key Statistics */}
        <div className="lg:col-span-5 bg-slate-800/80 backdrop-blur border border-slate-700/60 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-700 flex items-center justify-between">
            <span>Distribution Network Metrics</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-[#E41E26] flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">200+</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Active Customers</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">15</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Delivery Vehicles</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">30+</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Dedicated Employees</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <PackageCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-white">1000s</div>
              <div className="text-xs font-semibold text-slate-400 mt-0.5">Daily Bottles Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
