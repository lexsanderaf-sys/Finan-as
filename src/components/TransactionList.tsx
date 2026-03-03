import { Trash2, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
          <Calendar size={32} />
        </div>
        <p className="font-medium text-lg">Nenhuma transação encontrada</p>
        <p className="text-sm">Comece adicionando suas entradas e saídas.</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="group flex items-center justify-between p-4 glass rounded-2xl hover:border-zinc-400 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              transaction.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            )}>
              {transaction.type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900">{transaction.description}</h4>
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                <span className="px-2 py-0.5 bg-zinc-100 rounded-full">{transaction.category}</span>
                <span>•</span>
                <span>{format(parseISO(transaction.date), "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={cn(
              "font-bold text-lg",
              transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
            )}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
