const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "categories";
const DOCUMENT_NAME = "category";

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);
categorySchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, categorySchema);