/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number; // Preço de venda
  category: string;
  image: string; // URL da imagem do produto
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  clientName: string;
  clientPhone: string;
  date: string; // Formato YYYY-MM-DD
  quantity: number;
  materialCost: number; // Custo de materiais
  revenue: number; // Preço * Quantidade
  grossProfit: number; // Receita - Custo de materiais
  reserve: number; // 10% do Lucro Bruto
  netProfit: number; // Lucro Bruto - Reserva
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseDate: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  productName: string;
  productId: string;
  value: number; // Valor da encomenda
  deliveryDate: string; // Data de entrega (YYYY-MM-DD)
  status: 'Pendente' | 'Em produção' | 'Entregue' | 'Cancelada';
  notes: string;
}

export interface SalesGoal {
  id: string;
  month: string; // Formato YYYY-MM
  target: number; // Meta em Kz
  achieved: number; // Valor alcançado
}
