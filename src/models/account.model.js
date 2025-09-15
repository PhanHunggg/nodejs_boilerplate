const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "accounts";
const DOCUMENT_NAME = "account";

// Declare the Schema of the Mongo model
var accountSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true
    },
    setting_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accountSetting",
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => v ? v.toString() : v
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved', 'inactive'],
      default: 'available'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { getters: true }
  }
);

accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);
accountSchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, accountSchema);