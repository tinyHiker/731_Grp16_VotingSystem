const { Schema, model, Types } = require('mongoose');

const resultSnapshotSchema = new Schema(
  {
    electionId: {
      type: Types.ObjectId,
      ref: 'Election',
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    totalsJson: {
      type: String, // serialized results, e.g. JSON.stringify({ candidateId: count })
      required: true,
    },

    hash: {
      type: String, // integrity check (e.g., hash of totalsJson)
      required: true,
    },
  },
  {
    collection: 'resultSnapshots',
  }
);

module.exports = model('ResultSnapshot', resultSnapshotSchema);
