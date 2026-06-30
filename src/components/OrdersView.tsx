/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CalendarClock, 
  Search, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  XCircle, 
  Calendar,
  DollarSign,
  User,
  Phone,
  MessageSquare,
  ChevronRight,
  Filter,
  Sparkles,
  Award
} from 'lucide-react';
import { Order, Product, Customer } from '../types';

interface OrdersViewProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
}

const STATUS_OPTIONS: Order['status'][] = ['Pendente', 'Em produção', 'Entregue', 'Cancelada'];

export default function OrdersView({
  orders,
  products,
  customers,
  onAddOrder,
  onUpdateOrderStatus,
  onDeleteOrder
}: OrdersViewProps) {
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);

  // Add Order Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [productId, setProductId] = useState('');
  const [value, setValue] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-07-01'); // Relative to REF_DATE
  const [notes, setNotes] = useState('');

  // Auto-fill price from product
  const handleProductChange = (id: string) => {
    setProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setValue(prod.price.toString());
    }
  };

  // Auto-fill client phone from CRM selection
  const handleClientNameChange = (name: string) => {
    setClientName(name);
    const cust = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (cust) {
      setClientPhone(cust.phone);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    // Sort orders by delivery date (earliest delivery date first)
    const sorted = [...orders].sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));
    
    return sorted.filter(o => {
      const matchesSearch = o.clientName.toLowerCase().includes(search.toLowerCase()) || 
                            o.productName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Submit Add Order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !productId || !value || !deliveryDate) return;

    const prod = products.find(p => p.id === productId);
    const prodName = prod ? prod.name : 'Presente Personalizado';

    onAddOrder({
      clientName,
      clientPhone,
      productName: prodName,
      productId,
      value: parseFloat(value) || 0,
      deliveryDate,
      status: 'Pendente',
      notes
    });

    // Reset Form
    setClientName('');
    setClientPhone('');
    setProductId('');
    setValue('');
    setDeliveryDate('2026-07-01');
    setNotes('');
    setIsAddModalOpen(false);
  };

  // Delete Order Trigger
  const triggerDelete = (id: string) => {
    setOrderIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderIdToDelete) {
      onDeleteOrder(orderIdToDelete);
    }
    setIsDeleteConfirmOpen(false);
    setOrderIdToDelete(null);
  };

  // Style helper for Status badges
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Pendente':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Em produção':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Entregue':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelada':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  // Icon helper for Status
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pendente':
        return <Clock className="w-3.5 h-3.5 shrink-0" />;
      case 'Em produção':
        return <Wrench className="w-3.5 h-3.5 shrink-0" />;
      case 'Entregue':
        return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
      case 'Cancelada':
        return <XCircle className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <div id="orders-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Encomendas Programadas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Controle e rastreie o estado das encomendas de mimos, cestas e buquês com datas de entrega futuras.
          </p>
        </div>
        <button
          id="btn-add-order-trigger"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Encomenda</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white border border-rose-brand-50 p-4 rounded-2xl shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-orders-input"
            type="text"
            placeholder="Pesquisar encomenda por cliente ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-rose-brand-50/20 border border-rose-brand-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-300 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </div>
          {['Todos', ...STATUS_OPTIONS].map((status) => (
            <button
              id={`filter-order-status-${status}`}
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-rose-brand-600 text-white'
                  : 'bg-rose-brand-50/30 text-gray-600 hover:bg-rose-brand-100/50 hover:text-rose-brand-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Order Cards */}
      {filteredOrders.length === 0 ? (
        <div id="no-orders-state" className="bg-white border border-rose-brand-50 rounded-2xl py-16 px-4 text-center max-w-md mx-auto">
          <div className="bg-rose-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-rose-brand-500 mb-4">
            <CalendarClock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-serif">Nenhuma encomenda ativa</h3>
          <p className="text-sm text-gray-500 mt-2">
            Não encontramos encomendas registadas no estado "{statusFilter}".
          </p>
          <button
            id="btn-add-order-empty"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 bg-rose-brand-600 text-white font-medium text-xs px-4 py-2 rounded-xl hover:bg-rose-brand-700 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Encomenda</span>
          </button>
        </div>
      ) : (
        <div id="orders-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              id={`order-card-${order.id}`}
              key={order.id}
              className="bg-white border border-rose-brand-100/50 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Upper row: Client name and Status Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-rose-brand-50/50 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-gray-950 text-base flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{order.clientName}</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{order.clientPhone}</p>
                  </div>
                  <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                {/* Main body info */}
                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Arranjo pedido:</span>
                    <span className="text-gray-800">{order.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Data de Entrega:</span>
                    <span className="text-rose-brand-700 font-mono font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{order.deliveryDate}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Valor Pago / A pagar:</span>
                    <span className="font-mono font-bold text-sage-brand-600 text-sm">
                      Kz {order.value.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  {order.notes && (
                    <div className="mt-3.5 p-3 bg-rose-brand-50/20 rounded-xl border border-rose-brand-50">
                      <p className="text-[10px] font-bold text-rose-brand-800 uppercase tracking-widest flex items-center gap-1 mb-1">
                        <MessageSquare className="w-3 h-3 text-rose-brand-400" />
                        <span>Observações</span>
                      </p>
                      <p className="text-[10px] text-gray-500 italic leading-relaxed">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status workflow transitions / Card actions */}
              <div className="mt-5 pt-4 border-t border-rose-brand-50/50 flex flex-col sm:flex-row items-center gap-3">
                
                {/* State selector dropdown */}
                <div className="w-full sm:flex-1 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Estado:</span>
                  <select
                    id={`update-status-select-${order.id}`}
                    value={order.status}
                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="flex-1 bg-rose-brand-50/50 hover:bg-rose-brand-100/50 px-2 py-1 text-[11px] font-semibold text-rose-brand-900 border border-rose-brand-100 rounded-lg focus:outline-hidden"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Cancel or Delete icon */}
                <button
                  id={`delete-order-${order.id}`}
                  onClick={() => triggerDelete(order.id)}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                  title="Excluir encomenda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Order Modal */}
      {isAddModalOpen && (
        <div id="order-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            <button
              id="close-order-modal"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-gray-900">Programar Nova Encomenda</h3>
            <p className="text-xs text-gray-500 mt-1">Registe os detalhes de entrega e itens encomendados.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Product */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mimo / Buquê Solicitado *
                </label>
                <select
                  id="modal-order-product"
                  required
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent bg-white"
                >
                  <option value="">-- Selecione o produto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Ref: Kz {p.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })})</option>
                  ))}
                </select>
              </div>

              {/* Client Auto Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span>Nome Cliente *</span>
                  </label>
                  <input
                    id="modal-order-client-name"
                    type="text"
                    required
                    list="order-clients-list"
                    placeholder="Ex: Maria de Oliveira"
                    value={clientName}
                    onChange={(e) => handleClientNameChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400"
                  />
                  <datalist id="order-clients-list">
                    {customers.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>Telefone *</span>
                  </label>
                  <input
                    id="modal-order-client-phone"
                    type="tel"
                    required
                    placeholder="+244 ..."
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
                  />
                </div>
              </div>

              {/* Delivery Date & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>Entrega Agendada *</span>
                  </label>
                  <input
                    id="modal-order-delivery-date"
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Valor Cobrado (Kz) *
                  </label>
                  <input
                    id="modal-order-value"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Observações de Entrega
                </label>
                <textarea
                  id="modal-order-notes"
                  rows={2}
                  placeholder="Ex: Entregar com bilhete escrito 'Parabéns!'."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-100 mt-6">
                <button
                  id="modal-order-cancel"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="modal-order-save"
                  type="submit"
                  className="flex-1 bg-rose-brand-600 hover:bg-rose-brand-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Agendar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div id="delete-order-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <h3 className="font-serif text-lg font-bold text-gray-900 text-center">Excluir Encomenda?</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Deseja realmente remover esta encomenda dos registos offline?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="delete-order-cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Manter
              </button>
              <button
                id="delete-order-confirm"
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
