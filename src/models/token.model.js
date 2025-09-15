const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const COLLECTION_NAME = 'tokens';
const DOCUMENT_NAME = 'token';

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
      type: String,
      enum: ['access', 'refresh', 'reset_password'],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Add plugin that converts mongoose to JSON
tokenSchema.plugin(toJSON);

/**
 * Create a new token index that expires at the specified date
 */
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

/**
 * @typedef Token
 */
const Token = mongoose.model(DOCUMENT_NAME, tokenSchema);

module.exports = Token;