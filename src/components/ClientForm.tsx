import React, { useState } from 'react';
import { PlusCircle, User, DollarSign, Calendar, Mail, Check, X } from 'lucide-react';
import { Client } from '../types';
import { cn } from '../lib/utils';

interface ClientFormProps {
  onAdd: (client: Omit<Client, 'id'>) => void;
  onUpdate?: (id: string, client: Omit<Client, 'id'>) => void;
  initialData?: Client;
  onCancel: () => void;
}

export function ClientForm({ onAdd, onUpdate, initialData, onCancel }: ClientFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring ?? true);
  const [monthlyValue, setMonthlyValue] = useState(initialData?.monthlyValue.toString() || '');
  const [billingDay, setBillingDay] = useState(initialData?.billingDay.toString() || '10');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const clientData = {
      name,
      email: email || undefined,
      isRecurring,
      monthlyValue: isRecurring ? parseFloat(monthlyValue) || 0 : 0,
      billingDay: parseInt(billingDay) || 1,
      status: initialData?.status || 'active' as const,
    };

    if (initialData && onUpdate) {
      onUpdate(initialData.id, clientData);
    } else {
      onAdd(clientData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 glass rounded-2xl">
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Nome do Cliente / Empresa</label>
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Acme Corp"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            required
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">E-mail (Opcional)</label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@empresa.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
        />
        <label htmlFor="isRecurring" className="text-sm font-semibold text-zinc-700 cursor-pointer">
          Cliente Recorrente (Assinatura/Mensalidade)
        </label>
      </div>

      {isRecurring && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Valor Mensal (R$)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={monthlyValue}
                onChange={(e) => setMonthlyValue(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                required={isRecurring}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 block">Dia de Faturamento</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                required={isRecurring}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            </div>
          </div>
        </div>
      )}

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
          Salvar Cliente
        </button>
      </div>
    </form>
  );
}
