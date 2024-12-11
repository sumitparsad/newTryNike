const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;