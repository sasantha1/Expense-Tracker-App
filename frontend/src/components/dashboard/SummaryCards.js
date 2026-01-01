import React from 'react';

const SummaryCards = ({ summary }) => {
  const { totalIncome, totalExpenses, balance, transactionCount } = summary;

  const cards = [
    {
      title: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      color: 'bg-green-500',
      icon: '💰',
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      color: 'bg-red-500',
      icon: '💸',
    },
    {
      title: 'Balance',
      value: `$${balance.toFixed(2)}`,
      color: balance >= 0 ? 'bg-blue-500' : 'bg-orange-500',
      icon: '💵',
    },
    {
      title: 'Transactions',
      value: transactionCount,
      color: 'bg-purple-500',
      icon: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition duration-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-80 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="text-5xl opacity-80">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
