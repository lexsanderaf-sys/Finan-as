const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/kkxsxdx269joa';

export const sheetService = {
  async postTransaction(transaction: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}?sheet=Transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              id: transaction.id,
              data: transaction.date,
              descricao: transaction.description,
              valor: transaction.amount,
              tipo: transaction.type,
              categoria: transaction.category,
              cliente_id: transaction.clientId || '',
              custo_fixo_id: transaction.recurringExpenseId || '',
              criado_em: new Date().toISOString()
            }
          ]
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving transaction to SheetDB:', error);
      return false;
    }
  },

  async postClient(client: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}?sheet=Clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              id: client.id,
              nome: client.name,
              email: client.email,
              recorrente: client.isRecurring ? 'Sim' : 'Não',
              valor_mensal: client.monthlyValue,
              dia_faturamento: client.billingDay,
              status: client.status,
              criado_em: new Date().toISOString()
            }
          ]
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving client to SheetDB:', error);
      return false;
    }
  },

  async postRecurringExpense(expense: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}?sheet=RecurringExpenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            {
              id: expense.id,
              descricao: expense.description,
              valor: expense.amount,
              categoria: expense.category,
              dia_vencimento: expense.billingDay,
              status: expense.status,
              criado_em: new Date().toISOString()
            }
          ]
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving recurring expense to SheetDB:', error);
      return false;
    }
  },

  async deleteTransaction(id: string) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=Transactions`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting transaction from SheetDB:', error);
      return false;
    }
  },

  async deleteClient(id: string) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=Clients`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting client from SheetDB:', error);
      return false;
    }
  },

  async deleteRecurringExpense(id: string) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=RecurringExpenses`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting recurring expense from SheetDB:', error);
      return false;
    }
  },

  async updateTransaction(id: string, transaction: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=Transactions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            data: transaction.date,
            descricao: transaction.description,
            valor: transaction.amount,
            tipo: transaction.type,
            categoria: transaction.category,
            cliente_id: transaction.clientId || '',
            custo_fixo_id: transaction.recurringExpenseId || '',
          }
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating transaction in SheetDB:', error);
      return false;
    }
  },

  async updateClient(id: string, client: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=Clients`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            nome: client.name,
            email: client.email,
            recorrente: client.isRecurring ? 'Sim' : 'Não',
            valor_mensal: client.monthlyValue,
            dia_faturamento: client.billingDay,
            status: client.status,
          }
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating client in SheetDB:', error);
      return false;
    }
  },

  async updateRecurringExpense(id: string, expense: any) {
    try {
      const response = await fetch(`${SHEETDB_API_URL}/id/${id}?sheet=RecurringExpenses`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            descricao: expense.description,
            valor: expense.amount,
            categoria: expense.category,
            dia_vencimento: expense.billingDay,
            status: expense.status,
          }
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating recurring expense in SheetDB:', error);
      return false;
    }
  },

  async getAllData() {
    try {
      const [transactionsRes, clientsRes, expensesRes] = await Promise.all([
        fetch(`${SHEETDB_API_URL}?sheet=Transactions`),
        fetch(`${SHEETDB_API_URL}?sheet=Clients`),
        fetch(`${SHEETDB_API_URL}?sheet=RecurringExpenses`)
      ]);

      const transactions = await transactionsRes.json();
      const clients = await clientsRes.json();
      const expenses = await expensesRes.json();

      return {
        transactions: Array.isArray(transactions) ? transactions
          .filter((t: any) => t.id) // Ensure it has an ID
          .map((t: any) => ({
            id: t.id,
            date: t.data || t.Data || '',
            description: t.descricao || t.Descricao || '',
            amount: Number(t.valor || t.Valor || 0),
            type: t.tipo || t.Tipo || 'expense',
            category: t.categoria || t.Categoria || 'Outros',
            clientId: t.cliente_id || t.Cliente_id || '',
            recurringExpenseId: t.custo_fixo_id || t.Custo_fixo_id || ''
          })) : [],
        clients: Array.isArray(clients) ? clients
          .filter((c: any) => c.id)
          .map((c: any) => ({
            id: c.id,
            name: c.nome || c.Nome || '',
            email: c.email || c.Email || '',
            isRecurring: (c.recorrente || c.Recorrente) === 'Sim',
            monthlyValue: Number(c.valor_mensal || c.Valor_mensal || 0),
            billingDay: Number(c.dia_faturamento || c.Dia_faturamento || 1),
            status: c.status || c.Status || 'active'
          })) : [],
        recurringExpenses: Array.isArray(expenses) ? expenses
          .filter((e: any) => e.id)
          .map((e: any) => ({
            id: e.id,
            description: e.descricao || e.Descricao || '',
            amount: Number(e.valor || e.Valor || 0),
            category: e.categoria || e.Categoria || 'Outros',
            billingDay: Number(e.dia_vencimento || e.Dia_vencimento || 1),
            status: e.status || e.Status || 'active'
          })) : []
      };
    } catch (error) {
      console.error('Error fetching data from SheetDB:', error);
      return null;
    }
  }
};
