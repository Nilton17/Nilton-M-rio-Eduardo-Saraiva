/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  User, 
  Phone, 
  FileSpreadsheet, 
  PlusCircle, 
  X,
  Banknote,
  Info,
  Scale,
  Sparkles
} from 'lucide-react';
import { Product, Sale } from '../types';

interface SalesViewProps {
  sales: Sale[];
  products: Product[];
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
  onDeleteSale: (id: string) => void;
}

export default function SalesView({ 
  sales, 
  products, 
  onAddSale, 
  onDeleteSale 
}: SalesViewProps) {
  
  const [search, setSearch] = useState('');
  
  // Registration Form Toggle
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Inputs
  const [productId, setProductId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [saleDate, setSaleDate] = useState('2026-06-30'); // Default to reference date
  const [quantity, setQuantity] = useState(1);
  const [materialCost, setMaterialCost] = useState(10);

  // Undo confirmation state
  const [isUndoConfirmOpen, setIsUndoConfirmOpen] = useState(false);
  const [saleIdToUndo, setSaleIdToUndo] = useState<string | null>(null);

  // Find selected product info for dynamic calculations
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === productId);
  }, [productId, products]);

  // Dynamic live calculations
  const liveCalculations = useMemo(() => {
    if (!selectedProduct) {
      return { revenue: 0, grossProfit: 0, reserve: 0, netProfit: 0 };
    }
    const revenue = selectedProduct.price * quantity;
    const grossProfit = Math.max(0, revenue - materialCost);
    const reserve = grossProfit * 0.1;
    const netProfit = grossProfit - reserve;

    return {
      revenue,
      grossProfit,
      reserve,
      netProfit
    };
  }, [selectedProduct, quantity, materialCost]);

  // Handle Register Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !clientName || !clientPhone || !saleDate || quantity < 1) {
      alert('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (!selectedProduct) return;

    onAddSale({
      productId,
      productName: selectedProduct.name,
      clientName,
      clientPhone,
      date: saleDate,
      quantity,
      materialCost: Number(materialCost) || 0,
      revenue: parseFloat(liveCalculations.revenue.toFixed(2)),
      grossProfit: parseFloat(liveCalculations.grossProfit.toFixed(2)),
      reserve: parseFloat(liveCalculations.reserve.toFixed(2)),
      netProfit: parseFloat(liveCalculations.netProfit.toFixed(2)),
    });

    // Reset Form
    setProductId('');
    setClientName('');
    setClientPhone('');
    setSaleDate('2026-06-30');
    setQuantity(1);
    setMaterialCost(10);
    setIsFormOpen(false);
  };

  // Search filter sales
  const filteredSales = useMemo(() => {
    // Sort chronological descending (newest sales first)
    const sorted = [...sales].sort((a, b) => b.date.localeCompare(a.date));
    if (!search) return sorted;
    return sorted.filter(s => 
      s.clientName.toLowerCase().includes(search.toLowerCase()) || 
      s.productName.toLowerCase().includes(search.toLowerCase()) ||
      s.clientPhone.includes(search)
    );
  }, [sales, search]);

  // Trigger Undo/Delete
  const triggerUndo = (id: string) => {
    setSaleIdToUndo(id);
    setIsUndoConfirmOpen(true);
  };

  const handleConfirmUndo = () => {
    if (saleIdToUndo) {
      onDeleteSale(saleIdToUndo);
    }
    setIsUndoConfirmOpen(false);
    setSaleIdToUndo(null);
  };

  return (
    <div id="sales-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Registo & Histórico de Vendas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Lance novas vendas de buquês, veja a faturação real e deduções automáticas de reserva.
          </p>
        </div>
        <button
          id="btn-toggle-sale-form"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isFormOpen ? 'Fechar Formulário' : 'Registar Nova Venda'}</span>
        </button>
      </div>

      {/* Sale Registration Panel */}
      {isFormOpen && (
        <div id="sale-form-container" className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-md max-w-4xl mx-auto animate-scale-up">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-brand-50">
            <Banknote className="w-5 h-5 text-rose-brand-600" />
            <h3 className="font-serif text-lg font-bold text-gray-900">Formulário de Vendas Maelina</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Form Fields */}
            <div className="space-y-4">
              {/* Product Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Selecionar Produto *
                </label>
                <select
                  id="sale-product-select"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent bg-white"
                >
                  <option value="">-- Escolha o produto vendido --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Unitário: Kz {p.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span>Nome do Cliente *</span>
                  </label>
                  <input
                    id="sale-client-name"
                    type="text"
                    required
                    placeholder="Ex: Maria de Oliveira"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent"
                  />
                </div>

                {/* Client Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>Telefone *</span>
                  </label>
                  <input
                    id="sale-client-phone"
                    type="tel"
                    required
                    placeholder="Ex: +244 923 456 789"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date, Qty & Cost Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Sale Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>Data Venda *</span>
                  </label>
                  <input
                    id="sale-date"
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quantidade *
                  </label>
                  <input
                    id="sale-quantity"
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                  />
                </div>

                {/* Cost of materials */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Custo de Materiais (Kz)
                  </label>
                  <input
                    id="sale-material-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={materialCost}
                    onChange={(e) => setMaterialCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <button
                id="btn-register-sale-submit"
                type="submit"
                disabled={!productId}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  productId 
                    ? 'bg-rose-brand-600 hover:bg-rose-brand-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Efetuar Registo de Venda</span>
              </button>
            </div>

            {/* Right Column: Live Autocalculations Breakdown */}
            <div className="bg-rose-brand-50/40 border border-rose-brand-100 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-rose-brand-800 font-bold mb-3.5 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Cálculos de Fechamento (Tempo Real)</span>
                </h4>
                
                {selectedProduct ? (
                  <div className="space-y-3.5">
                    {/* Item chosen detail */}
                    <div className="bg-white p-3 rounded-xl border border-rose-brand-100/30 flex items-center gap-3">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100" 
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-900 truncate max-w-[180px]">{selectedProduct.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">Preço Base: Kz {selectedProduct.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {/* Formula 1 */}
                      <div className="flex justify-between py-1.5 border-b border-rose-brand-100/30">
                        <span className="text-gray-500">Receita Bruta (Preço × Qtd)</span>
                        <span className="font-mono font-semibold text-gray-900">
                          Kz {liveCalculations.revenue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {/* Formula 2 */}
                      <div className="flex justify-between py-1.5 border-b border-rose-brand-100/30">
                        <span className="text-gray-500">Custo de Materiais</span>
                        <span className="font-mono text-red-600">
                          - Kz {materialCost.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Formula 3 */}
                      <div className="flex justify-between py-1.5 border-b border-rose-brand-100/30">
                        <span className="text-gray-900 font-semibold">Lucro Bruto (Receita - Custos)</span>
                        <span className="font-mono font-bold text-gray-950">
                          Kz {liveCalculations.grossProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Formula 4 */}
                      <div className="flex justify-between py-1.5 border-b border-rose-brand-100/30">
                        <span className="text-gray-500 flex items-center gap-1" title="Reserva obrigatória para reinvestimentos do negócio.">
                          <span>Reserva de 10% (Automática)</span>
                          <Info className="w-3 h-3 text-gold-brand-600 cursor-help" />
                        </span>
                        <span className="font-mono text-gold-brand-700">
                          - Kz {liveCalculations.reserve.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Final Result */}
                      <div className="flex justify-between pt-3 text-rose-brand-900 font-bold">
                        <span className="uppercase text-xs tracking-wider">Lucro Líquido Real</span>
                        <span className="text-lg font-extrabold font-mono text-rose-brand-600">
                          Kz {liveCalculations.netProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm">Por favor, selecione um produto no formulário ao lado para simular o fechamento de caixa.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-rose-brand-100/50 flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed">
                <Info className="w-4 h-4 text-rose-brand-400 shrink-0 mt-0.5" />
                <span>Os dados registados são persistidos permanentemente no SQLite interno do browser. O saldo e as comissões são atualizados no painel principal instantaneamente.</span>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Sales Log Table Card */}
      <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs">
        
        {/* Table Search & Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-gray-900">Histórico de Fechamento de Vendas</h4>
            <p className="text-xs text-gray-500">Listagem de todas as vendas registadas organizadas cronologicamente</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="search-sales-input"
                type="text"
                placeholder="Pesquisar cliente ou produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-rose-brand-50/20 border border-rose-brand-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-300 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sales Table Responsive */}
        {filteredSales.length === 0 ? (
          <div id="no-sales-state" className="text-center py-12 text-gray-400">
            <Banknote className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm">Nenhuma venda registada com o filtro ou busca inserida.</p>
          </div>
        ) : (
          <div id="sales-table-wrapper" className="overflow-x-auto rounded-xl border border-rose-brand-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-rose-brand-50/30 text-rose-brand-900 font-semibold text-xs border-b border-rose-brand-50">
                  <th className="p-4 rounded-tl-xl">Produto</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 font-mono text-center">Qtd</th>
                  <th className="p-4 font-mono text-right">Faturação</th>
                  <th className="p-4 font-mono text-right">Custo Materiais</th>
                  <th className="p-4 font-mono text-right">Lucro Bruto</th>
                  <th className="p-4 font-mono text-right">Reserva (10%)</th>
                  <th className="p-4 font-mono text-right">Lucro Líquido</th>
                  <th className="p-4 text-center rounded-tr-xl">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-brand-50/30 text-xs">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-rose-brand-50/10 transition-colors">
                    <td className="p-4 font-medium text-gray-900 max-w-[180px] truncate" title={sale.productName}>
                      {sale.productName}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{sale.clientName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{sale.clientPhone}</div>
                    </td>
                    <td className="p-4 font-mono text-gray-500 whitespace-nowrap">
                      {sale.date}
                    </td>
                    <td className="p-4 font-mono text-center font-bold text-gray-800">
                      {sale.quantity}
                    </td>
                    <td className="p-4 font-mono text-right font-semibold text-gray-900">
                      Kz {sale.revenue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-mono text-right text-red-600">
                      Kz {sale.materialCost.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-mono text-right font-medium text-gray-900">
                      Kz {sale.grossProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-mono text-right text-gold-brand-700">
                      Kz {sale.reserve.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-mono text-right font-bold text-sage-brand-600">
                      Kz {sale.netProfit.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        id={`undo-sale-${sale.id}`}
                        onClick={() => triggerUndo(sale.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Desfazer venda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Undo/Delete sale confirmation modal */}
      {isUndoConfirmOpen && (
        <div id="undo-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <h3 className="font-serif text-lg font-bold text-gray-900 text-center">Desfazer este registo de venda?</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Esta ação removerá permanentemente este registo do banco de dados SQLite. Os dados de faturação do cliente e lucros do painel serão decrementados.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="undo-cancel"
                onClick={() => setIsUndoConfirmOpen(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Manter Venda
              </button>
              <button
                id="undo-confirm"
                onClick={handleConfirmUndo}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
