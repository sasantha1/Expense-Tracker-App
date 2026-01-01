const STORAGE_KEY = 'expense_tracker_transactions';

export const getLocalTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const saveLocalTransaction = (transaction) => {
  try {
    const transactions = getLocalTransactions();
    transactions.unshift(transaction);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const updateLocalTransaction = (updatedTransaction) => {
  try {
    const transactions = getLocalTransactions();
    const index = transactions.findIndex(t => t._id === updatedTransaction._id);
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  } catch (error) {
    console.error('Error updating localStorage:', error);
  }
};

export const deleteLocalTransaction = (id) => {
  try {
    const transactions = getLocalTransactions();
    const filtered = transactions.filter(t => t._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
  }
};

export const syncLocalStorage = (action, data) => {
  switch (action) {
    case 'add':
      saveLocalTransaction(data);
      break;
    case 'update':
      updateLocalTransaction(data);
      break;
    case 'delete':
      deleteLocalTransaction(data._id);
      break;
    case 'sync':
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      break;
    default:
      break;
  }
};

export const clearLocalTransactions = () => {
  localStorage.removeItem(STORAGE_KEY);
};
