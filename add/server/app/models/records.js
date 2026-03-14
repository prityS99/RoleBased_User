const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  created_at: {
    type: Date,
    default: Date.now
  },

  updated_at: {
    type: Date
  }

});

module.exports = mongoose.model("record", recordSchema);