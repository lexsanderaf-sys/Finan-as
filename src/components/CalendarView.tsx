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
  parseISO,
  isWithinInterval,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface CalendarViewProps {
  transactions: Transaction[];
}

export function CalendarView({ transactions }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

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
      if (!dateKey) return acc;
      
      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') acc[dateKey].income += t.amount;
      else acc[dateKey].expense += t.amount;
      return acc;
    }, {});
  }, [transactions]);

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (isBefore(day, rangeStart)) {
        setRangeStart(day);
        setRangeEnd(null);
      } else {
        setRangeEnd(day);
      }
    }
  };

  const isInRange = (day: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return isWithinInterval(startOfDay(day), {
      start: startOfDay(rangeStart),
      end: startOfDay(rangeEnd)
    });
  };

  const rangeTotals = useMemo(() => {
    if (!rangeStart || !rangeEnd) return null;
    
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);
    
    return transactions.reduce((acc, t) => {
      if (!t.date) return acc;
      try {
        const tDate = parseISO(t.date);
        if (isNaN(tDate.getTime())) return acc;
        
        if (isWithinInterval(startOfDay(tDate), { start, end })) {
          if (t.type === 'income') acc.income += t.amount;
          else acc.expense += t.amount;
        }
      } catch (e) {
        console.error('Error parsing date in rangeTotals:', e);
      }
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions, rangeStart, rangeEnd]);

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

        <div className="flex items-center gap-4">
          {(rangeStart || rangeEnd) && (
            <button
              onClick={() => { setRangeStart(null); setRangeEnd(null); }}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <X size={14} />
              Limpar Período
            </button>
          )}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
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
                const inRange = isInRange(day);
                const isStart = rangeStart && isSameDay(day, rangeStart);
                const isEnd = rangeEnd && isSameDay(day, rangeEnd);

                return (
                  <div
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[100px] p-2 border-r border-b border-zinc-100 transition-all cursor-pointer relative group",
                      !isCurrentMonth ? "bg-zinc-50/50" : "bg-white hover:bg-zinc-50",
                      isSelected && "ring-2 ring-inset ring-zinc-900 z-10",
                      inRange && "bg-zinc-900/5",
                      (isStart || isEnd) && "bg-zinc-900/10",
                      idx % 7 === 6 && "border-r-0"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                        isToday ? "bg-zinc-900 text-white" : isCurrentMonth ? "text-zinc-900" : "text-zinc-300",
                        (isStart || isEnd) && !isToday && "bg-zinc-400 text-white"
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

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-zinc-200 shadow-lg sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon className="text-zinc-900" size={20} />
              <h3 className="font-bold text-zinc-900">Resumo do Período</h3>
            </div>

            {rangeTotals ? (
              <div className="space-y-6">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Período Selecionado</p>
                  <p className="text-xs font-bold text-zinc-900">
                    {format(rangeStart!, 'dd/MM/yyyy')} - {format(rangeEnd!, 'dd/MM/yyyy')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Entradas</span>
                      <span className="text-sm font-bold text-emerald-600">+{formatCurrency(rangeTotals.income)}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.min(100, (rangeTotals.income / (rangeTotals.income + rangeTotals.expense || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Saídas</span>
                      <span className="text-sm font-bold text-rose-600">-{formatCurrency(rangeTotals.expense)}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full" 
                        style={{ width: `${Math.min(100, (rangeTotals.expense / (rangeTotals.income + rangeTotals.expense || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Saldo Total</span>
                      <span className={cn(
                        "text-lg font-bold",
                        rangeTotals.income - rangeTotals.expense >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {formatCurrency(rangeTotals.income - rangeTotals.expense)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto text-zinc-300">
                  <CalendarIcon size={24} />
                </div>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Selecione dois dias no calendário para ver o resumo financeiro do período.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
