import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ListPlus, Plus, X, Users, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Transaction, Client, RecurringExpense } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SummaryDashboard } from './components/SummaryDashboard';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { CalendarView } from './components/CalendarView';
import { RecurringExpenseForm } from './components/RecurringExpenseForm';
import { RecurringExpenseList } from './components/RecurringExpenseList';
import { cn } from './lib/utils';

import { sheetService } from './services/sheetService';

type Tab = 'summary' | 'transactions' | 'clients' | 'calendar' | 'fixed-costs';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [isSyncing, setIsSyncing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('businessflow-transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('businessflow-clients');
    return saved ? JSON.parse(saved) : [];
  });
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => {
    const saved = localStorage.getItem('businessflow-recurring-expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'transaction' | 'client' | 'expense', data: any } | null>(null);

  useEffect(() => {
    localStorage.setItem('businessflow-transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('businessflow-clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('businessflow-recurring-expenses', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
    setIsFormOpen(false);

    // Sync to SheetDB
    setIsSyncing(true);
    await sheetService.postTransaction(transaction);
    setIsSyncing(false);
  };

  const updateTransaction = async (id: string, updatedData: Omit<Transaction, 'id'>) => {
    const updatedTransaction = { ...updatedData, id };
    setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    setIsFormOpen(false);
    setEditingItem(null);

    setIsSyncing(true);
    await sheetService.updateTransaction(id, updatedTransaction);
    setIsSyncing(false);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    setIsSyncing(true);
    await sheetService.deleteTransaction(id);
    setIsSyncing(false);
  };

  const addClient = async (newClient: Omit<Client, 'id'>) => {
    const client: Client = {
      ...newClient,
      id: crypto.randomUUID(),
    };
    setClients(prev => [...prev, client]);
    setIsFormOpen(false);

    // Sync to SheetDB
    setIsSyncing(true);
    await sheetService.postClient(client);
    setIsSyncing(false);
  };

  const updateClient = async (id: string, updatedData: Omit<Client, 'id'>) => {
    const updatedClient = { ...updatedData, id };
    setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
    setIsFormOpen(false);
    setEditingItem(null);

    setIsSyncing(true);
    await sheetService.updateClient(id, updatedClient);
    setIsSyncing(false);
  };

  const deleteClient = async (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    
    setIsSyncing(true);
    await sheetService.deleteClient(id);
    setIsSyncing(false);
  };

  const toggleClientStatus = (id: string) => {
    setClients(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
    ));
  };

  const addRecurringExpense = async (newExpense: Omit<RecurringExpense, 'id'>) => {
    const expense: RecurringExpense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setRecurringExpenses(prev => [...prev, expense]);
    setIsFormOpen(false);

    // Sync to SheetDB
    setIsSyncing(true);
    await sheetService.postRecurringExpense(expense);
    setIsSyncing(false);
  };

  const updateRecurringExpense = async (id: string, updatedData: Omit<RecurringExpense, 'id'>) => {
    const updatedExpense = { ...updatedData, id };
    setRecurringExpenses(prev => prev.map(e => e.id === id ? updatedExpense : e));
    setIsFormOpen(false);
    setEditingItem(null);

    setIsSyncing(true);
    await sheetService.updateRecurringExpense(id, updatedExpense);
    setIsSyncing(false);
  };

  const deleteRecurringExpense = async (id: string) => {
    setRecurringExpenses(prev => prev.filter(e => e.id !== id));
    
    setIsSyncing(true);
    await sheetService.deleteRecurringExpense(id);
    setIsSyncing(false);
  };

  const toggleRecurringExpenseStatus = (id: string) => {
    setRecurringExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
    ));
  };

  const handleEdit = (type: 'transaction' | 'client' | 'expense', data: any) => {
    setEditingItem({ type, data });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-zinc-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutGrid size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">BusinessFlow</h1>
                {isSyncing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-zinc-100 rounded-full border border-zinc-200"
                  >
                    <RefreshCw size={10} className="animate-spin text-zinc-500" />
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Sincronizando...</span>
                  </motion.div>
                )}
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gestão Empresarial</p>
            </div>
          </div>

          <nav className="flex bg-zinc-100 p-1 rounded-xl overflow-x-auto max-w-[60%] sm:max-w-none no-scrollbar">
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'summary' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Resumo</span>
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'transactions' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <ListPlus size={16} />
              <span className="hidden sm:inline">Transações</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'calendar' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <CalendarIcon size={16} />
              <span className="hidden sm:inline">Calendário</span>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'clients' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <Users size={16} />
              <span className="hidden sm:inline">Clientes</span>
            </button>
            <button
              onClick={() => setActiveTab('fixed-costs')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'fixed-costs' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Custos Fixos</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'summary' ? (
              <SummaryDashboard transactions={transactions} clients={clients} recurringExpenses={recurringExpenses} />
            ) : activeTab === 'transactions' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-zinc-900">Histórico</h2>
                  <p className="text-sm text-zinc-500 font-medium">{transactions.length} transações</p>
                </div>
                <TransactionList 
                  transactions={transactions} 
                  onDelete={deleteTransaction} 
                  onEdit={(t) => handleEdit('transaction', t)}
                />
              </div>
            ) : activeTab === 'calendar' ? (
              <CalendarView transactions={transactions} />
            ) : activeTab === 'clients' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-zinc-900">Carteira de Clientes</h2>
                  <p className="text-sm text-zinc-500 font-medium">{clients.length} clientes</p>
                </div>
                <ClientList 
                  clients={clients} 
                  onDelete={deleteClient} 
                  onToggleStatus={toggleClientStatus} 
                  onEdit={(c) => handleEdit('client', c)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-zinc-900">Custos Fixos</h2>
                  <p className="text-sm text-zinc-500 font-medium">{recurringExpenses.length} custos cadastrados</p>
                </div>
                <RecurringExpenseList 
                  expenses={recurringExpenses} 
                  onDelete={deleteRecurringExpense} 
                  onToggleStatus={toggleRecurringExpenseStatus} 
                  onEdit={(e) => handleEdit('expense', e)}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-zinc-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <Plus size={32} />
      </button>

      {/* Modal for Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4 text-white">
                <h3 className="text-xl font-bold">
                  {editingItem ? (
                    editingItem.type === 'client' ? 'Editar Cliente' :
                    editingItem.type === 'expense' ? 'Editar Custo Fixo' : 'Editar Transação'
                  ) : (
                    activeTab === 'clients' ? 'Novo Cliente' : 
                    activeTab === 'fixed-costs' ? 'Novo Custo Fixo' : 'Nova Transação'
                  )}
                </h3>
                <button 
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {editingItem ? (
                editingItem.type === 'client' ? (
                  <ClientForm 
                    onAdd={addClient} 
                    onUpdate={updateClient}
                    initialData={editingItem.data}
                    onCancel={handleCloseForm} 
                  />
                ) : editingItem.type === 'expense' ? (
                  <RecurringExpenseForm 
                    onAdd={addRecurringExpense} 
                    onUpdate={updateRecurringExpense}
                    initialData={editingItem.data}
                    onCancel={handleCloseForm} 
                  />
                ) : (
                  <TransactionForm 
                    onAdd={addTransaction} 
                    onUpdate={updateTransaction}
                    initialData={editingItem.data}
                    clients={clients} 
                    recurringExpenses={recurringExpenses} 
                  />
                )
              ) : (
                activeTab === 'clients' ? (
                  <ClientForm onAdd={addClient} onCancel={handleCloseForm} />
                ) : activeTab === 'fixed-costs' ? (
                  <RecurringExpenseForm onAdd={addRecurringExpense} onCancel={handleCloseForm} />
                ) : (
                  <TransactionForm onAdd={addTransaction} clients={clients} recurringExpenses={recurringExpenses} />
                )
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
