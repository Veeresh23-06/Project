const mongoose = require('mongoose');
const { UserModel: MockUserModel } = require('../config/mockDB');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

let User;
try {
  User = mongoose.model('User', userSchema);
} catch {
  // Model already exists
  User = mongoose.model('User');
}

// Create a proxy that falls back to mock database if mongoose is not connected
const UserProxy = {
  findOne: (query) => {
    if (mongoose.connection.readyState === 1) {
      return User.findOne(query);
    }
    return MockUserModel.findOne(query);
  },
  create: (data) => {
    if (mongoose.connection.readyState === 1) {
      return User.create(data);
    }
    return MockUserModel.create(data);
  },
  find: (query) => {
    if (mongoose.connection.readyState === 1) {
      return User.find(query);
    }
    return MockUserModel.find(query);
  },
  updateOne: (filter, update) => {
    if (mongoose.connection.readyState === 1) {
      return User.updateOne(filter, update);
    }
    return MockUserModel.updateOne(filter, update);
  },
  findOneAndDelete: (filter) => {
    if (mongoose.connection.readyState === 1) {
      return User.findOneAndDelete(filter);
    }
    return MockUserModel.findOneAndDelete(filter);
  },
};

module.exports = UserProxy;
