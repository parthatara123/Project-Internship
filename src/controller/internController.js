const InternModel = require("../model/internModel");
const CollegeModel = require("../model/collegeModel");

function isValid(value) {
  if (typeof value == "undefined" || typeof value == null) return false;
  if (typeof value == "String" && value.length === 0) return false;
  return true;
}

const createIntern = async function (req, res) {
  try {
    let internData = req.body;

    //Validation
    if (Object.keys(internData).length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please provide Intern data in body" });

    //{ name, mobile, email, collegeId}
    if (!isValid(internData.name))
      return res
        .status(400)
        .send({ status: false, msg: "Intern name is required" });
    if (!isValid(internData.mobile))
      return res
        .status(400)
        .send({ status: false, msg: "Intern mobile number is required" });
    if (!isValid(internData.email))
      return res
        .status(400)
        .send({ status: false, msg: "Intern email id is required" });
    if (!isValid(internData.collegeId))
      return res
        .status(400)
        .send({ status: false, msg: "Intern collage id is required" });

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(internData.email))
      return res
        .status(400)
        .send({ status: false, message: "enter a valid email" });

    let isEmailAlreadyUsed = await InternModel.findOne({
      email: internData.email,
    });
    if (isEmailAlreadyUsed)
      return res
        .status(400)
        .send({ status: false, msg: "Email already registered" });
    let isMobileAlreadyUsed = await InternModel.findOne({
      mobile: internData.mobile,
    });
    if (isMobileAlreadyUsed)
      return res
        .status(400)
        .send({ status: false, msg: "Mobile number already registered" });

    let isCollegeIdAvailable = await CollegeModel.findById(internData.collegeId);

    if (!isCollegeIdAvailable)
      return res
        .status(404)
        .send({ status: false, msg: "Your collage id is not registered" });

    let newIntern = await InternModel.create(internData);
    res.status(201).send({
      status: true,
      msg: "New intern successfully registered",
      data: newIntern,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports.createIntern = createIntern;
