/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Clock, 
  PiggyBank, 
  AlertCircle,
  Percent,
  PlusCircle,
  Package,
  Activity,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Product, Sale, Order, SalesGoal } from '../types';

interface DashboardViewProps {
  sales: Sale[];
  orders: Order[];
  products: Product[];
  goals: SalesGoal[];
  onNavigate: (section: string) => void;
}

export default function DashboardView({ 
  sales, 
  orders, 
  products, 
  goals,
  onNavigate 
}: DashboardViewProps) {
  
  // Set system reference date as 2026-06-30 based on system metadata
  const REF_DATE = '2026-06-30';

  const stats = useMemo(() => {
    // 1. Vendas do dia (2026-06-30)
    const salesTodayList = sales.filter(s => s.date === REF_DATE);
    const revenueToday = salesTodayList.reduce((acc, s) => acc + s.revenue, 0);

    // 2. Vendas da semana (Last 7 days: 2026-06-24 to 2026-06-30)
    const sevenDaysAgo = new Date(REF_DATE);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    
    const salesWeekList = sales.filter(s => s.date >= sevenDaysAgoStr && s.date <= REF_DATE);
    const revenueWeek = salesWeekList.reduce((acc, s) => acc + s.revenue, 0);

    // 3. Vendas do mês (2026-06)
    const currentMonthPrefix = REF_DATE.substring(0, 7); // "2026-06"
    const salesMonthList = sales.filter(s => s.date.startsWith(currentMonthPrefix));
    const revenueMonth = salesMonthList.reduce((acc, s) => acc + s.revenue, 0);

    // 4. Lucro total (Gross Profit)
    const totalGrossProfit = sales.reduce((acc, s) => acc + s.grossProfit, 0);

    // 5. Lucro líquido
    const totalNetProfit = sales.reduce((acc, s) => acc + s.netProfit, 0);

    // 6. Reserva automática de 10% do lucro
    const totalReserve = sales.reduce((acc, s) => acc + s.reserve, 0);

    // 7. Número de encomendas pendentes (Pendente ou Em produção)
    const pendingOrdersCount = orders.filter(o => o.status === 'Pendente' || o.status === 'Em produção').length;

    return {
      revenueToday,
      revenueWeek,
      revenueMonth,
      totalGrossProfit,
      totalNetProfit,
      totalReserve,
      pendingOrdersCount
    };
  }, [sales, orders]);

  // Current month's goal progress
  const currentGoalProgress = useMemo(() => {
    const currentMonthPrefix = REF_DATE.substring(0, 7);
    const activeGoal = goals.find(g => g.month === currentMonthPrefix) || { target: 1000, achieved: 0 };
    
    // Recalculate achieved based on sales this month
    const monthSales = sales.filter(s => s.date.startsWith(currentMonthPrefix));
    const achieved = monthSales.reduce((acc, s) => acc + s.revenue, 0);
    const percent = Math.min(100, Math.round((achieved / activeGoal.target) * 100)) || 0;

    return {
      target: activeGoal.target,
      achieved,
      percent
    };
  }, [sales, goals]);

  // Chart data: Line chart of sales evolution (by date) for the last 15 days
  const lineChartData = useMemo(() => {
    // Generate last 15 days range up to REF_DATE
    const dates: string[] = [];
    for (let i = 14; i >= 0; i--) {
      const d = new Date(REF_DATE);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates.map(dateStr => {
      const dateSales = sales.filter(s => s.date === dateStr);
      const revenue = dateSales.reduce((acc, s) => acc + s.revenue, 0);
      const profit = dateSales.reduce((acc, s) => acc + s.netProfit, 0);
      
      // format to readable date "DD/MM"
      const parts = dateStr.split('-');
      const formattedDate = `${parts[2]}/${parts[1]}`;

      return {
        date: formattedDate,
        fullDate: dateStr,
        'Receita (Kz)': parseFloat(revenue.toFixed(2)),
        'Lucro Líquido (Kz)': parseFloat(profit.toFixed(2)),
      };
    });
  }, [sales]);

  // Chart data: Monthly profits (Bar chart)
  const barChartData = useMemo(() => {
    const months = ['2026-04', '2026-05', '2026-06'];
    
    return months.map(m => {
      const mSales = sales.filter(s => s.date.startsWith(m));
      const revenue = mSales.reduce((acc, s) => acc + s.revenue, 0);
      const grossProfit = mSales.reduce((acc, s) => acc + s.grossProfit, 0);
      const netProfit = mSales.reduce((acc, s) => acc + s.netProfit, 0);
      const reserve = mSales.reduce((acc, s) => acc + s.reserve, 0);

      // Month name
      const monthNames: Record<string, string> = {
        '2026-04': 'Abril',
        '2026-05': 'Maio',
        '2026-06': 'Junho',
      };

      return {
        month: monthNames[m] || m,
        'Faturação (Kz)': parseFloat(revenue.toFixed(2)),
        'Lucro Bruto (Kz)': parseFloat(grossProfit.toFixed(2)),
        'Lucro Líquido (Kz)': parseFloat(netProfit.toFixed(2)),
        'Reserva (10%) (Kz)': parseFloat(reserve.toFixed(2)),
      };
    });
  }, [sales]);

  return (
    <div id="dashboard-view-wrapper" className="space-y-8 animate-fade-in pb-12">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">
            Olá, Bem-vindo ao Maelina Gift
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Aqui está um resumo operacional e financeiro da sua micro-empresa de mimos hoje, <span className="font-semibold text-rose-brand-600">30 de Junho de 2026</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="register-sale-quick"
            onClick={() => onNavigate('sales')}
            className="bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registar Venda</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div id="kpi-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Vendas do Dia */}
        <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-brand-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs uppercase tracking-wider text-rose-brand-700 font-semibold">Vendas do Dia</span>
            <div className="p-2 bg-rose-brand-100 text-rose-brand-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 font-mono">
              Kz {stats.revenueToday.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-rose-brand-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Sincronizado offline</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Vendas da Semana */}
        <div className="bg-white border border-gold-brand-100/50 p-6 rounded-2xl shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-brand-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs uppercase tracking-wider text-gold-brand-700 font-semibold">Vendas da Semana</span>
            <div className="p-2 bg-gold-brand-100 text-gold-brand-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 font-mono">
              Kz {stats.revenueWeek.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-gold-brand-600 font-medium flex items-center gap-1 mt-1">
              <span>Últimos 7 dias de atividade</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Vendas do Mês */}
        <div className="bg-white border border-sage-brand-100/50 p-6 rounded-2xl shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage-brand-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs uppercase tracking-wider text-sage-brand-700 font-semibold">Faturação Mês</span>
            <div className="p-2 bg-sage-brand-100 text-sage-brand-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 font-mono">
              Kz {stats.revenueMonth.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-sage-brand-600 font-medium flex items-center gap-1 mt-1">
              <span>Mês corrente (Junho)</span>
            </p>
          </div>
        </div>

        {/* Metric 4: Encomendas Pendentes */}
        <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-brand-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-500 group-hover:scale-110" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">Encomendas Pendentes</span>
            <div className={`p-2 rounded-xl ${stats.pendingOrdersCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 relative z-10">
            <h3 className="text-2xl font-bold text-gray-900 font-mono">
              {stats.pendingOrdersCount}
            </h3>
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
              <span>A aguardar produção/entrega</span>
            </p>
          </div>
        </div>

      </div>

      {/* Profits & Reserve Row */}
      <div id="profits-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card: Lucro Bruto */}
        <div className="bg-gradient-to-br from-sage-brand-600 to-sage-brand-800 text-white p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-sage-brand-200 font-bold">Lucro Bruto (Acumulado)</span>
            <div className="p-2 bg-white/10 text-white rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm text-sage-brand-200 block">Total bruto</span>
            <h3 className="text-3xl font-extrabold font-mono mt-1">
              Kz {stats.totalGrossProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-sage-brand-100 mt-2">
              Faturação total subtraída do custo de materiais.
            </p>
          </div>
        </div>

        {/* Card: Reserva de 10% */}
        <div className="bg-gradient-to-br from-gold-brand-600 to-gold-brand-800 text-white p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-gold-brand-200 font-bold">Reserva Automática (10%)</span>
            <div className="p-2 bg-white/10 text-white rounded-xl">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm text-gold-brand-200 block">Poupado automaticamente</span>
            <h3 className="text-3xl font-extrabold font-mono mt-1">
              Kz {stats.totalReserve.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-gold-brand-100 mt-2">
              Reserva de segurança retida de 10% do lucro bruto.
            </p>
          </div>
        </div>

        {/* Card: Lucro Líquido */}
        <div className="bg-gradient-to-br from-rose-brand-600 to-rose-brand-800 text-white p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-rose-brand-100 font-bold">Lucro Líquido Real</span>
            <div className="p-2 bg-white/10 text-white rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-sm text-rose-brand-100 block">Disponível em caixa</span>
            <h3 className="text-3xl font-extrabold font-mono mt-1">
              Kz {stats.totalNetProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-rose-brand-100 mt-2">
              Lucro bruto deduzida a poupança automática de 10%.
            </p>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div id="dashboard-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Evolution of Sales */}
        <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-gray-900">Evolução Diária de Vendas</h4>
              <p className="text-xs text-gray-500">Fluxo de caixa e lucratividade nos últimos 15 dias</p>
            </div>
            <span className="text-xs font-mono bg-rose-brand-50 text-rose-brand-700 px-2.5 py-1 rounded-full font-semibold">
              Últimas 2 semanas
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f83b5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f83b5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#597d5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#597d5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #ffe3e6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Receita (Kz)" stroke="#f83b5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="Lucro Líquido (Kz)" stroke="#597d5e" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Profits */}
        <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-gray-900">Comparativo Mensal</h4>
              <p className="text-xs text-gray-500">Faturação, Lucro Líquido e Reservas no trimestre</p>
            </div>
            <span className="text-xs font-mono bg-gold-brand-50 text-gold-brand-700 px-2.5 py-1 rounded-full font-semibold">
              Trimestral
            </span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #faf3e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Faturação (Kz)" fill="#f83b5e" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Lucro Líquido (Kz)" fill="#597d5e" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Reserva (10%) (Kz)" fill="#be7f25" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Goal Progress and Quick Info Row */}
      <div id="goal-highlights-row" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Goal Indicator Card */}
        <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-900">Meta de Faturação - Junho</span>
              <span className="text-xs font-mono bg-rose-brand-50 text-rose-brand-700 font-bold px-2.5 py-0.5 rounded-full">
                {currentGoalProgress.percent}% alcançado
              </span>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between text-xs">
                <span className="text-gray-500 font-mono">Progresso: Kz {currentGoalProgress.achieved.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                <span className="text-gray-900 font-semibold font-mono">Meta: Kz {currentGoalProgress.target.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-rose-brand-100">
                <div 
                  style={{ width: `${currentGoalProgress.percent}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-rose-brand-400 to-rose-brand-600 transition-all duration-1000 ease-out rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Deseja alterar a sua meta mensal?</span>
            <button 
              id="go-to-goals-tab"
              onClick={() => onNavigate('goals')} 
              className="text-rose-brand-600 font-semibold hover:text-rose-brand-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Gerir metas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Highlights card */}
        <div className="bg-white border border-gold-brand-100/50 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-semibold text-gray-900 text-sm">Visão do Catálogo</h5>
              <p className="text-xs text-gray-500 mt-1">Sua loja possui <span className="font-bold text-rose-brand-600">{products.length} produtos</span> ativos cadastrados.</p>
            </div>
            <div className="bg-gold-brand-100 p-2 text-gold-brand-700 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <div className="bg-rose-brand-50/50 rounded-xl p-3 flex-1 text-center border border-rose-brand-100/30">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Ticket Médio</span>
              <h6 className="text-lg font-bold text-gray-800 font-mono mt-1">
                Kz {sales.length > 0 ? (sales.reduce((acc, s) => acc + s.revenue, 0) / sales.length).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) : '0,00'}
              </h6>
            </div>
            <div className="bg-sage-brand-50/50 rounded-xl p-3 flex-1 text-center border border-sage-brand-100/30">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Total Vendas</span>
              <h6 className="text-lg font-bold text-gray-800 font-mono mt-1">{sales.length}</h6>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Visualizar lista de produtos?</span>
            <button 
              id="go-to-products-tab"
              onClick={() => onNavigate('products')} 
              className="text-gold-brand-600 font-semibold hover:text-gold-brand-700 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver Catálogo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
