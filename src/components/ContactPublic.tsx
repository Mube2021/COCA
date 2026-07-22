import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPublic: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    town: 'Bedele',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Contact & Wholesale Inquiries
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Mohammed Awel Coca Distributor — Authorized Coca-Cola Bottling Partner Serving Buno Bedele Zone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-[#E41E26]">Main Distribution Depot</h2>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Location Address:</strong>
                  Bedele Town Main Industrial Road, Buno Bedele Zone, Oromia Region, Ethiopia
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Telephone & Hotline:</strong>
                  +251 91 700 0001 / +251 47 238 0122
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Email Address:</strong>
                  orders@mohammedawelcoca.et
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Depot Operating Hours:</strong>
                  Monday – Saturday: 8:00 AM – 6:00 PM <br />
                  Sunday: Emergency Delivery Dispatch Only
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-amber-400">Coverage Towns in Buno Bedele Zone:</h3>
            <p className="text-slate-300 leading-relaxed">
              Bedele, Metu, Dembi, Chora, Chewaka, Dabo Hana, Gechi, and surrounding rural markets.
            </p>
          </div>
        </div>

        {/* Wholesale Inquiry Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Submit Retail Order Inquiry
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Register your shop, restaurant, or supermarket for daily beverage delivery.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-black text-emerald-900 dark:text-emerald-200 text-base">
                Inquiry Submitted Successfully!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Our Sales Representative for Buno Bedele Zone will contact you within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ato Tesfaye"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Business / Hotel Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bedele Grand Hotel"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+251 91 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Town / Location
                  </label>
                  <select
                    value={formData.town}
                    onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="Bedele">Bedele Town</option>
                    <option value="Metu">Metu</option>
                    <option value="Dembi">Dembi</option>
                    <option value="Chora">Chora</option>
                    <option value="Chewaka">Chewaka</option>
                    <option value="Dabo Hana">Dabo Hana</option>
                    <option value="Gechi">Gechi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Beverage Order Requirements / Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify required beverage crates e.g., 50 Crates Coca 300ml, 20 Crates Fanta..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E41E26] hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Wholesale Order Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
