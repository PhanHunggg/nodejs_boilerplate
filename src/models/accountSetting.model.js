const mongoose = require("mongoose");
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "account_settings";
const DOCUMENT_NAME = "accountSetting";

// Declare the Schema of the Mongo model
var accountSettingSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

accountSettingSchema.plugin(toJSON);
accountSettingSchema.plugin(paginate);
accountSettingSchema.plugin(paginateAgg);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, accountSettingSchema);