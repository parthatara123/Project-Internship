const CollegeModel = require("../model/collegeModel");
const InternModel = require("../model/internModel");

function isValid(value) {
  if (typeof value == "undefined" || typeof value == null) return false;
  if (typeof value == "String" && value.length === 0) return false;
  return true;
}

const createCollege = async function (req, res) {
  try {
    let inputCollegeData = req.body;
    // validation
    if (Object.keys(inputCollegeData).length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please provide college data in body" });

    if (!isValid(inputCollegeData.name))
      return res
        .status(400)
        .send({ status: false, msg: "College name is required" });
    if (!isValid(inputCollegeData.fullName))
      return res
        .status(400)
        .send({ status: false, msg: "College full name is required" });
    if (!isValid(inputCollegeData.logoLink))
      return res
        .status(400)
        .send({ status: false, msg: "College logo link is required" });

    let nameOfCollege = inputCollegeData.name;

    if (typeof (nameOfCollege == String)) {
      nameOfCollege = nameOfCollege.toLowerCase();
      inputCollegeData.name = nameOfCollege;
    }

    let collegeAlreadyRegistered = await CollegeModel.findOne({
      name: inputCollegeData.name,
    });
    if (collegeAlreadyRegistered)
      return res
        .status(400)
        .send({ status: false, msg: "College is already registered" });

    let newCollege = await CollegeModel.create(inputCollegeData);
    res
      .status(201)
      .send({ status: true, msg: "New college data added", data: newCollege });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const collegeDetail = async function (req, res) {
  try {
    let collageName = req.query;

    if (
      collageName.name == null ||
      collageName.name == "undefined" ||
      collageName.name.trim() == ""
    ) {
      res
        .status(400)
        .send({
          status: false,
          msg: "Valid college is required in query params",
        });
    }

    //Check if college name is available in DB or not

    let isCollegeNameAvailable = await CollegeModel.findOne({
      name: collageName.name,
    }).lean();

    let selectedCollegeDetails = await CollegeModel.findOne({
      name: collageName.name,
    }).select({ name: 1, fullName:1, logoLink:1, _id: 0}).lean();
  
    if (!isCollegeNameAvailable)
      return res
        .status(404)
        .send({ status: false, msg: "No such college is registered" });

    let internsOfThisCollege = await InternModel.find({
      collegeId: isCollegeNameAvailable._id,
    }).select({ name: 1, email:1, mobile:1 });
    console.log(internsOfThisCollege, "2");

    selectedCollegeDetails.intern = internsOfThisCollege
    
    res
      .status(200)
      .send({
        status: true,
        msg: "college details with interns",
        data: selectedCollegeDetails,
      });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
module.exports.createCollege = createCollege;
module.exports.collegeDetail = collegeDetail;
