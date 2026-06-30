/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Plus, 
  Calendar, 
  BadgeEuro, 
  ShoppingBag,
  Sparkles,
  Phone,
  User,
  X,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  Banknote
} from 'lucide-react';
import { Customer, Sale } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  sales: Sale[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'purchaseCount' | 'lastPurchaseDate'>) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function CustomersView({ 
  customers, 
  sales, 
  onAddCustomer, 
  onDeleteCustomer 
}: CustomersViewProps) {
  
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Delete confirm dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);

  // Calculations for CRM overview cards
  const crmStats = useMemo(() => {
    const totalCount = customers.length;
    const averageSpend = totalCount > 0 
      ? customers.reduce((acc, c) => acc + c.totalSpent, 0) / totalCount 
      : 0;
    
    // Top Spender
    let topSpender: Customer | null = null;
    customers.forEach(c => {
      if (!topSpender || c.totalSpent > topSpender.totalSpent) {
        topSpender = c;
      }
    });

    return {
      totalCount,
      averageSpend,
      topSpender
    };
  }, [customers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.phone.includes(search)
    );
  }, [customers, search]);

  // Handle Add Customer Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    onAddCustomer({ name, phone });
    
    setName('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  // Trigger Delete Customer
  const triggerDelete = (id: string) => {
    setCustomerIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerIdToDelete) {
      onDeleteCustomer(customerIdToDelete);
    }
    setIsDeleteConfirmOpen(false);
    setCustomerIdToDelete(null);
  };

  // Get purchases for selected customer
  const customerPurchases = useMemo(() => {
    if (!selectedCustomerPhone) return [];
    return sales.filter(s => s.clientPhone.trim() === selectedCustomerPhone.trim())
                .sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedCustomerPhone, sales]);

  const selectedCustomerName = useMemo(() => {
    if (!selectedCustomerPhone) return '';
    const cust = customers.find(c => c.phone.trim() === selectedCustomerPhone.trim());
    return cust ? cust.name : '';
  }, [selectedCustomerPhone, customers]);

  return (
    <div id="customers-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Gestão de Clientes (CRM)</h2>
          <p className="text-sm text-gray-500 mt-1">
            Controle a base de clientes, acompanhe o histórico de compras de buquês, cestas e mimos, e analise o gasto total.
          </p>
        </div>
        <button
          id="btn-add-customer-trigger"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Cliente</span>
        </button>
      </div>

      {/* CRM Overview Cards */}
      <div id="crm-stats-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white border border-rose-brand-100 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-brand-50 text-rose-brand-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Base de Clientes</span>
            <h4 className="text-xl font-bold text-gray-950 font-mono mt-0.5">{crmStats.totalCount}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Cadastrados offline</p>
          </div>
        </div>

        {/* Average Customer Spend */}
        <div className="bg-white border border-gold-brand-100/30 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-gold-brand-50 text-gold-brand-600 rounded-xl">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Ticket por Cliente</span>
            <h4 className="text-xl font-bold text-gray-950 font-mono mt-0.5">Kz {crmStats.averageSpend.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Média de gasto acumulado</p>
          </div>
        </div>

        {/* Top Spender */}
        <div className="bg-gradient-to-br from-rose-brand-500/10 to-gold-brand-500/10 border border-rose-brand-100 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-brand-100 text-rose-brand-700 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-brand-800 font-bold block">Cliente Estrela ⭐</span>
            <h4 className="text-base font-bold text-gray-950 truncate mt-0.5">
              {crmStats.topSpender ? (crmStats.topSpender as Customer).name : 'Nenhum'}
            </h4>
            <p className="text-[10px] text-rose-brand-800 font-semibold font-mono">
              Gasto total: Kz {crmStats.topSpender ? ((crmStats.topSpender as Customer).totalSpent).toLocaleString('pt-AO', { minimumFractionDigits: 2 }) : '0,00'}
            </p>
          </div>
        </div>
      </div>

      {/* CRM Main CRM Section split */}
      <div id="crm-split-container" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Customers Table (Takes 2 Cols) */}
        <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs lg:col-span-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-gray-900">Lista Geral de Clientes</h4>
              <p className="text-xs text-gray-500">Contatos e resumo financeiro do relacionamento</p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="search-customers-input"
                type="text"
                placeholder="Pesquisar cliente ou telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-rose-brand-50/20 border border-rose-brand-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-300 focus:bg-white transition-all"
              />
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div id="no-customers-state" className="text-center py-12 text-gray-400">
              <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm">Nenhum cliente cadastrado correspondente.</p>
            </div>
          ) : (
            <div id="customers-table-wrapper" className="overflow-x-auto rounded-xl border border-rose-brand-50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-rose-brand-50/30 text-rose-brand-900 font-semibold text-xs border-b border-rose-brand-50">
                    <th className="p-4 rounded-tl-xl">Cliente</th>
                    <th className="p-4 font-mono">Última Compra</th>
                    <th className="p-4 font-mono text-center">Compras</th>
                    <th className="p-4 font-mono text-right">Total Gasto</th>
                    <th className="p-4 text-center rounded-tr-xl">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-brand-50/30 text-xs">
                  {filteredCustomers.map((cust) => {
                    const isSelected = selectedCustomerPhone === cust.phone;
                    return (
                      <tr 
                        key={cust.id} 
                        className={`transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-rose-brand-50/40 hover:bg-rose-brand-50/60' 
                            : 'hover:bg-rose-brand-50/10'
                        }`}
                        onClick={() => setSelectedCustomerPhone(cust.phone)}
                      >
                        <td className="p-4">
                          <div className="font-bold text-gray-900">{cust.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-gray-300" />
                            <span>{cust.phone}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-500">
                          {cust.lastPurchaseDate ? (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-300" />
                              <span>{cust.lastPurchaseDate}</span>
                            </span>
                          ) : (
                            <span className="text-gray-300 italic">Sem registo</span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-center font-semibold text-gray-800">
                          {cust.purchaseCount}
                        </td>
                        <td className="p-4 font-mono text-right font-bold text-rose-brand-700 text-sm">
                          Kz {cust.totalSpent.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              id={`select-cust-history-${cust.id}`}
                              onClick={() => setSelectedCustomerPhone(cust.phone)}
                              className="text-rose-brand-600 hover:bg-rose-brand-50 p-1.5 rounded-lg transition-colors text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              title="Ver histórico de compras"
                            >
                              <span>Histórico</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <button
                              id={`delete-cust-${cust.id}`}
                              onClick={() => triggerDelete(cust.id)}
                              className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover cliente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Right Side: Detailed Purchase History ( CRM Panel - 1 Col) */}
        <div className="bg-white border border-rose-brand-50 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-rose-brand-50 mb-5">
              <h4 className="font-serif text-md font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-brand-600" />
                <span>Historial de Compras</span>
              </h4>
              {selectedCustomerPhone && (
                <button 
                  id="clear-selected-customer"
                  onClick={() => setSelectedCustomerPhone(null)} 
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedCustomerPhone ? (
              <div className="space-y-4">
                <div className="bg-rose-brand-50/50 p-3 rounded-xl border border-rose-brand-100/30">
                  <span className="text-[10px] uppercase text-gray-400 block font-bold">Cliente Selecionado</span>
                  <span className="text-sm font-serif font-bold text-rose-brand-950 block mt-0.5">{selectedCustomerName}</span>
                  <span className="text-xs text-gray-500 font-mono block mt-0.5">{selectedCustomerPhone}</span>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {customerPurchases.length === 0 ? (
                    <p className="text-xs text-gray-400 italic text-center py-6">Este cliente ainda não efetuou compras.</p>
                  ) : (
                    customerPurchases.map(sale => (
                      <div key={sale.id} className="bg-white border border-gray-100 p-3 rounded-xl shadow-2xs hover:border-rose-brand-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-gray-900 max-w-[140px] truncate block">{sale.productName}</span>
                          <span className="text-xs font-mono font-bold text-rose-brand-600">Kz {sale.revenue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2.5 text-[10px] text-gray-400">
                          <span className="font-mono">{sale.date}</span>
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm">Qtd: {sale.quantity}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-xs leading-relaxed max-w-[180px] mx-auto">Selecione um cliente na tabela para listar as suas faturas de presentes e datas.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 text-[10px] text-gray-400 flex gap-1.5 items-start">
            <TrendingUp className="w-4 h-4 text-rose-brand-400 shrink-0" />
            <span>O histórico é calculado cruzando os dados das faturas com o telefone do cliente no SQLite.</span>
          </div>
        </div>

      </div>

      {/* Manual Add Customer Modal */}
      {isAddModalOpen && (
        <div id="add-customer-modal" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <button
              id="close-add-cust-modal"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-gray-900">Cadastrar Perfil de Cliente</h3>
            <p className="text-xs text-gray-500 mt-1">Grave as informações de contacto para futuras vendas.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span>Nome Completo *</span>
                </label>
                <input
                  id="modal-cust-name"
                  type="text"
                  required
                  placeholder="Ex: Maria de Oliveira"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>Telemóvel / Telefone *</span>
                </label>
                <input
                  id="modal-cust-phone"
                  type="tel"
                  required
                  placeholder="Ex: +244 923 456 789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t border-gray-100 mt-6">
                <button
                  id="modal-cancel-cust"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="modal-save-cust"
                  type="submit"
                  className="flex-1 bg-rose-brand-600 hover:bg-rose-brand-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div id="delete-cust-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <h3 className="font-serif text-lg font-bold text-gray-900 text-center">Remover Cliente?</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Deseja realmente deletar este perfil de cliente? Isso não removerá suas faturas passadas do histórico de vendas, mas apagará seu cadastro no CRM.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="delete-cust-cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="delete-cust-confirm"
                onClick={handleConfirmDelete}
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
