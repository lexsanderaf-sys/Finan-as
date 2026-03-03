import React, { useState } from 'react';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { cn } from '../lib/utils';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = {
  income: ['Salário', 'Investimento', 'Presente', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Moradia', 'Outros'],
};

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    setDescription('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 glass rounded-2xl">
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => { setType('income'); setCategory(CATEGORIES.income[0]); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium",
            type === 'income' 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          )}
        >
          <ArrowUpCircle size={20} />
          Entrada
        </button>
        <button
          type="button"
          onClick={() => { setType('expense'); setCategory(CATEGORIES.expense[0]); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium",
            type === 'expense' 
              ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          )}
        >
          <ArrowDownCircle size={20} />
          Saída
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Aluguel, Supermercado..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all appearance-none bg-white"
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-zinc-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-xl"
      >
        <PlusCircle size={20} />
        Adicionar Transação
      </button>
    </form>
  );
}
