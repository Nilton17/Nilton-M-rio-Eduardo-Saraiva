/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Sale, Customer, Order, SalesGoal } from '../types';

// Seed data definitions
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Buquê de Rosas Premium Elegance',
    price: 45000.00,
    category: 'Buquês de Flores',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p2',
    name: 'Buquê de Dinheiro Clássico Maelina',
    price: 35000.00,
    category: 'Buquês de Dinheiro',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p3',
    name: 'Cesta Maelina de Chocolates & Mimos',
    price: 80000.00,
    category: 'Cestas de Doces',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p4',
    name: 'Buquê de Girassóis Luz Solar',
    price: 25000.00,
    category: 'Buquês de Flores',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p5',
    name: 'Urso de Pelúcia Gigante & Doces',
    price: 30000.00,
    category: 'Mimos & Presentes',
    image: 'https://images.unsplash.com/photo-1559459520-218fca64ca39?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 'p6',
    name: 'Mini Buquê Especial Lavanda',
    price: 18000.00,
    category: 'Buquês de Flores',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500',
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Maria Pemba',
    phone: '+244 912 345 678',
    totalSpent: 125000.00,
    purchaseCount: 3,
    lastPurchaseDate: '2026-06-30',
  },
  {
    id: 'c2',
    name: 'João Manuel',
    phone: '+244 923 456 789',
    totalSpent: 80000.00,
    purchaseCount: 1,
    lastPurchaseDate: '2026-06-24',
  },
  {
    id: 'c3',
    name: 'Ana Cassule',
    phone: '+244 934 567 890',
    totalSpent: 25000.00,
    purchaseCount: 1,
    lastPurchaseDate: '2026-06-29',
  },
  {
    id: 'c4',
    name: 'Carlos Chipenda',
    phone: '+244 965 432 109',
    totalSpent: 0,
    purchaseCount: 0,
    lastPurchaseDate: '',
  }
];

// Let's create sales. Keep in mind:
// Gross profit = revenue - materialCost
// Reserve = 10% * Gross profit
// Net profit = Gross profit - Reserve
const INITIAL_SALES: Sale[] = [
  {
    id: 's1',
    productId: 'p1',
    productName: 'Buquê de Rosas Premium Elegance',
    clientName: 'Maria Pemba',
    clientPhone: '+244 912 345 678',
    date: '2026-06-15',
    quantity: 1,
    materialCost: 15000.00,
    revenue: 45000.00,
    grossProfit: 30000.00,
    reserve: 3000.00,
    netProfit: 27000.00,
  },
  {
    id: 's2',
    productId: 'p3',
    productName: 'Cesta Maelina de Chocolates & Mimos',
    clientName: 'João Manuel',
    clientPhone: '+244 923 456 789',
    date: '2026-06-24',
    quantity: 1,
    materialCost: 35000.00,
    revenue: 80000.00,
    grossProfit: 45000.00,
    reserve: 4500.00,
    netProfit: 40500.00,
  },
  {
    id: 's3',
    productId: 'p2',
    productName: 'Buquê de Dinheiro Clássico Maelina',
    clientName: 'Maria Pemba',
    clientPhone: '+244 912 345 678',
    date: '2026-06-28',
    quantity: 1,
    materialCost: 12000.00,
    revenue: 35000.00,
    grossProfit: 23000.00,
    reserve: 2300.00,
    netProfit: 20700.00,
  },
  {
    id: 's4',
    productId: 'p4',
    productName: 'Buquê de Girassóis Luz Solar',
    clientName: 'Ana Cassule',
    clientPhone: '+244 934 567 890',
    date: '2026-06-29',
    quantity: 1,
    materialCost: 8500.00,
    revenue: 25000.00,
    grossProfit: 16500.00,
    reserve: 1650.00,
    netProfit: 14850.00,
  },
  {
    id: 's5',
    productId: 'p1',
    productName: 'Buquê de Rosas Premium Elegance',
    clientName: 'Maria Pemba',
    clientPhone: '+244 912 345 678',
    date: '2026-06-30', // Hoje no fuso do servidor
    quantity: 1,
    materialCost: 15000.00,
    revenue: 45000.00,
    grossProfit: 30000.00,
    reserve: 3000.00,
    netProfit: 27000.00,
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'o1',
    clientName: 'Maria Pemba',
    clientPhone: '+244 912 345 678',
    productName: 'Buquê de Rosas Premium Elegance',
    productId: 'p1',
    value: 45000.00,
    deliveryDate: '2026-07-02',
    status: 'Pendente',
    notes: 'Entregar no condomínio Jasmim em Talatona. Deseja cartão escrito à mão com mensagem romântica.',
  },
  {
    id: 'o2',
    clientName: 'Carlos Chipenda',
    clientPhone: '+244 965 432 109',
    productName: 'Cesta Maelina de Chocolates & Mimos',
    productId: 'p3',
    value: 80000.00,
    deliveryDate: '2026-07-03',
    status: 'Em produção',
    notes: 'Colocar laço dourado em vez de vermelho. Entregar na Maianga.',
  },
  {
    id: 'o3',
    clientName: 'João Manuel',
    clientPhone: '+244 923 456 789',
    productName: 'Mini Buquê Especial Lavanda',
    productId: 'p6',
    value: 18000.00,
    deliveryDate: '2026-06-25',
    status: 'Entregue',
    notes: 'Entregar na recepção do escritório em Luanda (Miramar).',
  }
];

const INITIAL_GOALS: SalesGoal[] = [
  {
    id: 'g1',
    month: '2026-05',
    target: 500000.00,
    achieved: 600000.00,
  },
  {
    id: 'g2',
    month: '2026-06',
    target: 300000.00,
    achieved: 230000.00, // Calculado a partir das vendas de Junho
  }
];

const STORAGE_KEYS = {
  PRODUCTS: 'maelina_products',
  SALES: 'maelina_sales',
  CUSTOMERS: 'maelina_customers',
  ORDERS: 'maelina_orders',
  GOALS: 'maelina_goals',
};

export class StorageService {
  // Check if data exists in localStorage; otherwise initialize with seed data
  static init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    }
  }

  // Getters
  static getProducts(): Product[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  }

  static getSales(): Sale[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    return data ? JSON.parse(data) : [];
  }

  static getCustomers(): Customer[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  static getOrders(): Order[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static getGoals(): SalesGoal[] {
    this.init();
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  }

  // Setters/Update Helpers
  static saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static saveSales(sales: Sale[]) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    // Trigger customer stats recalculation whenever sales are saved
    this.recalculateCustomerStats(sales);
    // Trigger goal recalculation
    this.recalculateGoalAchieved(sales);
  }

  static saveCustomers(customers: Customer[]) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  static saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static saveGoals(goals: SalesGoal[]) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  // Auto Calculations & Recalculations
  private static recalculateCustomerStats(sales: Sale[]) {
    const customers = this.getCustomers();
    
    // Map phone numbers to custom stats
    const statsMap: Record<string, { totalSpent: number; purchaseCount: number; lastPurchaseDate: string }> = {};
    
    sales.forEach(sale => {
      const key = sale.clientPhone.trim();
      if (!statsMap[key]) {
        statsMap[key] = {
          totalSpent: 0,
          purchaseCount: 0,
          lastPurchaseDate: '',
        };
      }
      statsMap[key].totalSpent += sale.revenue;
      statsMap[key].purchaseCount += 1;
      
      if (!statsMap[key].lastPurchaseDate || sale.date > statsMap[key].lastPurchaseDate) {
        statsMap[key].lastPurchaseDate = sale.date;
      }
    });

    // Update existing customers or auto-create missing customers
    const updatedCustomers = customers.map(cust => {
      const stats = statsMap[cust.phone.trim()];
      if (stats) {
        return {
          ...cust,
          totalSpent: parseFloat(stats.totalSpent.toFixed(2)),
          purchaseCount: stats.purchaseCount,
          lastPurchaseDate: stats.lastPurchaseDate,
        };
      }
      return {
        ...cust,
        totalSpent: 0,
        purchaseCount: 0,
        lastPurchaseDate: '',
      };
    });

    // See if any sale belongs to a client name/phone not in customers list
    sales.forEach(sale => {
      const phoneExists = updatedCustomers.some(c => c.phone.trim() === sale.clientPhone.trim());
      if (!phoneExists && sale.clientPhone.trim()) {
        const stats = statsMap[sale.clientPhone.trim()];
        updatedCustomers.push({
          id: 'c_auto_' + Math.random().toString(36).substr(2, 9),
          name: sale.clientName,
          phone: sale.clientPhone,
          totalSpent: parseFloat(stats.totalSpent.toFixed(2)),
          purchaseCount: stats.purchaseCount,
          lastPurchaseDate: stats.lastPurchaseDate,
        });
      }
    });

    this.saveCustomers(updatedCustomers);
  }

  private static recalculateGoalAchieved(sales: Sale[]) {
    const goals = this.getGoals();
    
    const goalsByMonth: Record<string, number> = {};
    sales.forEach(sale => {
      const monthKey = sale.date.substring(0, 7); // "YYYY-MM"
      goalsByMonth[monthKey] = (goalsByMonth[monthKey] || 0) + sale.revenue;
    });

    const updatedGoals = goals.map(goal => {
      const achieved = goalsByMonth[goal.month] || 0;
      return {
        ...goal,
        achieved: parseFloat(achieved.toFixed(2)),
      };
    });

    this.saveGoals(updatedGoals);
  }

  // Backup and Recovery System
  static exportDataAsJSON(): string {
    const database = {
      products: this.getProducts(),
      sales: this.getSales(),
      customers: this.getCustomers(),
      orders: this.getOrders(),
      goals: this.getGoals(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(database, null, 2);
  }

  static importDataFromJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.products && data.sales && data.customers && data.orders && data.goals) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(data.sales));
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(data.customers));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Falha ao importar backup', e);
      return false;
    }
  }

  static resetToDefaultSeedData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
  }
}
