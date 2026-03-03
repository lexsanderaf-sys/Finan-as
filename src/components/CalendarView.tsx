import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface CalendarViewProps {
  transactions: Transaction[];
}

export function CalendarView({ transactions }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [startDate, endDate]);

  const dailyTotals = useMemo(() => {
    return transactions.reduce((acc: Record<string, { income: number; expense: number }>, t) => {
      const dateKey = t.date; // ISO string YYYY-MM-DD
      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') acc[dateKey].income += t.amount;
      else acc[dateKey].expense += t.amount;
      return acc;
    }, {});
  }, [transactions]);

  const selectedDayTransactions = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return transactions.filter(t => t.date === dateKey);
  }, [transactions, selectedDate]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Calendário Financeiro</h2>
          <p className="text-sm text-zinc-500 font-medium capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 font-bold text-sm text-zinc-900 min-w-[120px] text-center capitalize">
            {format(currentMonth, 'MMM yyyy', { locale: ptBR })}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border border-zinc-200 shadow-xl">
        {/* Weekdays Header */}
        <div className="grid grid-cols-7 bg-zinc-900 text-white py-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest opacity-60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-collapse">
          {calendarDays.map((day, idx) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const totals = dailyTotals[dateKey];
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[100px] p-2 border-r border-b border-zinc-100 transition-all cursor-pointer relative group",
                  !isCurrentMonth ? "bg-zinc-50/50" : "bg-white hover:bg-zinc-50",
                  isSelected && "ring-2 ring-inset ring-zinc-900 z-10",
                  idx % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={cn(
                    "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                    isToday ? "bg-zinc-900 text-white" : isCurrentMonth ? "text-zinc-900" : "text-zinc-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>

                {totals && (
                  <div className="space-y-1 mt-1">
                    {totals.income > 0 && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md truncate">
                        <ArrowUpCircle size={10} />
                        {formatCurrency(totals.income)}
                      </div>
                    )}
                    {totals.expense > 0 && (
                      <div className="flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md truncate">
                        <ArrowDownCircle size={10} />
                        {formatCurrency(totals.expense)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            Transações de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {selectedDayTransactions.length} Lançamentos
          </span>
        </div>

        {selectedDayTransactions.length > 0 ? (
          <div className="space-y-3">
            {selectedDayTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 glass rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    t.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  )}>
                    {t.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{t.description}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t.category}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold",
                  t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center glass rounded-3xl text-zinc-400 text-sm italic">
            Nenhuma transação registrada para este dia.
          </div>
        )}
      </div>
    </div>
  );
}
