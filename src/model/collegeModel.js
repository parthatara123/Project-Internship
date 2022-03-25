const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "College name is required",
    unique: true,
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: "College full name is required",
    trim: true,
  },
  logoLink: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});


module.exports = mongoose.model('College', collegeSchema)