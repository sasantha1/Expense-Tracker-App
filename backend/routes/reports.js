import express from 'express';
import Transaction from '../models/Transaction.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/monthly
// @desc    Get monthly report
// @access  Private
router.get('/monthly', authenticate, async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0, 23, 59, 59);
    
    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    
    // Calculate totals
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expense: 0 };
      }
      categoryBreakdown[t.category][t.type] += t.amount;
    });
    
    res.json({
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      transactionCount: transactions.length,
      categoryBreakdown,
      transactions
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/category-breakdown
// @desc    Get category breakdown for charts
// @access  Private
router.get('/category-breakdown', authenticate, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const query = { user: req.user._id };
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query);
    
    const breakdown = {};
    transactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = 0;
      }
      breakdown[t.category] += t.amount;
    });
    
    res.json(breakdown);
  } catch (error) {
    console.error('Get category breakdown error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reports/trends
// @desc    Get trends over time
// @access  Private
router.get('/trends', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const query = { user: req.user._id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query).sort({ date: 1 });
    
    // Group by day, week, or month
    const trends = {};
    
    transactions.forEach(t => {
      let key;
      const date = new Date(t.date);
      
      if (groupBy === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!trends[key]) {
        trends[key] = { income: 0, expense: 0, date: key };
      }
      trends[key][t.type] += t.amount;
    });
    
    const trendArray = Object.values(trends).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    res.json(trendArray);
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
