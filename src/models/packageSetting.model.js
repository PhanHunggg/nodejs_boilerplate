const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "package_settings";
const DOCUMENT_NAME = "packageSetting";

// Declare the Schema of the Mongo model
var packageSettingSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => v ? v.toString() : v
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: { getters: true }
  }
);

packageSettingSchema.plugin(toJSON);
packageSettingSchema.plugin(paginate);
packageSettingSchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, packageSettingSchema);