import React, { useState } from 'react';
import { PlusCircle, DollarSign, Calendar, Check, X, Tag } from 'lucide-react';
import { RecurringExpense } from '../types';

interface RecurringExpenseFormProps {
  onAdd: (expense: Omit<RecurringExpense, 'id'>) => void;
  onUpdate?: (id: string, expense: Omit<RecurringExpense, 'id'>) => void;
  initialData?: RecurringExpense;
  onCancel: () => void;
}

const CATEGORIES = ['Fornecedores', 'Impostos', 'Folha de Pagamento', 'Marketing', 'Infraestrutura', 'Logística', 'Software/SaaS', 'Outros'];

export function RecurringExpenseForm({ onAdd, onUpdate, initialData, onCancel }: RecurringExpenseFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [billingDay, setBillingDay] = useState(initialData?.billingDay?.toString() || '10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const expenseData = {
      description,
      amount: parseFloat(amount),
      category,
      billingDay: parseInt(billingDay) || 1,
      status: initialData?.status || 'active' as const,
    };

    if (initialData && onUpdate) {
      onUpdate(initialData.id, expenseData);
    } else {
      onAdd(expenseData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 glass rounded-2xl">
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Descrição do Custo Fixo</label>
        <div className="relative">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Aluguel, AWS, Internet..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            required
          />
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Valor Mensal (R$)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              required
            />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Dia de Vencimento</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="31"
              value={billingDay}
              onChange={(e) => setBillingDay(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              required
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all appearance-none bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-[2] bg-zinc-900 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg"
        >
          <Check size={20} />
          Salvar Custo Fixo
        </button>
      </div>
    </form>
  );
}
