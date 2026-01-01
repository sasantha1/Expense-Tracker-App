import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInsights, getAnomalies } from '../../store/slices/aiSlice';

const InsightsPanel = () => {
  const dispatch = useDispatch();
  const { insights, anomalies, isLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getInsights());
    dispatch(getAnomalies());
  }, [dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">AI Insights</h3>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span> AI Insights
        </h3>
        {insights.length === 0 ? (
          <p className="text-gray-500">No insights available yet. Add more transactions to get AI-powered insights!</p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getBgColor(insight.type)}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{getIcon(insight.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <p className="text-gray-700 mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔍</span> Anomaly Detection
          </h3>
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  anomaly.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">
                    {anomaly.severity === 'high' ? '🚨' : '⚠️'}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-700">{anomaly.message}</p>
                    {anomaly.transaction && (
                      <p className="text-sm text-gray-600 mt-2">
                        Date: {new Date(anomaly.transaction.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
