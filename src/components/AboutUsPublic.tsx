import React from 'react';
import { Award, ShieldCheck, Truck, Users, CheckCircle, HeartHandshake, MapPin } from 'lucide-react';

export const AboutUsPublic: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-[#E41E26] text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Authorized Coca-Cola Bottling Partner
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Mohammed Awel Coca Distributor
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Serving Buno Bedele Zone with commitment, reliability, and world-class logistics. We connect East Africa Bottling Share Company (EABSC) with hundreds of local businesses across Oromia Region.
          </p>
        </div>

        {/* Decorative Circle Background */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#E41E26]/20 rounded-full blur-3xl"></div>
      </div>

      {/* Corporate Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Delivering Refreshment Across Buno Bedele Zone
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Founded under the visionary leadership of Ato Mohammed Awel, our enterprise has grown to become the principal beverage distributor in the region. Operating from our central depot in Bedele Town, we maintain a fleet of heavy Isuzu transport trucks and secondary delivery pick-ups to guarantee fresh product availability daily.
          </p>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We distribute Coca-Cola Original, Fanta, Sprite, Schweppes, Minute Maid, and Predator Energy across seven key districts: Bedele, Metu, Dembi, Chora, Chewaka, Dabo Hana, and Gechi.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-3 text-xs font-bold text-slate-800 dark:text-slate-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>EABSC Franchise Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Full Cold-Chain Depots</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Digital Invoice & Glass Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Same-Day Retail Delivery</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Our Key Operational Pillars
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-[#E41E26] shrink-0 mt-1" />
              <div>
                <strong className="block text-slate-900 dark:text-white text-sm">Product Authenticity</strong>
                Direct supply chain connection with EABSC bottling plants ensures 100% genuine Coca-Cola products.
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Truck className="w-6 h-6 text-[#E41E26] shrink-0 mt-1" />
              <div>
                <strong className="block text-slate-900 dark:text-white text-sm">Fleet Excellence</strong>
                15 dedicated Isuzu FSR and NPR trucks equipped with GPS route tracking for prompt store deliveries.
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <HeartHandshake className="w-6 h-6 text-[#E41E26] shrink-0 mt-1" />
              <div>
                <strong className="block text-slate-900 dark:text-white text-sm">Partner Growth</strong>
                Flexible credit lines, glass bottle shell exchange management, and commercial support for local retailers.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Towns Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Complete Regional Coverage in Buno Bedele Zone
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs font-extrabold">
          {['Bedele Town', 'Metu', 'Dembi', 'Chora', 'Chewaka', 'Dabo Hana', 'Gechi'].map((town, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center space-x-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E41E26]" />
              <span className="text-slate-800 dark:text-slate-200">{town}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
