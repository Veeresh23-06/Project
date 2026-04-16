const mongoose = require('mongoose');
const { ExpenseModel: MockExpenseModel } = require('../config/mockDB');

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

let Expense;
try {
  Expense = mongoose.model('Expense', expenseSchema);
} catch {
  // Model already exists
  Expense = mongoose.model('Expense');
}

// Create a proxy that falls back to mock database if mongoose is not connected
const ExpenseProxy = {
  findOne: (query) => {
    if (mongoose.connection.readyState === 1) {
      return Expense.findOne(query);
    }
    return MockExpenseModel.findOne(query);
  },
  create: (data) => {
    if (mongoose.connection.readyState === 1) {
      return Expense.create(data);
    }
    return MockExpenseModel.create(data);
  },
  find: (query) => {
    if (mongoose.connection.readyState === 1) {
      return Expense.find(query);
    }
    return MockExpenseModel.find(query);
  },
  findByIdAndUpdate: (id, update) => {
    if (mongoose.connection.readyState === 1) {
      return Expense.findByIdAndUpdate(id, update);
    }
    return MockExpenseModel.findByIdAndUpdate(id, update);
  },
  findByIdAndDelete: (id) => {
    if (mongoose.connection.readyState === 1) {
      return Expense.findByIdAndDelete(id);
    }
    return MockExpenseModel.findByIdAndDelete(id);
  },
};

module.exports = ExpenseProxy;
