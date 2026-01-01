import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchSummary, setFilters, setTransactions } from '../store/slices/transactionSlice';
import TransactionList from './transactions/TransactionList';
import TransactionForm from './transactions/TransactionForm';
import FilterPanel from './filters/FilterPanel';
import SummaryCards from './dashboard/SummaryCards';
import Charts from './charts/Charts';
import MonthlyReport from './reports/MonthlyReport';
import InsightsPanel from './ai/InsightsPanel';
import BudgetRecommendations from './ai/BudgetRecommendations';
import NaturalLanguageInput from './ai/NaturalLanguageInput';
import { getLocalTransactions } from '../utils/localStorage';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: transactions, summary, filters, isLoading } = useSelector((state) => state.transactions);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions'); // transactions, charts, reports

  useEffect(() => {
    // Try to load from server first, fallback to localStorage
    dispatch(fetchTransactions(filters))
      .catch(() => {
        // If API fails, load from localStorage
        const localTransactions = getLocalTransactions();
        if (localTransactions.length > 0) {
          dispatch(setTransactions(localTransactions));
        }
      });
    
    dispatch(fetchSummary(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, JSON.stringify(filters)]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Tabs */}
      <div className="mt-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'charts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Charts
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'ai'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🤖 AI Features
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'transactions' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition"
              >
                + Add Transaction
              </button>
            </div>

            <FilterPanel filters={filters} onFilterChange={(newFilters) => dispatch(setFilters(newFilters))} />

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
              />
            )}
          </>
        )}

        {activeTab === 'charts' && <Charts transactions={transactions} />}

        {activeTab === 'reports' && <MonthlyReport />}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <NaturalLanguageInput onSuccess={() => {
              dispatch(fetchTransactions(filters));
              dispatch(fetchSummary(filters));
            }} />
            <InsightsPanel />
            <BudgetRecommendations />
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
