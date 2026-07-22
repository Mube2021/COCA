import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroPublic } from './components/HeroPublic';
import { AboutUsPublic } from './components/AboutUsPublic';
import { DashboardView } from './components/DashboardView';
import { ProductManagementView } from './components/ProductManagementView';
import { InventoryView } from './components/InventoryView';
import { SalesModuleView } from './components/SalesModuleView';
import { CustomerManagementView } from './components/CustomerManagementView';
import { DeliveryManagementView } from './components/DeliveryManagementView';
import { BottleTrackingView } from './components/BottleTrackingView';
import { FinancialModuleView } from './components/FinancialModuleView';
import { EmployeeManagementView } from './components/EmployeeManagementView';
import { ReportsView } from './components/ReportsView';
import { ContactPublic } from './components/ContactPublic';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { Bot, MapPin, Phone, Mail, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, theme, language } = useApp();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return <HeroPublic />;
      case 'ABOUT':
        return <AboutUsPublic />;
      case 'DASHBOARD':
        return <DashboardView />;
      case 'PRODUCTS':
        return <ProductManagementView />;
      case 'INVENTORY':
        return <InventoryView />;
      case 'ORDERS':
        return <SalesModuleView />;
      case 'CUSTOMERS':
        return <CustomerManagementView />;
      case 'DELIVERY':
        return <DeliveryManagementView />;
      case 'BOTTLES':
        return <BottleTrackingView />;
      case 'FINANCE':
        return <FinancialModuleView />;
      case 'EMPLOYEES':
        return <EmployeeManagementView />;
      case 'REPORTS':
        return <ReportsView />;
      case 'CONTACT':
        return <ContactPublic />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Floating AI Copilot Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#E41E26] hover:bg-red-700 text-white p-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition transform hover:scale-105 border-2 border-white dark:border-slate-800"
        title="Open AI Business Copilot"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="font-extrabold text-xs pr-1 hidden sm:inline">AI Copilot</span>
      </button>

      {/* AI Copilot Side Drawer */}
      <AiCopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-black text-sm text-[#E41E26]">
              MOHAMMED AWEL COCA DISTRIBUTOR
            </div>
            <p className="mt-2 text-slate-500 leading-relaxed">
              Authorized Coca-Cola Bottling Distributor serving Bedele, Metu, Dembi, Chora, Chewaka, Dabo Hana, and Gechi across Buno Bedele Zone.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">Depot Contacts</div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Bedele Town Main Depot, Buno Bedele Zone</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>+251 91 700 0001 / +251 47 238 0122</span>
            </div>
          </div>

          <div className="text-right md:text-right text-[11px] flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                East Africa Bottling Share Company (EABSC) Partner
              </span>
            </div>
            <div className="mt-2 text-slate-400">
              © {new Date().getFullYear()} Mohammed Awel Coca Distributor. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
