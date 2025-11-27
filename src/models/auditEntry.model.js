const { Schema, model } = require('mongoose');

const auditEntrySchema = new Schema(
  {
    at: {
      type: Date,
      default: Date.now,
    },

    actor: {
      type: String,
      required: true,
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String, // e.g., "LOGIN", "VOTE_CAST", "RESULTS_VIEW"
      required: true,
      trim: true,
    },

    details: {
      type: String,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'auditEntries',
  }
);

module.exports = model('AuditEntry', auditEntrySchema);
