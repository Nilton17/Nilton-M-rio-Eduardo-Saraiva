/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Package, 
  Coins, 
  PiggyBank, 
  FileSpreadsheet, 
  Printer,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Sale, Product } from '../types';

interface ReportsViewProps {
  sales: Sale[];
  products: Product[];
}

export default function ReportsView({ sales, products }: ReportsViewProps) {
  // Defaults to June 2026 (based on seed data)
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  // Filter sales based on period
  const periodSales = useMemo(() => {
    return sales.filter(s => s.date >= startDate && s.date <= endDate);
  }, [sales, startDate, endDate]);

  // Analytical Calculations
  const metrics = useMemo(() => {
    const revenue = periodSales.reduce((acc, s) => acc + s.revenue, 0);
    const grossProfit = periodSales.reduce((acc, s) => acc + s.grossProfit, 0);
    const netProfit = periodSales.reduce((acc, s) => acc + s.netProfit, 0);
    const reserve = periodSales.reduce((acc, s) => acc + s.reserve, 0);

    // Calc Best Selling Product (by quantity)
    const productQuantities: Record<string, number> = {};
    periodSales.forEach(s => {
      productQuantities[s.productName] = (productQuantities[s.productName] || 0) + s.quantity;
    });

    let bestSeller = 'Nenhum';
    let maxQty = 0;
    Object.entries(productQuantities).forEach(([name, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        bestSeller = name;
      }
    });

    // Calc Most Profitable/Lucrative Customer (by revenue)
    const customerRevenue: Record<string, number> = {};
    periodSales.forEach(s => {
      customerRevenue[s.clientName] = (customerRevenue[s.clientName] || 0) + s.revenue;
    });

    let topCustomer = 'Nenhum';
    let maxRevenue = 0;
    Object.entries(customerRevenue).forEach(([name, rev]) => {
      if (rev > maxRevenue) {
        maxRevenue = rev;
        topCustomer = name;
      }
    });

    return {
      revenue,
      grossProfit,
      netProfit,
      reserve,
      bestSeller,
      bestSellerQty: maxQty,
      topCustomer,
      topCustomerRevenue: maxRevenue
    };
  }, [periodSales]);

  // Group sales by category for visual graph
  const categoryChartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    periodSales.forEach(sale => {
      // Find category of this product
      const product = products.find(p => p.id === sale.productId || p.name === sale.productName);
      const cat = product ? product.category : 'Outros';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + sale.revenue;
    });

    return Object.entries(categoryTotals).map(([name, total]) => ({
      category: name,
      'Faturação (Kz)': parseFloat(total.toFixed(2)),
    })).sort((a, b) => b['Faturação (Kz)'] - a['Faturação (Kz)']);
  }, [periodSales, products]);

  // Color suggestions for category bar cells
  const BAR_COLORS = ['#f83b5e', '#be7f25', '#597d5e', '#a9beab', '#e6c888', '#ffa2ae'];

  // Simulate print report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-view-wrapper" className="space-y-6 animate-fade-in pb-12 print:p-0 print:bg-white">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Relatórios de Desempenho</h2>
          <p className="text-sm text-gray-500 mt-1">
            Analise faturação, lucro líquido real, produto estrela e cliente destaque por período.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Date Filters Card */}
      <div className="bg-white border border-rose-brand-100 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-end justify-between gap-4 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto flex-1">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Início do Período</span>
            </label>
            <input
              id="report-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Fim do Período</span>
            </label>
            <input
              id="report-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            id="btn-report-quick-june"
            onClick={() => { setStartDate('2026-06-01'); setEndDate('2026-06-30'); }}
            className="flex-1 md:flex-initial text-[11px] font-semibold bg-rose-brand-50 text-rose-brand-700 hover:bg-rose-brand-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Mês de Junho
          </button>
          <button
            id="btn-report-quick-all"
            onClick={() => { setStartDate('2026-01-01'); setEndDate('2026-12-31'); }}
            className="flex-1 md:flex-initial text-[11px] font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Ano Inteiro
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block text-center border-b border-gray-300 pb-6 mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Maelina Gift - Relatório Corporativo</h1>
        <p className="text-xs text-gray-500 mt-1">Período de Análise: {startDate} até {endDate}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Gerado em: {new Date().toLocaleDateString('pt-PT')}</p>
      </div>

      {/* Period Summary Stats Grid */}
      <div id="report-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Revenue */}
        <div className="bg-white border border-rose-brand-100 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-rose-brand-800 font-bold">Faturação Período</span>
            <Coins className="w-4 h-4 text-rose-brand-500" />
          </div>
          <h3 className="text-xl font-bold font-mono mt-3 text-gray-950">
            Kz {metrics.revenue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Soma de vendas registadas</p>
        </div>

        {/* Metric 2: Gross Profit */}
        <div className="bg-white border border-sage-brand-100/50 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-sage-brand-800 font-bold">Lucro Bruto Período</span>
            <TrendingUp className="w-4 h-4 text-sage-brand-500" />
          </div>
          <h3 className="text-xl font-bold font-mono mt-3 text-gray-950">
            Kz {metrics.grossProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Dedução de custos de materiais</p>
        </div>

        {/* Metric 3: Automated Reserve */}
        <div className="bg-white border border-gold-brand-100/30 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-gold-brand-800 font-bold">Reserva Retida (10%)</span>
            <PiggyBank className="w-4 h-4 text-gold-brand-500" />
          </div>
          <h3 className="text-xl font-bold font-mono mt-3 text-gray-950">
            Kz {metrics.reserve.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">Guardado automaticamente</p>
        </div>

        {/* Metric 4: Net Profit */}
        <div className="bg-rose-brand-50/50 border border-rose-brand-100/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-rose-brand-900 font-bold">Lucro Líquido Real</span>
            <Sparkles className="w-4 h-4 text-rose-brand-600" />
          </div>
          <h3 className="text-2xl font-extrabold font-mono mt-2 text-rose-brand-700">
            Kz {metrics.netProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[10px] text-rose-brand-900 font-medium mt-1">Saldo limpo disponível</p>
        </div>

      </div>

      {/* Destaques (Top selling / top customer) Row */}
      <div id="report-highlights" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Highlight 1: Best Seller */}
        <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs flex items-center gap-5">
          <div className="p-4 bg-rose-brand-100/50 text-rose-brand-700 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-brand-800 font-bold block">Produto Mais Vendido (Estrela)</span>
            <h4 className="font-serif text-lg font-bold text-gray-950 truncate mt-1">
              {metrics.bestSeller}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <span>Vendidos:</span>
              <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                {metrics.bestSellerQty} unidades
              </span>
            </div>
          </div>
        </div>

        {/* Highlight 2: Top Spender */}
        <div className="bg-white border border-gold-brand-100/30 p-6 rounded-2xl shadow-xs flex items-center gap-5">
          <div className="p-4 bg-gold-brand-100/50 text-gold-brand-700 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-gold-brand-800 font-bold block">Cliente Mais Lucrativo</span>
            <h4 className="font-serif text-lg font-bold text-gray-950 truncate mt-1">
              {metrics.topCustomer}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-gold-brand-700 font-semibold">
              <span>Gasto no período:</span>
              <span className="font-mono font-bold text-gray-900 bg-gold-brand-50 px-2 py-0.5 rounded-md border border-gold-brand-100/50">
                Kz {metrics.topCustomerRevenue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Category Sales Chart Card */}
      <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs">
        <h4 className="font-serif text-lg font-bold text-gray-900 mb-2">Desempenho por Categorias</h4>
        <p className="text-xs text-gray-500 mb-6">Faturação total obtida em cada buquê de dinheiro, de flores, cesta de doces ou mimo no período selecionado</p>
        
        {categoryChartData.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            Nenhuma venda registada neste período para segmentar categorias.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} tick={{ fill: '#4b5563', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #ffe3e6' }}
                />
                <Bar dataKey="Faturação (Kz)" fill="#f83b5e" radius={[0, 4, 4, 0]} barSize={16}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
