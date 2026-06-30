/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Sparkles, 
  ChevronRight, 
  Percent, 
  Flame, 
  TrendingUp,
  Sliders,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SalesGoal, Sale } from '../types';

interface GoalsViewProps {
  goals: SalesGoal[];
  sales: Sale[];
  onUpdateGoal: (month: string, target: number) => void;
}

export default function GoalsView({ goals, sales, onUpdateGoal }: GoalsViewProps) {
  const currentMonth = '2026-06'; // reference month
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [targetInput, setTargetInput] = useState('1500');

  // Calculate current progress for the selected month dynamically from actual sales list
  const selectedMonthGoal = useMemo(() => {
    const goal = goals.find(g => g.month === selectedMonth);
    
    // Sum sales for this month
    const monthSales = sales.filter(s => s.date.startsWith(selectedMonth));
    const achieved = monthSales.reduce((acc, s) => acc + s.revenue, 0);
    
    const target = goal ? goal.target : 1500; // fallback default
    const percent = Math.round((achieved / target) * 100);

    return {
      month: selectedMonth,
      target,
      achieved,
      percent
    };
  }, [goals, sales, selectedMonth]);

  // Handle set target submit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput) || 0;
    if (val <= 0) return;
    onUpdateGoal(selectedMonth, val);
  };

  // Prepopulate form when selected month changes
  React.useEffect(() => {
    const goal = goals.find(g => g.month === selectedMonth);
    if (goal) {
      setTargetInput(goal.target.toString());
    } else {
      setTargetInput('1500');
    }
  }, [selectedMonth, goals]);

  // List of all monthly targets for comparison
  const monthlyComparison = useMemo(() => {
    // Collect unique months from sales and existing goals to show full comparative list
    const monthSet = new Set<string>();
    goals.forEach(g => monthSet.add(g.month));
    sales.forEach(s => monthSet.add(s.date.substring(0, 7)));

    return Array.from(monthSet).map(monthStr => {
      const goal = goals.find(g => g.month === monthStr);
      const target = goal ? goal.target : 1500;
      
      const monthSales = sales.filter(s => s.date.startsWith(monthStr));
      const achieved = monthSales.reduce((acc, s) => acc + s.revenue, 0);
      const percent = target > 0 ? Math.round((achieved / target) * 100) : 0;

      const formattedMonth = monthStr === '2026-05' ? 'Maio 2026' : 
                            monthStr === '2026-06' ? 'Junho 2026' : 
                            monthStr === '2026-07' ? 'Julho 2026' : monthStr;

      return {
        monthStr,
        formattedMonth,
        target,
        achieved,
        percent
      };
    }).sort((a, b) => b.monthStr.localeCompare(a.monthStr));
  }, [goals, sales]);

  return (
    <div id="goals-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Metas de Faturação</h2>
          <p className="text-sm text-gray-500 mt-1">
            Planeie o crescimento da sua micro-empresa. Defina metas de vendas mensais e acompanhe o termômetro de progresso.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Goals Adjuster & Progress Ring (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Goal Board Card */}
          <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-brand-50/40 rounded-full translate-x-12 -translate-y-12" />
            
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-brand-600 animate-bounce" />
              <span>Painel de Objetivos Ativos</span>
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              
              {/* Circular Progress Ring */}
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-rose-brand-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-rose-brand-500 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - Math.min(100, selectedMonthGoal.percent) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-mono text-gray-900">{selectedMonthGoal.percent}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-rose-brand-800 font-bold mt-0.5">Alcançado</span>
                </div>
              </div>

              {/* Goal Progress metrics info */}
              <div className="flex-1 space-y-4 w-full">
                <div className="bg-rose-brand-50/40 border border-rose-brand-100/50 p-4 rounded-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Faturado</span>
                      <span className="text-xl font-bold font-mono text-sage-brand-600 mt-1 block">
                        Kz {selectedMonthGoal.achieved.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Meta Definida</span>
                      <span className="text-xl font-bold font-mono text-gray-900 mt-1 block">
                        Kz {selectedMonthGoal.target.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar and motivator */}
                <div>
                  {selectedMonthGoal.percent >= 100 ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Parabéns! Superou a meta de vendas para este mês! Incrível! 🌸</span>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Faltam Kz {(selectedMonthGoal.target - selectedMonthGoal.achieved).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} para atingir a meta mensal. Força!</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Goal adjustment selector form */}
          <div className="bg-white border border-rose-brand-50 p-6 rounded-2xl shadow-xs">
            <h4 className="font-serif text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <Sliders className="w-4.5 h-4.5 text-gold-brand-600" />
              <span>Ajustar Configurações de Meta</span>
            </h4>
            <p className="text-xs text-gray-500 mb-5">Escolha o mês de referência e insira um novo valor de meta.</p>
            
            <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row gap-4 items-end">
              {/* Select Month */}
              <div className="w-full sm:w-48">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mês Alvo</span>
                </label>
                <select
                  id="target-goal-month-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400"
                >
                  <option value="2026-05">Maio 2026</option>
                  <option value="2026-06">Junho 2026</option>
                  <option value="2026-07">Julho 2026</option>
                </select>
              </div>

              {/* Set target */}
              <div className="w-full sm:flex-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Valor da Meta (Kz) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">Kz</span>
                  <input
                    id="target-goal-value-input"
                    type="number"
                    required
                    placeholder="0.00"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-full pl-7 pr-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
                  />
                </div>
              </div>

              <button
                id="btn-update-goal-submit"
                type="submit"
                className="w-full sm:w-auto bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Atualizar Meta
              </button>
            </form>
          </div>

        </div>

        {/* Right column: Comparison between months list (1 col) */}
        <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs">
          <h4 className="font-serif text-lg font-bold text-gray-900 mb-2">Histórico & Comparação</h4>
          <p className="text-xs text-gray-500 mb-5">Consulte o desempenho de metas corporativas e faturamentos em outros períodos.</p>

          <div id="comparison-list" className="space-y-4">
            {monthlyComparison.map(goal => (
              <div 
                key={goal.monthStr}
                className={`p-4 rounded-xl border transition-all ${
                  goal.monthStr === selectedMonth 
                    ? 'border-rose-brand-300 bg-rose-brand-50/30 ring-1 ring-rose-brand-100' 
                    : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-950 font-serif">{goal.formattedMonth}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    goal.percent >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.percent}%
                  </span>
                </div>

                {/* Progress bar inside comparatives */}
                <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-200 mt-2.5">
                  <div 
                    style={{ width: `${Math.min(100, goal.percent)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${
                      goal.percent >= 100 ? 'bg-emerald-500' : 'bg-rose-brand-500'
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400 font-mono">
                  <span>Meta: Kz {goal.target.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                  <span className="font-bold text-gray-700">Faturado: Kz {goal.achieved.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
