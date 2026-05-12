const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter valid email"],
    },

    password: {
      type: String,
      minlength: 6,
      required: true,
    },

    image: {
      type: String,
      default: "default.jpg",
    },

    cloudinary_id: {
      type: String,
      default: "ai-generated-8569065_1280.jpg",
    },

    about: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    is_verified: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
