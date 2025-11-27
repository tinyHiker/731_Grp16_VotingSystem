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

module.exports = model('ElectionAdministrator', electionAdministratorSchema);
