/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './db/storage';
import { Product, Sale, Customer, Order, SalesGoal } from './types';

// Import Views
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProductsView from './components/ProductsView';
import SalesView from './components/SalesView';
import CustomersView from './components/CustomersView';
import OrdersView from './components/OrdersView';
import ReportsView from './components/ReportsView';
import GoalsView from './components/GoalsView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // States for all entities
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [goals, setGoals] = useState<SalesGoal[]>([]);

  // Initialize and load all data on mount
  useEffect(() => {
    StorageService.init();
    refreshAllStates();
  }, []);

  const refreshAllStates = () => {
    setProducts(StorageService.getProducts());
    setSales(StorageService.getSales());
    setCustomers(StorageService.getCustomers());
    setOrders(StorageService.getOrders());
    setGoals(StorageService.getGoals());
  };

  // --- Product Handlers ---
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const fresh: Product = {
      ...newProduct,
      id: 'p_' + Math.random().toString(36).substr(2, 9),
    };
    const updated = [...products, fresh];
    StorageService.saveProducts(updated);
    setProducts(updated);
  };

  const handleEditProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    StorageService.saveProducts(updated);
    setProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    StorageService.saveProducts(updated);
    setProducts(updated);
  };

  // --- Sale Handlers ---
  const handleAddSale = (newSale: Omit<Sale, 'id'>) => {
    const fresh: Sale = {
      ...newSale,
      id: 's_' + Math.random().toString(36).substr(2, 9),
    };
    const updatedSales = [...sales, fresh];
    StorageService.saveSales(updatedSales);
    
    // Refresh all states because customer CRM aggregates and monthly goals automatically recalculate!
    refreshAllStates();
  };

  const handleDeleteSale = (id: string) => {
    const updatedSales = sales.filter(s => s.id !== id);
    StorageService.saveSales(updatedSales);
    
    // Refresh all states to sync customer averages and goals progress
    refreshAllStates();
  };

  // --- Customer Handlers ---
  const handleAddCustomer = (newCust: Omit<Customer, 'id' | 'totalSpent' | 'purchaseCount' | 'lastPurchaseDate'>) => {
    const fresh: Customer = {
      ...newCust,
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      totalSpent: 0,
      purchaseCount: 0,
      lastPurchaseDate: '',
    };
    const updated = [...customers, fresh];
    StorageService.saveCustomers(updated);
    setCustomers(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    StorageService.saveCustomers(updated);
    setCustomers(updated);
  };

  // --- Order Handlers ---
  const handleAddOrder = (newOrder: Omit<Order, 'id'>) => {
    const fresh: Order = {
      ...newOrder,
      id: 'o_' + Math.random().toString(36).substr(2, 9),
    };
    const updated = [...orders, fresh];
    StorageService.saveOrders(updated);
    setOrders(updated);
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    StorageService.saveOrders(updated);
    setOrders(updated);
  };

  const handleDeleteOrder = (id: string) => {
    const updated = orders.filter(o => o.id !== id);
    StorageService.saveOrders(updated);
    setOrders(updated);
  };

  // --- Sales Goal Handlers ---
  const handleUpdateGoal = (month: string, target: number) => {
    const goalExists = goals.some(g => g.month === month);
    let updated: SalesGoal[] = [];

    if (goalExists) {
      updated = goals.map(g => g.month === month ? { ...g, target } : g);
    } else {
      updated = [...goals, {
        id: 'g_' + Math.random().toString(36).substr(2, 9),
        month,
        target,
        achieved: 0
      }];
    }

    StorageService.saveGoals(updated);
    
    // Trigger recalculation relative to sales
    refreshAllStates();
  };

  // Render current active view
  const renderView = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardView
            sales={sales}
            orders={orders}
            products={products}
            goals={goals}
            onNavigate={(sec) => setActiveSection(sec)}
          />
        );
      case 'products':
        return (
          <ProductsView
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        );
      case 'sales':
        return (
          <SalesView
            sales={sales}
            products={products}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        );
      case 'customers':
        return (
          <CustomersView
            customers={customers}
            sales={sales}
            onAddCustomer={handleAddCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case 'orders':
        return (
          <OrdersView
            orders={orders}
            products={products}
            customers={customers}
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        );
      case 'reports':
        return (
          <ReportsView
            sales={sales}
            products={products}
          />
        );
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            sales={sales}
            onUpdateGoal={handleUpdateGoal}
          />
        );
      case 'settings':
        return (
          <SettingsView
            onRefreshData={refreshAllStates}
          />
        );
      default:
        return (
          <div className="py-12 text-center text-gray-500">
            Módulo em desenvolvimento...
          </div>
        );
    }
  };

  return (
    <div id="maelina-app-root" className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F5]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <main id="maelina-main-content" className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Decorative subtle header line or top margin */}
        <div className="h-1.5 bg-gradient-to-r from-rose-brand-400 via-gold-brand-400 to-sage-brand-400 shrink-0" />
        
        {/* Core view inner wrapper */}
        <div className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
