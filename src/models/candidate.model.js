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
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: 'candidates',
  }
);

const CandidateModel = model('Candidate', candidateSchema);

class Candidate {
  constructor({
    id = null,
    electionId = null,
    name = '',
    description = '',
    party = '',
    position = 0,
  } = {}) {
    this.id = id;
    this.electionId = electionId;
    this.name = name;
    this.description = description;
    this.party = party;
    this.position = position;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new Candidate({
      id: doc._id?.toString(),
      electionId: doc.electionId?.toString() || null,
      name: doc.name,
      description: doc.description,
      party: doc.party,
      position: doc.position,
    });
  }

  toPlainObject() {
    return {
      electionId: this.electionId,
      name: this.name,
      description: this.description,
      party: this.party,
      position: this.position,
    };
  }

  async save() {
    const doc = new CandidateModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.electionId = saved.electionId?.toString() || this.electionId;
    return saved;
  }
}

module.exports = CandidateModel;
module.exports.Candidate = Candidate;

