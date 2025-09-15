const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "user_accounts";
const DOCUMENT_NAME = "userAccount";

// Declare the Schema of the Mongo model
var userAccountSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true
    },
    purchase_date: {
      type: Date,
      default: Date.now
    },
    price_paid: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => v ? v.toString() : v
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { getters: true }
  }
);

userAccountSchema.plugin(toJSON);
userAccountSchema.plugin(paginate);
userAccountSchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userAccountSchema);