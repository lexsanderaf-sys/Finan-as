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
  }
};
