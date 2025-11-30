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
      type: String,
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

const AuditEntryModel = model('AuditEntry', auditEntrySchema);

class AuditEntry {
  constructor({
    id = null,
    at = null,
    actor = '',
    action = '',
    type = '',
    details = '',
    ipAddress = '',
  } = {}) {
    this.id = id;
    this.at = at;
    this.actor = actor;
    this.action = action;
    this.type = type;
    this.details = details;
    this.ipAddress = ipAddress;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new AuditEntry({
      id: doc._id?.toString(),
      at: doc.at,
      actor: doc.actor,
      action: doc.action,
      type: doc.type,
      details: doc.details,
      ipAddress: doc.ipAddress,
    });
  }

  toPlainObject() {
    return {
      at: this.at,
      actor: this.actor,
      action: this.action,
      type: this.type,
      details: this.details,
      ipAddress: this.ipAddress,
    };
  }

  async save() {
    const doc = new AuditEntryModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.at = saved.at || this.at;
    return saved;
  }
}

module.exports = AuditEntryModel;
module.exports.AuditEntry = AuditEntry;

