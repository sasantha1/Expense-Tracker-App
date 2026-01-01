import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetRecommendations } from '../../store/slices/aiSlice';

const BudgetRecommendations = () => {
  const dispatch = useDispatch();
  const { budgetRecommendations, isLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getBudgetRecommendations());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Recommendations</h3>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (budgetRecommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Recommendations</h3>
        <p className="text-gray-500">Add more transactions to get AI-powered budget recommendations!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">💡</span> AI Budget Recommendations
      </h3>
      <div className="space-y-4">
        {budgetRecommendations.map((rec, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                <p className="text-sm text-gray-600 mt-1">{rec.reasoning}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current: ${rec.currentSpending.toFixed(2)}</p>
                <p className="text-lg font-bold text-primary-600">
                  Suggested: ${rec.suggestedBudget.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Category Share</span>
                <span>{rec.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${Math.min(rec.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetRecommendations;
