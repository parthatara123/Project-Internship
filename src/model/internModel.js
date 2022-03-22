mongoose = require("mongoose");
ObjectId = mongoose.Schema.Types.ObjectId;

let validateEmail = function (email) {
  let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(email);
};

const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Intern name is required",
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  mobile: {
    type: String,
    unique: true,
    required: "Mobile number is required",
  },
  collegeId: {
    type: ObjectId,
    ref: "College",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Intern", internSchema);
