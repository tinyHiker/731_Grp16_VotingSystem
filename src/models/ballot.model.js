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

const BallotModel = model('Ballot', ballotSchema);

class Ballot {
  constructor({
    id = null,
    electionId = null,
    style = '',
    issuedAt = null,
    submittedAt = null,
    status = 'NotIssued',
  } = {}) {
    this.id = id;
    this.electionId = electionId;
    this.style = style;
    this.issuedAt = issuedAt;
    this.submittedAt = submittedAt;
    this.status = status;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new Ballot({
      id: doc._id?.toString(),
      electionId: doc.electionId?.toString() || null,
      style: doc.style,
      issuedAt: doc.issuedAt || null,
      submittedAt: doc.submittedAt || null,
      status: doc.status,
    });
  }

  toPlainObject() {
    return {
      electionId: this.electionId,
      style: this.style,
      issuedAt: this.issuedAt,
      submittedAt: this.submittedAt,
      status: this.status,
    };
  }

  async save() {
    const doc = new BallotModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.electionId = saved.electionId?.toString() || this.electionId;
    this.issuedAt = saved.issuedAt || this.issuedAt;
    this.submittedAt = saved.submittedAt || this.submittedAt;
    this.status = saved.status;
    return saved;
  }
}

module.exports = BallotModel;
module.exports.BALLOT_STATUSES = BALLOT_STATUSES;
module.exports.Ballot = Ballot;
