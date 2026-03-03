import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, ListPlus, Plus, X } from 'lucide-react';
import { Transaction } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { SummaryDashboard } from './components/SummaryDashboard';
import { cn } from './lib/utils';

type Tab = 'summary' | 'transactions';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('financas-pro-transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('financas-pro-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
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
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Finanças Pro</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Controle Inteligente</p>
            </div>
          </div>

          <nav className="flex bg-zinc-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === 'summary' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <LayoutGrid size={16} />
              Resumo
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                activeTab === 'transactions' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              <ListPlus size={16} />
              Transações
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
              <SummaryDashboard transactions={transactions} />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-zinc-900">Histórico</h2>
                  <p className="text-sm text-zinc-500 font-medium">{transactions.length} transações</p>
                </div>
                <TransactionList transactions={transactions} onDelete={deleteTransaction} />
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
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4 text-white">
                <h3 className="text-xl font-bold">Nova Transação</h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <TransactionForm onAdd={addTransaction} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
