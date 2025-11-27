const { Schema, model, Types } = require('mongoose');

const voteSchema = new Schema(
  {
    voterId: {
      type: Types.ObjectId,
      ref: 'Voter',
      required: true,
    },

    electionId: {
      type: Types.ObjectId,
      ref: 'Election',
      required: true,
    },

    // Which candidate(s) this voter picked.
    // For your simple case, this will usually be one element.
    candidateIds: [
      {
        type: Types.ObjectId,
        ref: 'Candidate',
        required: true,
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },

    isValid: {
      type: Boolean,
      default: true,
    },

    sourceIp: {
      type: String,
      trim: true,
    },

    auditId: {
      type: String, // link to AuditEntry if you decide to use it
      trim: true,
    },
  },
  {
    collection: 'votes',
  }
);

// Enforce: one vote per voter per election
voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

module.exports = model('Vote', voteSchema);
