import express from 'express';
import authenticate from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import {
  smartCategorize,
  generateInsights,
  detectAnomalies,
  generateBudgetRecommendations,
  parseNaturalLanguage,
} from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/ai/categorize
// @desc    Get smart category suggestion for a transaction
// @access  Private
router.post('/categorize', authenticate, (req, res) => {
  try {
    const { description, amount, type } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const category = smartCategorize(description, amount || 0, type || 'expense');
    
    res.json({ category });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ai/insights
// @desc    Get spending insights and recommendations
// @access  Private
router.get('/insights', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(1000);
    
    const insights = generateInsights(transactions);
    
    res.json({ insights });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ai/anomalies
// @desc    Detect anomalies in spending patterns
// @access  Private
router.get('/anomalies', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    
    const anomalies = detectAnomalies(transactions);
    
    res.json({ anomalies });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/ai/budget-recommendations
// @desc    Get AI-generated budget recommendations
// @access  Private
router.get('/budget-recommendations', authenticate, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 });
    
    const recommendations = generateBudgetRecommendations(transactions);
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Budget recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/ai/parse-natural-language
// @desc    Parse natural language transaction entry
// @access  Private
router.post('/parse-natural-language', authenticate, (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const parsed = parseNaturalLanguage(text);
    
    if (!parsed.amount) {
      return res.status(400).json({ 
        message: 'Could not extract amount from text. Please include a number.',
        parsed 
      });
    }

    res.json({ parsed });
  } catch (error) {
    console.error('Natural language parsing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
