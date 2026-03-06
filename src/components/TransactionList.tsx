import { Trash2, ArrowUpCircle, ArrowDownCircle, Calendar, Pencil } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
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
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => {
        let formattedDate = 'Data inválida';
        try {
          if (transaction.date) {
            formattedDate = format(parseISO(transaction.date), "dd 'de' MMMM", { locale: ptBR });
          }
        } catch (e) {
          console.error('Error formatting date:', e);
        }

        return (
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
                <h4 className="font-semibold text-zinc-900">{transaction.description || 'Sem descrição'}</h4>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <span className="px-2 py-0.5 bg-zinc-100 rounded-full">{transaction.category || 'Sem categoria'}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={cn(
                "font-bold text-lg",
                transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
              )}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount || 0)}
              </span>
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);
}
