const { Schema, model } = require('mongoose');

const voterSchema = new Schema(
  {
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

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
      type: String,
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

const VoterModel = model('Voter', voterSchema);

class Voter {
  constructor({
    id = null,
    idNumber = '',
    passwordHash = '',
    name = '',
    email = '',
    hasVoted = false,
    status = 'Active',
    lastLoginAt = null,
    failedAttempts = 0,
  } = {}) {
    this.id = id;
    this.idNumber = idNumber;
    this.passwordHash = passwordHash;
    this.name = name;
    this.email = email;
    this.hasVoted = hasVoted;
    this.status = status;
    this.lastLoginAt = lastLoginAt;
    this.failedAttempts = failedAttempts;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new Voter({
      id: doc._id?.toString(),
      idNumber: doc.idNumber,
      passwordHash: doc.passwordHash,
      name: doc.name,
      email: doc.email,
      hasVoted: doc.hasVoted,
      status: doc.status,
      lastLoginAt: doc.lastLoginAt || null,
      failedAttempts: doc.failedAttempts,
    });
  }

  toPlainObject() {
    return {
      idNumber: this.idNumber,
      passwordHash: this.passwordHash,
      name: this.name,
      email: this.email,
      hasVoted: this.hasVoted,
      status: this.status,
      lastLoginAt: this.lastLoginAt,
      failedAttempts: this.failedAttempts,
    };
  }

  async save() {
    const doc = new VoterModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.hasVoted = saved.hasVoted;
    this.status = saved.status;
    this.lastLoginAt = saved.lastLoginAt || this.lastLoginAt;
    this.failedAttempts = saved.failedAttempts;
    return saved;
  }
}

module.exports = VoterModel;
module.exports.Voter = Voter;
