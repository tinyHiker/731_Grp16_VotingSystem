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
      type: String,
      trim: true,
    },
  },
  {
    collection: 'votes',
  }
);

voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

const VoteModel = model('Vote', voteSchema);

class Vote {
  constructor({
    id = null,
    voterId = null,
    electionId = null,
    candidateIds = [],
    createdAt = null,
    isValid = true,
    sourceIp = '',
    auditId = '',
  } = {}) {
    this.id = id;
    this.voterId = voterId;
    this.electionId = electionId;
    this.candidateIds = candidateIds;
    this.createdAt = createdAt;
    this.isValid = isValid;
    this.sourceIp = sourceIp;
    this.auditId = auditId;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new Vote({
      id: doc._id?.toString(),
      voterId: doc.voterId?.toString() || null,
      electionId: doc.electionId?.toString() || null,
      candidateIds: Array.isArray(doc.candidateIds)
        ? doc.candidateIds.map((id) => id?.toString())
        : [],
      createdAt: doc.createdAt,
      isValid: doc.isValid,
      sourceIp: doc.sourceIp,
      auditId: doc.auditId,
    });
  }

  toPlainObject() {
    return {
      voterId: this.voterId,
      electionId: this.electionId,
      candidateIds: this.candidateIds,
      createdAt: this.createdAt,
      isValid: this.isValid,
      sourceIp: this.sourceIp,
      auditId: this.auditId,
    };
  }

  async save() {
    const doc = new VoteModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.voterId = saved.voterId?.toString() || this.voterId;
    this.electionId = saved.electionId?.toString() || this.electionId;
    this.candidateIds = Array.isArray(saved.candidateIds)
      ? saved.candidateIds.map((id) => id?.toString())
      : this.candidateIds;
    this.createdAt = saved.createdAt || this.createdAt;
    this.isValid = saved.isValid;
    this.sourceIp = saved.sourceIp;
    this.auditId = saved.auditId;
    return saved;
  }
}

module.exports = VoteModel;
module.exports.Vote = Vote;
