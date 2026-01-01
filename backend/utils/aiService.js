// AI Service for Expense Tracker
// This includes smart categorization, insights, and anomaly detection
// Note: For production, consider integrating with OpenAI API or similar services

/**
 * Smart categorization based on transaction description
 * Uses pattern matching and keywords to automatically categorize transactions
 */
export const smartCategorize = (description, amount, type) => {
  if (!description) return null;

  const desc = description.toLowerCase().trim();

  // Income categories
  if (type === 'income') {
    const incomePatterns = {
      'Salary': ['salary', 'payroll', 'paycheck', 'wages', 'employment'],
      'Freelance': ['freelance', 'contract', 'consulting', 'project'],
      'Investment': ['dividend', 'interest', 'investment', 'return', 'profit'],
      'Business': ['business', 'revenue', 'sales', 'income'],
      'Gift': ['gift', 'present', 'bonus', 'reward'],
    };

    for (const [category, keywords] of Object.entries(incomePatterns)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return category;
      }
    }
    return 'Other';
  }

  // Expense categories with intelligent matching
  const expensePatterns = {
    'Food': ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'groceries', 'supermarket', 'walmart', 'target', 'kroger', 'safeway', 'dining', 'lunch', 'dinner', 'breakfast', 'starbucks', 'mcdonald', 'subway'],
    'Transport': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'subway', 'bus', 'train', 'airline', 'flight', 'transport', 'car', 'vehicle', 'automotive'],
    'Shopping': ['amazon', 'ebay', 'store', 'shop', 'mall', 'retail', 'clothing', 'apparel', 'fashion', 'online', 'purchase'],
    'Bills': ['electric', 'utility', 'water', 'internet', 'phone', 'cable', 'tv', 'netflix', 'spotify', 'subscription', 'bill', 'payment'],
    'Entertainment': ['movie', 'cinema', 'theater', 'concert', 'game', 'entertainment', 'fun', 'hobby', 'sports', 'ticket'],
    'Health': ['pharmacy', 'drugstore', 'hospital', 'doctor', 'medical', 'health', 'fitness', 'gym', 'vitamin', 'medicine'],
    'Education': ['school', 'university', 'college', 'course', 'education', 'tuition', 'book', 'textbook', 'learning'],
    'Rent': ['rent', 'housing', 'apartment', 'lease', 'mortgage', 'property'],
  };

  // Score-based categorization
  let bestMatch = { category: 'Other', score: 0 };

  for (const [category, keywords] of Object.entries(expensePatterns)) {
    const score = keywords.reduce((acc, keyword) => {
      if (desc.includes(keyword)) {
        return acc + (keyword.length / desc.length) * 100;
      }
      return acc;
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { category, score };
    }
  }

  // If score is too low, return Other
  return bestMatch.score > 10 ? bestMatch.category : 'Other';
};

/**
 * Generate spending insights based on transaction history
 */
export const generateInsights = (transactions) => {
  const insights = [];
  
  if (!transactions || transactions.length === 0) {
    return insights;
  }

  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(t => new Date(t.date) >= last30Days);

  // Calculate totals
  const totalExpenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Spending trend analysis
  const categorySpending = {};
  recentTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  // Top spending category
  const topCategory = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])[0];

  if (topCategory) {
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      message: `You spent the most on ${topCategory[0]} ($${topCategory[1].toFixed(2)}) in the last 30 days.`,
      category: topCategory[0],
    });
  }

  // Budget health check
  if (totalIncome > 0) {
    const expenseRatio = (totalExpenses / totalIncome) * 100;
    if (expenseRatio > 90) {
      insights.push({
        type: 'warning',
        title: 'High Spending Alert',
        message: `You're spending ${expenseRatio.toFixed(1)}% of your income. Consider reviewing your expenses.`,
      });
    } else if (expenseRatio < 50) {
      insights.push({
        type: 'success',
        title: 'Great Savings!',
        message: `You're only spending ${expenseRatio.toFixed(1)}% of your income. Excellent financial health!`,
      });
    }
  }

  // Spending velocity
  const dailyAverage = totalExpenses / 30;
  insights.push({
    type: 'info',
    title: 'Daily Average',
    message: `Your average daily spending is $${dailyAverage.toFixed(2)}.`,
  });

  // Category distribution
  const categoryCount = Object.keys(categorySpending).length;
  if (categoryCount > 0) {
    insights.push({
      type: 'info',
      title: 'Spending Diversity',
      message: `Your expenses are spread across ${categoryCount} different categories.`,
    });
  }

  return insights;
};

/**
 * Detect anomalies in spending patterns
 */
export const detectAnomalies = (transactions) => {
  const anomalies = [];

  if (!transactions || transactions.length < 5) {
    return anomalies;
  }

  const expenses = transactions.filter(t => t.type === 'expense');
  
  if (expenses.length === 0) return anomalies;

  // Calculate average transaction amount
  const amounts = expenses.map(t => t.amount);
  const average = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - average, 2), 0) / amounts.length;
  const standardDeviation = Math.sqrt(variance);

  // Detect outliers (transactions more than 2 standard deviations from mean)
  expenses.forEach(transaction => {
    const zScore = Math.abs(transaction.amount - average) / standardDeviation;
    if (zScore > 2 && transaction.amount > average) {
      anomalies.push({
        transaction,
        type: 'unusual_spending',
        message: `Unusually large transaction: $${transaction.amount.toFixed(2)} for ${transaction.category}`,
        severity: zScore > 3 ? 'high' : 'medium',
      });
    }
  });

  // Detect sudden spending spikes
  const now = new Date();
  const last7Days = expenses.filter(t => {
    const daysAgo = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  if (last7Days.length > 0) {
    const last7DaysTotal = last7Days.reduce((sum, t) => sum + t.amount, 0);
    const previous7DaysTotal = expenses
      .filter(t => {
        const daysAgo = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
        return daysAgo > 7 && daysAgo <= 14;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    if (previous7DaysTotal > 0 && last7DaysTotal > previous7DaysTotal * 1.5) {
      anomalies.push({
        type: 'spending_spike',
        message: `Your spending increased by ${((last7DaysTotal / previous7DaysTotal - 1) * 100).toFixed(1)}% compared to the previous week.`,
        severity: 'medium',
      });
    }
  }

  return anomalies;
};

/**
 * Generate budget recommendations based on spending patterns
 */
export const generateBudgetRecommendations = (transactions) => {
  const recommendations = [];

  if (!transactions || transactions.length === 0) {
    return recommendations;
  }

  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(t => new Date(t.date) >= last30Days);

  const categorySpending = {};
  recentTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  const totalExpenses = Object.values(categorySpending).reduce((sum, amt) => sum + amt, 0);

  // Recommend budgets for each category (suggest 110% of current spending as budget)
  Object.entries(categorySpending).forEach(([category, amount]) => {
    const percentage = (amount / totalExpenses) * 100;
    const suggestedBudget = amount * 1.1; // 10% buffer

    recommendations.push({
      category,
      currentSpending: amount,
      suggestedBudget,
      percentage: percentage.toFixed(1),
      reasoning: percentage > 30 
        ? 'High spending category - consider setting a budget to track this closely'
        : 'Moderate spending - a budget can help you stay on track',
    });
  });

  return recommendations.sort((a, b) => b.currentSpending - a.currentSpending);
};

/**
 * Parse natural language transaction entry
 * Example: "spent 50 dollars on groceries yesterday"
 */
export const parseNaturalLanguage = (text) => {
  if (!text) return null;

  const lowerText = text.toLowerCase().trim();
  const result = {
    type: 'expense',
    amount: null,
    category: null,
    description: text,
  };

  // Extract amount (look for numbers with dollar signs or currency keywords)
  const amountMatches = lowerText.match(/\$?(\d+(?:\.\d{2})?)/);
  if (amountMatches) {
    result.amount = parseFloat(amountMatches[1]);
  }

  // Determine type
  if (lowerText.includes('earn') || lowerText.includes('income') || lowerText.includes('received')) {
    result.type = 'income';
  } else if (lowerText.includes('spent') || lowerText.includes('paid') || lowerText.includes('bought')) {
    result.type = 'expense';
  }

  // Extract category using smart categorization
  result.category = smartCategorize(text, result.amount, result.type);

  // Extract date keywords
  const dateKeywords = {
    'today': 0,
    'yesterday': 1,
    'tomorrow': -1,
  };

  for (const [keyword, daysOffset] of Object.entries(dateKeywords)) {
    if (lowerText.includes(keyword)) {
      const date = new Date();
      date.setDate(date.getDate() - daysOffset);
      result.date = date.toISOString().split('T')[0];
      break;
    }
  }

  return result;
};

export default {
  smartCategorize,
  generateInsights,
  detectAnomalies,
  generateBudgetRecommendations,
  parseNaturalLanguage,
};
