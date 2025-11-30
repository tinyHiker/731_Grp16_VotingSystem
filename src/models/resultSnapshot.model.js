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
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'resultSnapshots',
  }
);

const ResultSnapshotModel = model('ResultSnapshot', resultSnapshotSchema);

class ResultSnapshot {
  constructor({
    id = null,
    electionId = null,
    createdAt = null,
    totalsJson = '',
    hash = '',
  } = {}) {
    this.id = id;
    this.electionId = electionId;
    this.createdAt = createdAt;
    this.totalsJson = totalsJson;
    this.hash = hash;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new ResultSnapshot({
      id: doc._id?.toString(),
      electionId: doc.electionId?.toString() || null,
      createdAt: doc.createdAt,
      totalsJson: doc.totalsJson,
      hash: doc.hash,
    });
  }

  toPlainObject() {
    return {
      electionId: this.electionId,
      createdAt: this.createdAt,
      totalsJson: this.totalsJson,
      hash: this.hash,
    };
  }

  async save() {
    const doc = new ResultSnapshotModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.electionId = saved.electionId?.toString() || this.electionId;
    this.createdAt = saved.createdAt || this.createdAt;
    this.totalsJson = saved.totalsJson;
    this.hash = saved.hash;
    return saved;
  }
}

module.exports = ResultSnapshotModel;
module.exports.ResultSnapshot = ResultSnapshot;
