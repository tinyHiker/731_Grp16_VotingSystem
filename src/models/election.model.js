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
      type: String, // "Draft", "Open", "Closed", "Published"
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
      type: String, // e.g. "Plurality"
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

module.exports = model('Election', electionSchema);
module.exports.ELECTION_STATES = ELECTION_STATES;
