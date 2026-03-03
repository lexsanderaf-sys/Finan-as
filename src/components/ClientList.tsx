import { User, Trash2, Mail, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { Client } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface ClientListProps {
  clients: Client[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function ClientList({ clients, onDelete, onToggleStatus }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
          <User size={32} />
        </div>
        <p className="font-medium text-lg">Nenhum cliente cadastrado</p>
        <p className="text-sm">Cadastre seus clientes para gerenciar faturamentos recorrentes.</p>
      </div>
    );
  }

  const totalRecurringRevenue = clients
    .filter(c => c.status === 'active' && c.isRecurring)
    .reduce((acc, c) => acc + c.monthlyValue, 0);

  return (
    <div className="space-y-6">
      {/* MRR Summary Card */}
      <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Receita Recorrente Mensal (MRR)</p>
          <h3 className="text-3xl font-bold">{formatCurrency(totalRecurringRevenue)}</h3>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <RefreshCw size={24} className="animate-spin-slow" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className={cn(
              "group p-5 glass rounded-2xl border transition-all hover:shadow-md",
              client.status === 'inactive' ? "opacity-60 grayscale" : "hover:border-zinc-400"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{client.name}</h4>
                  {client.email && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Mail size={12} />
                      {client.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onToggleStatus(client.id)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-all"
                  title={client.status === 'active' ? "Desativar" : "Ativar"}
                >
                  <AlertCircle size={16} />
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {client.isRecurring ? (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mensalidade</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(client.monthlyValue)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Dia de Pagamento</span>
                  <span className="font-bold text-zinc-700 flex items-center gap-1">
                    <Calendar size={14} className="text-zinc-400" />
                    Dia {client.billingDay}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-zinc-100">
                <span className="text-xs font-medium text-zinc-400 italic">Cliente eventual (sem recorrência)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
