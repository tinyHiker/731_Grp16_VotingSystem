const { Schema, model } = require('mongoose');

const voterSchema = new Schema(
  {
    // Login identity: e.g. student/employee number
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // For real use, store a hash. For now you can keep plain text during development.
    passwordHash: {
      type: String,
      required: true,
    },

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

    hasVoted: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String, // "Active", "Revoked"
      enum: ['Active', 'Revoked'],
      default: 'Active',
    },

    lastLoginAt: {
      type: Date,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'voters',
  }
);

module.exports = model('Voter', voterSchema);
