const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "manager_histories";
const DOCUMENT_NAME = "managerHistory";

// Declare the Schema of the Mongo model
var managerHistorySchema = new mongoose.Schema(
  {
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "manager",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

managerHistorySchema.plugin(toJSON);
managerHistorySchema.plugin(paginate);
managerHistorySchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, managerHistorySchema);