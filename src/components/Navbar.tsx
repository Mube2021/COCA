import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  QrCode,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  Globe,
  ChevronDown,
  Menu,
  X,
  Truck,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Briefcase,
  Layers,
  Repeat,
  Home,
  LayoutDashboard,
  Flame,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const {
    user,
    isFirebaseConnected,
    loginWithGoogle,
    logoutUser,
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
    notifications,
    markNotificationRead,
    setIsBarcodeScannerOpen,
    setIsCopilotOpen,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: Role[] = [
    'Administrator',
    'Manager',
    'Sales Officer',
    'Warehouse Officer',
    'Cashier',
    'Driver',
    'Accountant',
  ];

  const navItems = [
    { id: 'home', labelEn: 'Home', labelOm: 'Mana', icon: Home },
    { id: 'dashboard', labelEn: 'Dashboard', labelOm: 'Koompitiitara', icon: LayoutDashboard },
    { id: 'products', labelEn: 'Products', labelOm: 'Oomshaalee', icon: Package },
    { id: 'inventory', labelEn: 'Inventory', labelOm: 'Kuusaa', icon: Layers },
    { id: 'bottle-tracking', labelEn: 'Bottle Tracking', labelOm: 'Qoodinsa Qorqorroo', icon: Repeat },
    { id: 'customers', labelEn: 'Customers', labelOm: 'Maamiltoota', icon: Users },
    { id: 'sales', labelEn: 'Orders & Sales', labelOm: 'Gurgurtaa', icon: ShoppingCart },
    { id: 'delivery', labelEn: 'Delivery', labelOm: 'Geesjiba', icon: Truck },
    { id: 'finances', labelEn: 'Finances', labelOm: 'Faayinaansii', icon: DollarSign },
    { id: 'employees', labelEn: 'Employees', labelOm: 'Hojjettoota', icon: Briefcase },
    { id: 'reports', labelEn: 'Reports', labelOm: 'Gabaasa', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#E41E26] text-white shadow-md transition-colors duration-200">
      {/* Top Banner Notice */}
      <div className="bg-[#B91218] text-xs py-1 px-4 text-center font-medium flex items-center justify-between border-b border-red-700/50">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="bg-white text-[#E41E26] px-1.5 py-0.5 rounded font-bold text-[10px]">AUTHORIZED</span>
          <span>Coca-Cola Bottling Distributor • Buno Bedele Zone, Oromia, Ethiopia</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="opacity-90">Bedele Town Main Depot • Call: +251 91 700 0001</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E41E26] font-black text-xl shadow-lg border-2 border-red-200">
            C
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight uppercase">
              Mohammed Awel
            </h1>
            <p className="text-[11px] font-medium text-red-100 opacity-90 tracking-wider">
              COCA-COLA DISTRIBUTOR
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#E41E26] shadow-sm font-bold scale-105'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(item.labelEn, item.labelOm)}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Firebase Connection Status */}
          <div
            className={`hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
              isFirebaseConnected ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30' : 'bg-slate-700/50 text-slate-300'
            }`}
            title="Firebase Firestore & Auth Active"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Firebase</span>
          </div>

          {/* User Auth Profile / Google Sign-in */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-white/10 px-2 py-1 rounded-lg text-xs font-medium text-white">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-5 h-5 rounded-full" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span className="hidden md:inline max-w-[90px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
              <button
                onClick={() => logoutUser()}
                className="p-1 hover:text-amber-300 transition ml-1"
                title="Sign Out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithGoogle()}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition"
              title="Sign in with Google via Firebase"
            >
              <UserIcon className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Google Auth</span>
            </button>
          )}

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-slate-900 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow transition transform active:scale-95"
            title="Open AI Inventory Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-700 animate-pulse" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Barcode Scanner Button */}
          <button
            onClick={() => setIsBarcodeScannerOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Scan Barcode or QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'om' : 'en')}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-red-900 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-400">
                    Notifications ({notifications.length})
                  </h3>
                  <button
                    onClick={() => setIsNotifDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs cursor-pointer border-l-4 transition ${
                        n.type === 'danger'
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/40'
                          : n.type === 'warning'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                      } ${!n.read ? 'font-semibold' : 'opacity-70'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{n.title}</span>
                        <span className="text-[10px] opacity-60">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-tight">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-1.5 bg-black/20 hover:bg-black/30 border border-white/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">{currentRole}</span>
              <ChevronDown className="w-3 h-3 text-white/70" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
                <div className="px-3 py-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                  Switch Active Role
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-slate-700 flex items-center justify-between ${
                      currentRole === r ? 'font-bold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-slate-700/50' : ''
                    }`}
                  >
                    <span>{r}</span>
                    {currentRole === r && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#B91218] border-t border-red-700 p-4 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                    isActive ? 'bg-white text-[#E41E26] font-bold' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(item.labelEn, item.labelOm)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
