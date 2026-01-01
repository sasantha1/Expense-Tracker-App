import React, { useMemo } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
);

const Charts = ({ transactions }) => {
  // Category breakdown for pie chart
  const categoryData = useMemo(() => {
    const breakdown = {};
    transactions.forEach((t) => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = { income: 0, expense: 0 };
      }
      breakdown[t.category][t.type] += t.amount;
    });

    const expenseCategories = Object.keys(breakdown).filter(
      (cat) => breakdown[cat].expense > 0
    );
    const incomeCategories = Object.keys(breakdown).filter(
      (cat) => breakdown[cat].income > 0
    );

    return { expenseCategories, incomeCategories, breakdown };
  }, [transactions]);

  // Trend data for line chart
  const trendData = useMemo(() => {
    const trends = {};
    transactions.forEach((t) => {
      const date = new Date(t.date).toISOString().split('T')[0];
      if (!trends[date]) {
        trends[date] = { income: 0, expense: 0, date };
      }
      trends[date][t.type] += t.amount;
    });

    return Object.values(trends)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days
  }, [transactions]);

  const expensePieData = {
    labels: categoryData.expenseCategories,
    datasets: [
      {
        label: 'Expenses',
        data: categoryData.expenseCategories.map(
          (cat) => categoryData.breakdown[cat].expense
        ),
        backgroundColor: [
          '#EF4444',
          '#F97316',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
          '#06B6D4',
        ],
      },
    ],
  };

  const incomePieData = {
    labels: categoryData.incomeCategories,
    datasets: [
      {
        label: 'Income',
        data: categoryData.incomeCategories.map(
          (cat) => categoryData.breakdown[cat].income
        ),
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#EC4899',
          '#06B6D4',
          '#F59E0B',
        ],
      },
    ],
  };

  const lineChartData = {
    labels: trendData.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Income',
        data: trendData.map((t) => t.income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: trendData.map((t) => t.expense),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No data available for charts. Add some transactions first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trend Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Income vs Expenses Trend</h3>
        <div className="h-80">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryData.expenseCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Expense by Category</h3>
            <div className="h-80">
              <Pie data={expensePieData} options={chartOptions} />
            </div>
          </div>
        )}

        {categoryData.incomeCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Income by Category</h3>
            <div className="h-80">
              <Pie data={incomePieData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
