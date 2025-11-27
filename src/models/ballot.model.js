const { Schema, model, Types } = require('mongoose');

const BALLOT_STATUSES = ['NotIssued', 'Issued', 'Submitted'];

const ballotSchema = new Schema(
  {
    electionId: {
      type: Types.ObjectId,
      ref: 'Election',
      required: true,
    },

    style: {
      type: String,
      trim: true,
    },

    issuedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: BALLOT_STATUSES,
      default: 'NotIssued',
    },
  },
  {
    collection: 'ballots',
  }
);

module.exports = model('Ballot', ballotSchema);
module.exports.BALLOT_STATUSES = BALLOT_STATUSES;
