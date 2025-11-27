const { Schema, model, Types } = require('mongoose');

const candidateSchema = new Schema(
  {
    electionId: {
      type: Types.ObjectId,
      ref: 'Election',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    party: {
      type: String,
      trim: true,
    },

    position: {
      type: Number, // ordering within election/ballot
      required: true,
      min: 0,
    },
  },
  {
    collection: 'candidates',
  }
);

module.exports = model('Candidate', candidateSchema);
