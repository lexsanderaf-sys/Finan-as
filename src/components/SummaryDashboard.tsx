import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from 'lucide-react';

interface SummaryDashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export function SummaryDashboard({ transactions }: SummaryDashboardProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Category data for Pie Chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  // Monthly data for Bar Chart (last 6 months)
  const monthlyData = transactions.reduce((acc: any[], t) => {
    const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      if (t.type === 'income') existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({
        month,
        income: t.type === 'income' ? t.amount : 0,
        expense: t.type === 'expense' ? t.amount : 0,
      });
    }
    return acc;
  }, []).slice(-6);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 glass rounded-3xl border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <ArrowUpCircle size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Entradas</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="p-6 glass rounded-3xl border-l-4 border-l-rose-500">
          <div className="flex items-center gap-3 text-rose-600 mb-2">
            <ArrowDownCircle size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Saídas</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{formatCurrency(totalExpense)}</p>
        </div>

        <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-xl shadow-zinc-200">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Wallet size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Saldo Atual</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <div className="p-6 glass rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-zinc-400" />
            <h3 className="font-bold text-zinc-900">Fluxo Mensal</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="p-6 glass rounded-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <h3 className="font-bold text-zinc-900">Gastos por Categoria</h3>
          </div>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                Sem dados de gastos para exibir
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
