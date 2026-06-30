/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Banknote, 
  Users,  
  CalendarClock, 
  BarChart3, 
  Target, 
  Settings,
  Flower2,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  mobileOpen, 
  setMobileOpen 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: ShoppingBag },
    { id: 'sales', label: 'Registo de Vendas', icon: Banknote },
    { id: 'customers', label: 'Gestão de Clientes', icon: Users },
    { id: 'orders', label: 'Encomendas', icon: CalendarClock },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'goals', label: 'Metas de Vendas', icon: Target },
    { id: 'settings', label: 'Configurações & Backup', icon: Settings },
  ];

  const handleNav = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top navigation header */}
      <header id="mobile-header" className="lg:hidden flex items-center justify-between bg-white px-5 py-4 border-b border-rose-brand-100 shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-rose-brand-100 p-1.5 rounded-full text-rose-brand-600">
            <Flower2 className="w-5 h-5" />
          </div>
          <span className="font-serif font-semibold text-lg tracking-wide text-rose-brand-900">
            Maelina Gift
          </span>
        </div>
        <button 
          id="toggle-sidebar-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-600 p-2 hover:bg-rose-brand-50 rounded-lg transition-colors focus:outline-hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          id="sidebar-backdrop"
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside 
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 lg:z-30 w-72 bg-white border-r border-rose-brand-100 flex flex-col h-full shadow-xs lg:shadow-none`}
      >
        {/* Header - Brand */}
        <div className="hidden lg:flex items-center gap-3 px-8 py-8 border-b border-rose-brand-50">
          <div className="bg-rose-brand-50 p-2 rounded-xl text-rose-brand-600 shadow-sm border border-rose-brand-100/50">
            <Flower2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl tracking-wider text-rose-brand-900">
              Maelina Gift
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gold-brand-600 font-semibold mt-0.5">
              Gestão de Buquês & Mimos
            </p>
          </div>
        </div>

        {/* Mobile menu close button */}
        <div className="lg:hidden flex items-center justify-between px-6 py-6 border-b border-rose-brand-50">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-rose-brand-600" />
            <span className="font-serif font-bold text-lg text-rose-brand-900">Maelina Gift</span>
          </div>
          <button 
            id="close-sidebar-mobile"
            onClick={() => setMobileOpen(false)} 
            className="text-gray-500 hover:bg-rose-brand-100 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav id="sidebar-nav" className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-brand-500 to-rose-brand-600 text-white shadow-md shadow-rose-brand-100' 
                    : 'text-gray-600 hover:bg-rose-brand-50/70 hover:text-rose-brand-950'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-rose-brand-500'
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* System Footer Info */}
        <div className="p-6 border-t border-rose-brand-50 bg-rose-brand-50/20">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-semibold text-sage-brand-700 tracking-wide">
              Sistema Totalmente Offline
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 font-mono">
            SQLite Local v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}
