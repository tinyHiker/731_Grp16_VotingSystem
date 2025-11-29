const { Schema, model } = require('mongoose');

const electionAdministratorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    collection: 'electionAdministrators',
  }
);

const ElectionAdministratorModel = model(
  'ElectionAdministrator',
  electionAdministratorSchema
);

class ElectionAdministrator {
  constructor({ id = null, name = '', email = '', lastLoginAt = null } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.lastLoginAt = lastLoginAt;
  }

  static fromDocument(doc) {
    if (!doc) return null;

    return new ElectionAdministrator({
      id: doc._id?.toString(),
      name: doc.name,
      email: doc.email,
      lastLoginAt: doc.lastLoginAt || null,
    });
  }

  toPlainObject() {
    return {
      name: this.name,
      email: this.email,
      lastLoginAt: this.lastLoginAt,
    };
  }

  async save() {
    const doc = new ElectionAdministratorModel(this.toPlainObject());
    const saved = await doc.save();
    this.id = saved._id.toString();
    this.lastLoginAt = saved.lastLoginAt || this.lastLoginAt;
    return saved;
  }
}

module.exports = ElectionAdministratorModel;
module.exports.ElectionAdministrator = ElectionAdministrator;
