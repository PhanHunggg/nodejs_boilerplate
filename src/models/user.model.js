const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require('bcrypt');
const { toJSON, paginate, paginateAgg } = require('../plugins');
const COLLECTION_NAME = "users";
const DOCUMENT_NAME = "user";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      private: true,
      select: false
    },
    balance: {
      type: Number,
      default: 0
    },
    refId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(paginateAgg);

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
