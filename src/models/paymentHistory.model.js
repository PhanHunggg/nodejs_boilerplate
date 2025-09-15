const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "payment_histories";
const DOCUMENT_NAME = "paymentHistory";

// Declare the Schema of the Mongo model
var paymentHistorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packageSetting",
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'other'],
      required: true
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => v ? v.toString() : v
    },
    method: {
      type: String,
      required: true
    },
    transaction_id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { getters: true }
  }
);

paymentHistorySchema.plugin(toJSON);
paymentHistorySchema.plugin(paginate);
paymentHistorySchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, paymentHistorySchema);