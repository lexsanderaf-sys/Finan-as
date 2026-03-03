import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Transaction, Client, RecurringExpense } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, ChevronDown, RefreshCw } from 'lucide-react';

interface SummaryDashboardProps {
  transactions: Transaction[];
  clients: Client[];
  recurringExpenses: RecurringExpense[];
}

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export function SummaryDashboard({ transactions, clients, recurringExpenses }: SummaryDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const totalRecurringRevenue = useMemo(() => {
    return clients
      .filter(c => c.status === 'active' && c.isRecurring)
      .reduce((acc, c) => acc + c.monthlyValue, 0);
  }, [clients]);

  const totalFixedCosts = useMemo(() => {
    return recurringExpenses
      .filter(e => e.status === 'active')
      .reduce((acc, e) => acc + e.amount, 0);
  }, [recurringExpenses]);

  // Get all unique months from transactions for the selector
  const availableMonths = useMemo(() => {
    const months = transactions.reduce((acc: { key: string; label: string }[], t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!acc.find(m => m.key === key)) {
        acc.push({ key, label });
      }
      return acc;
    }, []);
    return months.sort((a, b) => b.key.localeCompare(a.key));
  }, [transactions]);

  // Filter transactions based on selection
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return key === selectedMonth;
    });
  }, [transactions, selectedMonth]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0';

  // Category data for Pie Chart
  const categoryData = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  // Monthly data for charts (always use all transactions for the trend charts)
  const monthlyTrendData = useMemo(() => {
    return transactions.reduce((acc: any[], t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      
      const existing = acc.find(item => item.key === monthKey);
      if (existing) {
        if (t.type === 'income') existing.income += t.amount;
        else existing.expense += t.amount;
        existing.profit = existing.income - existing.expense;
      } else {
        acc.push({
          key: monthKey,
          month: monthLabel,
          income: t.type === 'income' ? t.amount : 0,
          expense: t.type === 'expense' ? t.amount : 0,
          profit: (t.type === 'income' ? t.amount : 0) - (t.type === 'expense' ? t.amount : 0),
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-12);
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Resumo Executivo</h2>
          <p className="text-sm text-zinc-500 font-medium">
            {selectedMonth === 'all' ? 'Visão geral de todo o período' : `Análise detalhada de ${availableMonths.find(m => m.key === selectedMonth)?.label}`}
          </p>
        </div>
        
        <div className="relative inline-block">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-white border border-zinc-200 text-zinc-700 py-2.5 pl-10 pr-10 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all cursor-pointer shadow-sm"
          >
            <option value="all">Período Total</option>
            {availableMonths.map(month => (
              <option key={month.key} value={month.key}>{month.label}</option>
            ))}
          </select>
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* Business Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-6 glass rounded-3xl border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <ArrowUpCircle size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Receita</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3 text-rose-600 mb-2">
            <ArrowDownCircle size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Despesas</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalExpense)}</p>
        </div>

        <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Wallet size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Lucro Líquido</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <RefreshCw size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">MRR</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalRecurringRevenue)}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-l-4 border-l-orange-500">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <RefreshCw size={18} className="rotate-180" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Custos Fixos</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalFixedCosts)}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <TrendingUp size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Margem</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{margin}%</p>
        </div>
      </div>

      {/* Main Monthly Chart - Only show if "All" is selected or if we want to see the trend anyway */}
      <div className="p-8 glass rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 size={24} className="text-zinc-400" />
            <div>
              <h3 className="font-bold text-xl text-zinc-900">Evolução Mensal</h3>
              <p className="text-xs text-zinc-500 font-medium">Performance histórica dos últimos 12 meses</p>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="Receita" barSize={30} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Despesa" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Trend Line Chart */}
        <div className="p-6 glass rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-blue-500" />
            <h3 className="font-bold text-zinc-900">Tendência de Lucro</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Lucro" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart - This one is filtered! */}
        <div className="p-6 glass rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon size={20} className="text-rose-500" />
            <h3 className="font-bold text-zinc-900">Custos por Categoria {selectedMonth !== 'all' && '(Mês)'}</h3>
          </div>
          <div className="h-[280px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                Sem dados de custos para este período
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
