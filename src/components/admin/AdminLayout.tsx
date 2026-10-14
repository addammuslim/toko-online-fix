import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  Clock,
  Activity,
  Users,
  MessageSquare,
  LogOut,
  ExternalLink,
  Code2,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet,
  Receipt,
  Tag,
  UserCheck,
  FileText
} from 'lucide-react';
import {
  WebSettings,
  Order,
  Product,
  Category,
  HomeSection,
  PosShift,
  ActivityLog,
  StaffUser,
  ContactMessage,
  Review,
  Expense,
  Promotion,
  LoyaltyReward,
  Customer
} from '../../types';
import { StorageService } from '../../services/storage';

import { AdminDashboard } from './AdminDashboard';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminPos } from './AdminPos';
import { AdminHomeBuilder } from './AdminHomeBuilder';
import { AdminSettings } from './AdminSettings';
import { AdminLogs } from './AdminLogs';
import { AdminUsers } from './AdminUsers';
import { AdminInbox } from './AdminInbox';
import { AdminReports } from './AdminReports';
import { AdminExpenses } from './AdminExpenses';
import { AdminPromotions } from './AdminPromotions';
import { AdminCustomers } from './AdminCustomers';
import { AdminPages } from './AdminPages';
import { PhpSourceViewer } from './PhpSourceViewer';

interface Props {
  settings: WebSettings;
  orders: Order[];
  products: Product[];
  categories: Category[];
  homeSections: HomeSection[];
  posShift: PosShift;
  logs: ActivityLog[];
  staff: StaffUser[];
  inbox: ContactMessage[];
  reviews: Review[];
  expenses: Expense[];
  promotions: Promotion[];
  loyaltyRewards: LoyaltyReward[];
  customers: Customer[];
  onBackToStore: () => void;
  onRefreshAll: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<Props> = ({
  settings,
  orders,
  products,
  categories,
  homeSections,
  posShift,
  logs,
  staff,
  inbox,
  reviews,
  expenses,
  promotions,
  loyaltyRewards,
  customers,
  onBackToStore,
  onRefreshAll,
  onLogout
}) => {
  const [activeMenu, setActiveMenu] = useState<
    | 'dashboard'
    | 'reports'
    | 'expenses'
    | 'promotions'
    | 'customers'
    | 'orders'
    | 'products'
    | 'pos'
    | 'builder'
    | 'pages'
    | 'settings'
    | 'inbox'
    | 'users'
    | 'logs'
    | 'php_code'
  >('dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'reports', label: 'Laporan Laba Rugi', icon: FileSpreadsheet, highlight: true },
    { id: 'expenses', label: 'Pengeluaran Toko', icon: Receipt },
    { id: 'promotions', label: 'Promo & Loyalty', icon: Tag },
    { id: 'customers', label: 'Database Customer', icon: UserCheck },
    {
      id: 'orders',
      label: 'Pesanan & Resi',
      icon: ShoppingBag,
      badge: orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Dibayar').length
    },
    { id: 'products', label: 'Katalog Produk', icon: Package },
    { id: 'pos', label: 'POS Kasir Offline', icon: Clock, highlight: true },
    { id: 'builder', label: 'Home Builder', icon: Layers },
    { id: 'pages', label: 'Halaman CMS (About/S&K)', icon: FileText, highlight: true },
    { id: 'settings', label: 'Web Settings & Logo', icon: Settings },
    {
      id: 'inbox',
      label: 'Inbox & Ulasan',
      icon: MessageSquare,
      badge: inbox.filter((m) => m.status === 'unread').length
    },
    { id: 'users', label: 'User & RBAC', icon: Users },
    { id: 'logs', label: 'Logs & Audit Trail', icon: Activity },
    { id: 'php_code', label: 'PHP Native MVC Code', icon: Code2 }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-sm tracking-tight">Admin & POS Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between p-5 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-md">
                N
              </div>
              <div>
                <h2 className="font-black text-sm text-white tracking-tight leading-tight">
                  {settings.storeName}
                </h2>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Admin & POS System
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-semibold max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : item.highlight
                      ? 'text-emerald-400 hover:bg-slate-900'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Lihat Toko Online</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
        {activeMenu === 'dashboard' && (
          <AdminDashboard
            orders={orders}
            products={products}
            logs={logs}
            onNavigateTab={(tab) => setActiveMenu(tab as any)}
          />
        )}

        {activeMenu === 'reports' && (
          <AdminReports orders={orders} expenses={expenses} products={products} />
        )}

        {activeMenu === 'expenses' && (
          <AdminExpenses expenses={expenses} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'promotions' && (
          <AdminPromotions
            promotions={promotions}
            loyaltyRewards={loyaltyRewards}
            onRefresh={onRefreshAll}
          />
        )}

        {activeMenu === 'customers' && (
          <AdminCustomers
            customers={customers}
            orders={orders}
            loyaltyRewards={loyaltyRewards}
            onRefresh={onRefreshAll}
          />
        )}

        {activeMenu === 'orders' && (
          <AdminOrders orders={orders} onRefreshOrders={onRefreshAll} />
        )}

        {activeMenu === 'products' && (
          <AdminProducts products={products} categories={categories} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'pos' && (
          <AdminPos
            products={products}
            settings={settings}
            posShift={posShift}
            customers={customers}
            loyaltyRewards={loyaltyRewards}
            promotions={promotions}
            onRefreshOrders={onRefreshAll}
          />
        )}

        {activeMenu === 'builder' && (
          <AdminHomeBuilder homeSections={homeSections} products={products} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'pages' && (
          <AdminPages settings={settings} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'settings' && (
          <AdminSettings settings={settings} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'inbox' && (
          <AdminInbox inbox={inbox} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'users' && (
          <AdminUsers staff={staff} onRefresh={onRefreshAll} />
        )}

        {activeMenu === 'logs' && <AdminLogs logs={logs} />}

        {activeMenu === 'php_code' && <PhpSourceViewer />}
      </main>
    </div>
  );
};
