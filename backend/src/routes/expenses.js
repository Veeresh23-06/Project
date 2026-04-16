const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const validateExpense = (data) => {
  const errors = [];
  if (typeof data.amount !== 'number' || Number.isNaN(data.amount) || data.amount <= 0) {
    errors.push('Amount must be a positive number');
  }
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required');
  }
  if (!data.date || Number.isNaN(new Date(data.date).getTime())) {
    errors.push('Valid date is required');
  }
  return errors;
};

const buildFilter = ({ category, fromDate, toDate, search }, userId) => {
  const filter = { user: userId };
  if (category) filter.category = category;
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }
  if (search) {
    filter.notes = { $regex: search, $options: 'i' };
  }
  return filter;
};

router.get('/', async (req, res) => {
  try {
    const filter = buildFilter(req.query, req.user.id);
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
});

router.get('/export', async (req, res) => {
  try {
    const filter = buildFilter(req.query, req.user.id);
    const expenses = await Expense.find(filter).sort({ date: -1 });

    const csvRows = ['Date,Category,Amount,Notes'];
    expenses.forEach((expense) => {
      const notes = expense.notes?.replace(/"/g, '""') || '';
      csvRows.push(`"${new Date(expense.date).toISOString().slice(0, 10)}","${expense.category}","${expense.amount.toFixed(2)}","${notes}"`);
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.send(csvRows.join('\n'));
  } catch (error) {
    res.status(500).json({ message: 'Failed to export expenses', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const expense = new Expense({
      amount: req.body.amount,
      category: req.body.category,
      date: new Date(req.body.date),
      notes: req.body.notes || '',
      user: req.user.id,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save expense', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const errors = validateExpense(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        amount: req.body.amount,
        category: req.body.category,
        date: new Date(req.body.date),
        notes: req.body.notes || '',
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense', error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);

    const categoryTotals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    const monthlyTotals = expenses.reduce((acc, item) => {
      const monthKey = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      acc[monthKey] = (acc[monthKey] || 0) + item.amount;
      return acc;
    }, {});

    res.json({ total, categoryTotals, monthlyTotals });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
});

module.exports = router;
