import { Trash2, Calendar, DollarSign, RefreshCw, AlertCircle, Tag, Pencil } from 'lucide-react';
import { RecurringExpense } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface RecurringExpenseListProps {
  expenses: RecurringExpense[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (expense: RecurringExpense) => void;
}

export function RecurringExpenseList({ expenses, onDelete, onToggleStatus, onEdit }: RecurringExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
          <RefreshCw size={32} />
        </div>
        <p className="font-medium text-lg">Nenhum custo fixo cadastrado</p>
        <p className="text-sm">Cadastre suas despesas recorrentes para melhor controle do fluxo.</p>
      </div>
    );
  }

  const totalRecurringExpenses = expenses
    .filter(e => e.status === 'active')
    .reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Total Fixed Costs Summary Card */}
      <div className="p-6 bg-rose-600 rounded-3xl text-white shadow-xl shadow-rose-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total de Custos Fixos Mensais</p>
          <h3 className="text-3xl font-bold">{formatCurrency(totalRecurringExpenses)}</h3>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <RefreshCw size={24} className="animate-spin-slow" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className={cn(
              "group p-5 glass rounded-2xl border transition-all hover:shadow-md",
              expense.status === 'inactive' ? "opacity-60 grayscale" : "hover:border-zinc-400"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <Tag size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{expense.description}</h4>
                  <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded-full uppercase tracking-wider">
                    {expense.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 transition-opacity">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onToggleStatus(expense.id)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all"
                  title={expense.status === 'active' ? "Desativar" : "Ativar"}
                >
                  <AlertCircle size={16} />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Valor Mensal</span>
                <span className="font-bold text-rose-600">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vencimento</span>
                <span className="font-bold text-zinc-700 flex items-center gap-1">
                  <Calendar size={14} className="text-zinc-400" />
                  Dia {expense.billingDay}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
