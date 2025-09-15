const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "managers";
const DOCUMENT_NAME = "manager";

// Declare the Schema of the Mongo model
var managerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'support', 'accountant'],
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

managerSchema.plugin(toJSON);
managerSchema.plugin(paginate);
managerSchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, managerSchema);