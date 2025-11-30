const { Schema, model } = require('mongoose');

const ELECTION_STATES = ['Draft', 'Open', 'Closed', 'Published'];

const electionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      enum: ELECTION_STATES,
      default: 'Draft',
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    tallyRule: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    collection: 'elections',
  }
);

const ElectionModel = model('Election', electionSchema);

class Election {
  constructor({
    id = null,
    name = '',
    description = '',
    state = 'Draft',
    startTime = null,
    endTime = null,
    tallyRule = '',
    createdAt = null,
    publishedAt = null,
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.state = state;
    this.startTime = startTime;
    this.endTime = endTime;
    this.tallyRule = tallyRule;
    this.createdAt = createdAt;
    this.publishedAt = publishedAt;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new Election({
      id: doc._id?.toString(),
      name: doc.name,
      description: doc.description,
      state: doc.state,
      startTime: doc.startTime,
      endTime: doc.endTime,
      tallyRule: doc.tallyRule,
      createdAt: doc.createdAt,
      publishedAt: doc.publishedAt || null,
    });
  }

  toPlainObject() {
    return {
      name: this.name,
      description: this.description,
      state: this.state,
      startTime: this.startTime,
      endTime: this.endTime,
      tallyRule: this.tallyRule,
      createdAt: this.createdAt,
      publishedAt: this.publishedAt,
    };
  }

  async save() {
    const doc = new ElectionModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.createdAt = saved.createdAt;
    this.publishedAt = saved.publishedAt || this.publishedAt;
    return saved;
  }
}

module.exports = ElectionModel;
module.exports.ELECTION_STATES = ELECTION_STATES;
module.exports.Election = Election;
