const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    is_delete: {
      type: Boolean,
      default: false,
    },

    createdOn: {
      type: Date,
      default: new Date(),
    },

    updatedOn: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
  },
);

const BlogModel = mongoose.model("blog", BlogSchema);

module.exports = BlogModel;
