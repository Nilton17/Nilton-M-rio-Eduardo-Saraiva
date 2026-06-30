/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  CloudLightning, 
  CheckCircle, 
  AlertTriangle,
  FileCode,
  Info,
  Server,
  Terminal,
  Flower2
} from 'lucide-react';
import { StorageService } from '../db/storage';

interface SettingsViewProps {
  onRefreshData: () => void;
}

export default function SettingsView({ onRefreshData }: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger export of backup
  const handleExport = () => {
    try {
      const dataStr = StorageService.exportDataAsJSON();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `maelina_gift_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      showSuccess('Backup exportado com sucesso! Arquivo guardado.');
    } catch (e) {
      showError('Falha ao exportar backup.');
    }
  };

  // Trigger file selection for import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Process selected file for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const success = StorageService.importDataFromJSON(jsonContent);
        if (success) {
          showSuccess('Backup recuperado e restaurado com sucesso! Base de dados SQLite atualizada.');
          onRefreshData(); // callback to app shell to update state
        } else {
          showError('Arquivo inválido. Formato de backup Maelina Gift não reconhecido.');
        }
      } catch (err) {
        showError('Falha ao ler o arquivo de backup.');
      }
    };
    reader.readAsText(file);
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset database to initial seeds
  const handleReset = () => {
    if (window.confirm('Aviso: Isso apagará todas as vendas lançadas e restaurará o catálogo padrão de buquês e mimos. Deseja continuar?')) {
      StorageService.resetToDefaultSeedData();
      showSuccess('Base de dados restaurada para o estado inicial de fábrica.');
      onRefreshData(); // callback to app shell to update state
    }
  };

  // Notifications Helpers
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div id="settings-view-wrapper" className="space-y-6 animate-fade-in pb-12">
      {/* Header title */}
      <div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Configurações & Backup</h2>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie a persistência offline da sua base de dados SQLite simulada e prepare os dados para sincronização futura.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div id="settings-success-alert" className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm animate-scale-up">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div id="settings-error-alert" className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center gap-2 text-sm animate-scale-up">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Database Backup & Control Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card: Export & Import backup */}
        <div className="bg-white border border-rose-brand-100 p-6 rounded-2xl shadow-xs">
          <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-rose-brand-600" />
            <span>Cópia de Segurança & Restauro</span>
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Grave backups regulares em JSON de todos os seus produtos, vendas registadas e perfis de clientes offline.
          </p>

          <div className="space-y-4">
            {/* Export Button */}
            <button
              id="btn-backup-export"
              onClick={handleExport}
              className="w-full bg-rose-brand-50 hover:bg-rose-brand-100 border border-rose-brand-200 text-rose-brand-800 font-semibold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4.5 h-4.5" />
              <span>Exportar Backup Local (.json)</span>
            </button>

            {/* Import Button */}
            <button
              id="btn-backup-import"
              onClick={handleImportClick}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4.5 h-4.5" />
              <span>Importar / Restaurar Backup</span>
            </button>
            
            {/* Hidden file selector */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Card: Factory reset & maintenance */}
        <div className="bg-white border border-rose-brand-50 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-500" />
              <span>Manutenção do Sistema</span>
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Restaure a base de dados para o estado de demonstração pré-carregada ou limpe os registos de teste.
            </p>
          </div>

          <div className="space-y-4">
            <button
              id="btn-db-reset"
              onClick={handleReset}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
              <span>Limpar e Restaurar Catálogo Padrão</span>
            </button>
          </div>
        </div>

      </div>

      {/* Corporate Technical Architecture Display Card */}
      <div className="bg-white border border-rose-brand-50 p-6 rounded-2xl shadow-xs">
        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <CloudLightning className="w-5 h-5 text-gold-brand-600" />
          <span>Arquitetura de Dados & Sincronização Futura</span>
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          A aplicação Maelina Gift foi desenvolvida respeitando padrões modernos de engenharia offline-first e persistência local estável.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          
          {/* Column 1 */}
          <div className="bg-rose-brand-50/20 p-4 rounded-xl border border-rose-brand-50">
            <div className="flex items-center gap-2 text-rose-brand-900 font-bold uppercase tracking-wider text-[10px] mb-2">
              <Database className="w-4 h-4 text-rose-brand-600" />
              <span>Persistência Local</span>
            </div>
            <p className="text-gray-600">
              Usa drivers relacionais virtuais com redundância em tabelas chave-valor indexadas no dispositivo (LocalStorage / IndexedDB). Os dados persistem mesmo ao fechar a janela.
            </p>
          </div>

          {/* Column 2 */}
          <div className="bg-gold-brand-50/30 p-4 rounded-xl border border-gold-brand-100/30">
            <div className="flex items-center gap-2 text-gold-brand-800 font-bold uppercase tracking-wider text-[10px] mb-2">
              <Server className="w-4 h-4 text-gold-brand-600" />
              <span>Pronto para Nuvem</span>
            </div>
            <p className="text-gray-600">
              A modelagem de dados herda a estrutura estrita de chave primária id/uuid, o que permite sincronização futura bidirecional perfeita com bases em nuvem (Firestore, PostgreSQL ou SQLite Remoto).
            </p>
          </div>

          {/* Column 3 */}
          <div className="bg-sage-brand-50/30 p-4 rounded-xl border border-sage-brand-100/30">
            <div className="flex items-center gap-2 text-sage-brand-800 font-bold uppercase tracking-wider text-[10px] mb-2">
              <Terminal className="w-4 h-4 text-sage-brand-600" />
              <span>Zero Dependências Externas</span>
            </div>
            <p className="text-gray-600">
              Funciona 100% offline em feiras, mercados ou eventos de vendas sem conexão de internet ativa. Seguro contra falhas de rede externa e lentidão.
            </p>
          </div>

        </div>
        
        {/* Brand visual watermark */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-rose-brand-600" />
            <span className="font-serif font-bold text-rose-brand-950 text-sm">Maelina Gift Inc.</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Build: Stable Release 1.0.0-web</span>
        </div>
      </div>

    </div>
  );
}
