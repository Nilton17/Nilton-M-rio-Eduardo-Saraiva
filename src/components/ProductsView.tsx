/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  X, 
  DollarSign, 
  Sparkles,
  ShoppingBag,
  PlusCircle,
  Tag
} from 'lucide-react';
import { Product } from '../types';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

// Beautiful stock images representing typical floral/gift items
const SAMPLE_FLOWER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500', name: 'Buquê de Flores' },
  { url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=500', name: 'Buquê de Dinheiro' },
  { url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=500', name: 'Cesta de Doces' },
  { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=500', name: 'Mimos & Presentes' },
  { url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=500', name: 'Girassóis' },
  { url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500', name: 'Mimos Finos' },
  { url: 'https://images.unsplash.com/photo-1559459520-218fca64ca39?auto=format&fit=crop&q=80&w=500', name: 'Urso & Chocolates' },
  { url: 'https://images.unsplash.com/photo-1533604148573-d162d4ee9d7f?auto=format&fit=crop&q=80&w=500', name: 'Arranjo Silvestre' }
];

const CATEGORIES = [
  'Todos',
  'Buquês de Dinheiro',
  'Buquês de Flores',
  'Cestas de Doces',
  'Mimos & Presentes',
];

export default function ProductsView({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}: ProductsViewProps) {
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Buquês de Dinheiro');
  const [image, setImage] = useState('');

  // Delete Confirmation dialog state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // Open Add Modal
  const openAddModal = () => {
    setName('');
    setPrice('');
    setCategory('Buquês de Dinheiro');
    setImage(SAMPLE_FLOWER_IMAGES[0].url); // pre-select first stock image
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImage(product.image);
    setIsEditModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    onAddProduct({
      name,
      price: parseFloat(price) || 0,
      category,
      image: image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500'
    });
    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || !name || !price) return;
    onEditProduct({
      id: currentProduct.id,
      name,
      price: parseFloat(price) || 0,
      category,
      image: image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=500'
    });
    setIsEditModalOpen(false);
  };

  // Trigger Delete
  const triggerDelete = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (productIdToDelete) {
      onDeleteProduct(productIdToDelete);
    }
    setIsDeleteConfirmOpen(false);
    setProductIdToDelete(null);
  };

  return (
    <div id="products-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Catálogo de Produtos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gira os seus buquês de dinheiro, flores, cestas de doces e mimos com preços e categorias personalizadas.
          </p>
        </div>
        <button
          id="btn-add-product"
          onClick={openAddModal}
          className="bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-rose-brand-50 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-products-input"
            type="text"
            placeholder="Pesquisar produto ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-rose-brand-50/20 border border-rose-brand-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-300 focus:bg-white transition-all"
          />
        </div>

        {/* Categories Carousel / Tabs */}
        <div id="categories-tabs" className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              id={`filter-cat-${cat}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-brand-600 text-white shadow-xs'
                  : 'bg-rose-brand-50/30 text-gray-600 hover:bg-rose-brand-100/50 hover:text-rose-brand-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div id="no-products-state" className="bg-white border border-rose-brand-50 rounded-2xl py-16 px-4 text-center max-w-md mx-auto">
          <div className="bg-rose-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-rose-brand-500 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-serif">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-500 mt-2">
            Não encontramos produtos correspondentes ao filtro "{selectedCategory}" ou termo de busca "{search}".
          </p>
          <button
            id="btn-add-product-empty"
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 bg-rose-brand-600 text-white font-medium text-xs px-4 py-2 rounded-xl hover:bg-rose-brand-700 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Novo Produto</span>
          </button>
        </div>
      ) : (
        <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              id={`product-card-${product.id}`}
              key={product.id}
              className="bg-white border border-rose-brand-100/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Product Image Wrapper */}
              <div className="relative aspect-video sm:aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-xs text-rose-brand-800 border border-rose-brand-100/50 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-gray-900 text-base leading-snug group-hover:text-rose-brand-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-lg font-bold text-sage-brand-600 font-mono">
                      Kz {product.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-gray-400">Preço venda</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-rose-brand-50">
                  <button
                    id={`edit-product-${product.id}`}
                    onClick={() => openEditModal(product)}
                    className="flex-1 bg-rose-brand-50 hover:bg-rose-brand-100 text-rose-brand-700 py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    id={`delete-product-${product.id}`}
                    onClick={() => triggerDelete(product.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                    title="Remover produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modals */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div id="product-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-scale-up my-8">
            <button
              id="close-product-modal"
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-gray-900 pr-8">
              {isAddModalOpen ? 'Adicionar Novo Produto' : 'Editar Produto'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isAddModalOpen 
                ? 'Insira as informações do novo item para o seu catálogo.' 
                : 'Atualize os dados e preço do seu produto no catálogo.'}
            </p>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nome do Produto *
                </label>
                <input
                  id="modal-product-name"
                  type="text"
                  required
                  placeholder="Ex: Buquê de Girassóis Elegante"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent"
                />
              </div>

              {/* Price & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Preço de Venda (Kz) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">Kz</span>
                    <input
                      id="modal-product-price"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-7 pr-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Categoria
                  </label>
                  <select
                    id="modal-product-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Image URL Selector with suggestions */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Imagem do Produto (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    id="modal-product-image"
                    type="url"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full flex-1 px-3.5 py-2 text-sm border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-brand-400 focus:border-transparent font-mono"
                  />
                </div>
                
                {/* Visual Suggestions */}
                <div className="mt-3">
                  <span className="text-[10px] text-gray-500 font-semibold block mb-1.5">Sugestões de fotos em alta resolução (1-Clique):</span>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_FLOWER_IMAGES.map((sample) => (
                      <button
                        id={`suggested-img-${sample.name.replace(/\s+/g, '-')}`}
                        type="button"
                        key={sample.name}
                        onClick={() => setImage(sample.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          image === sample.url ? 'border-rose-brand-500 ring-2 ring-rose-brand-200' : 'border-transparent opacity-80 hover:opacity-100'
                        }`}
                        title={sample.name}
                      >
                        <img 
                          src={sample.url} 
                          alt={sample.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/40 py-0.5 text-center">
                          <span className="text-[7px] text-white font-semibold truncate block px-0.5">{sample.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  id="modal-cancel-product"
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="modal-save-product"
                  type="submit"
                  className="flex-1 bg-rose-brand-600 hover:bg-rose-brand-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAddModalOpen ? 'Adicionar' : 'Salvar Alterações'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div id="delete-modal-backdrop" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-rose-brand-100 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <h3 className="font-serif text-lg font-bold text-gray-900 text-center">Eliminar Produto?</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Tem certeza que deseja remover este produto do catálogo? Esta ação é irreversível e removerá o produto da listagem.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                id="delete-cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="delete-confirm"
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
