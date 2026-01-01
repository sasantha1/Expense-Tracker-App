import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { parseNaturalLanguage } from '../../store/slices/aiSlice';
import { addTransaction } from '../../store/slices/transactionSlice';

const NaturalLanguageInput = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState(null);

  const examples = [
    'spent $50 on groceries yesterday',
    'paid $25 for lunch today',
    'earned $1000 from freelance work',
    'bought coffee for $5.50',
  ];

  const handleParse = async () => {
    if (!text.trim()) {
      setError('Please enter a transaction description');
      return;
    }

    setLoading(true);
    setError('');
    setParsedData(null);

    try {
      const result = await dispatch(parseNaturalLanguage(text)).unwrap();
      setParsedData(result.parsed);
    } catch (err) {
      setError(err || 'Failed to parse text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseParsed = async () => {
    if (!parsedData || !parsedData.amount) {
      setError('Invalid parsed data');
      return;
    }

    try {
      await dispatch(addTransaction({
        type: parsedData.type || 'expense',
        category: parsedData.category || 'Other',
        amount: parsedData.amount,
        description: parsedData.description,
        date: parsedData.date || new Date().toISOString().split('T')[0],
      })).unwrap();
      
      setText('');
      setParsedData(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  const handleExampleClick = (example) => {
    setText(example);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🗣️</span> Natural Language Entry
      </h3>
      <p className="text-gray-600 mb-4">
        Describe your transaction in plain English. Our AI will extract the details automatically!
      </p>

      <div className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., spent $50 on groceries yesterday"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows="3"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {parsedData && parsedData.amount && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Parsed Transaction:</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Type:</span> {parsedData.type}</p>
              <p><span className="font-medium">Amount:</span> ${parsedData.amount.toFixed(2)}</p>
              <p><span className="font-medium">Category:</span> {parsedData.category}</p>
              {parsedData.date && (
                <p><span className="font-medium">Date:</span> {new Date(parsedData.date).toLocaleDateString()}</p>
              )}
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleUseParsed}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition"
              >
                Add Transaction
              </button>
              <button
                onClick={() => setParsedData(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleParse}
          disabled={loading || !text.trim()}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Parsing...' : 'Parse & Add Transaction'}
        </button>

        <div>
          <p className="text-sm text-gray-600 mb-2">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;
