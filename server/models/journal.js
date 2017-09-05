const mongoose = require("mongoose");

const JournalSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  entry: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Journal", JournalSchema);
