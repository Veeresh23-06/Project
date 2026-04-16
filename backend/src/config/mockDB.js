// In-memory mock database for when MongoDB is not available
const mockDB = {
  users: [],
  expenses: [],
  nextUserId: 1,
  nextExpenseId: 1,
};

class MockModel {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    return this;
  }
}

const UserModel = {
  async findOne(query) {
    const user = mockDB.users.find((u) => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return user ? new MockModel(user) : null;
  },

  async create(data) {
    const user = {
      _id: `user_${mockDB.nextUserId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDB.users.push(user);
    return new MockModel(user);
  },

  async find(query = {}) {
    return mockDB.users.map((u) => new MockModel(u));
  },

  async updateOne(filter, update) {
    const user = mockDB.users.find((u) => {
      if (filter._id) return u._id === filter._id;
      return false;
    });
    if (user) {
      Object.assign(user, update.$set || update);
      user.updatedAt = new Date();
    }
    return { modifiedCount: user ? 1 : 0 };
  },

  async findOneAndDelete(filter) {
    const index = mockDB.users.findIndex((u) => {
      if (filter._id) return u._id === filter._id;
      return false;
    });
    if (index !== -1) {
      return new MockModel(mockDB.users.splice(index, 1)[0]);
    }
    return null;
  },
};

const ExpenseModel = {
  async findOne(query) {
    const expense = mockDB.expenses.find((e) => {
      if (query._id) return e._id === query._id;
      return false;
    });
    return expense ? new MockModel(expense) : null;
  },

  async create(data) {
    const expense = {
      _id: `expense_${mockDB.nextExpenseId++}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDB.expenses.push(expense);
    return new MockModel(expense);
  },

  async find(query = {}) {
    return mockDB.expenses
      .filter((e) => {
        if (query.user) return e.user === query.user;
        return true;
      })
      .map((e) => new MockModel(e));
  },

  async findByIdAndUpdate(id, update) {
    const expense = mockDB.expenses.find((e) => e._id === id);
    if (expense) {
      Object.assign(expense, update);
      expense.updatedAt = new Date();
    }
    return expense ? new MockModel(expense) : null;
  },

  async findByIdAndDelete(id) {
    const index = mockDB.expenses.findIndex((e) => e._id === id);
    if (index !== -1) {
      return new MockModel(mockDB.expenses.splice(index, 1)[0]);
    }
    return null;
  },
};

module.exports = { UserModel, ExpenseModel, mockDB };
