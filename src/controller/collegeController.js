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
    let inputQuery = req.query;

    
    if (Object.keys(inputQuery).length > 0)
      return res
        .status(400)
        .send({
          Status: false,
          msg: "Please provide input in body instead of query params.",
        });
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

    if (!(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(inputCollegeData.logoLink))) {
      res
        .status(400)
        .send({ Status: false, msg: "Please provide valid logo link" });
    }

    let nameOfCollege = inputCollegeData.name;

    if (typeof (nameOfCollege == String)) {
      nameOfCollege = nameOfCollege.toLowerCase();
      inputCollegeData.name = nameOfCollege;
    }

    let collegeAlreadyRegistered = await CollegeModel.findOne({
      name: inputCollegeData.name,
      isDeleted: false,
    });
    if (collegeAlreadyRegistered)
      return res
        .status(400)
        .send({ status: false, msg: "College is already registered" });

    let logoLinkAlreadyUsed = await CollegeModel.find({logoLink: inputCollegeData.logoLink})

      if(logoLinkAlreadyUsed.length !== 0) return res.status(400).send({status: false, msg: "Logo link is already used"})

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
    let inputBody = req.body

    if(Object.keys(inputBody).length > 0) return res.status(400).send({Status: false, msg: "Input in body is not valid, please provide collage name in query params"})
    
    if (
      collageName.name == null ||
      collageName.name == "undefined" ||
      collageName.name.trim() == ""
    ) {
      res.status(400).send({
        status: false,
        msg: "Valid college name is required in query params",
      });
    }

    //Check if college name is available in DB or not

    let isCollegeNameAvailable = await CollegeModel.findOne({
      name: collageName.name,
      isDeleted: false,
    }).lean();

    let selectedCollegeDetails = await CollegeModel.findOne({
      name: collageName.name,
      isDeleted: false,
    })
      .select({ name: 1, fullName: 1, logoLink: 1, _id: 0 })
      .lean();

    if (!isCollegeNameAvailable)
      return res
        .status(404)
        .send({ status: false, msg: "No such college is registered" });

    let internsOfThisCollege = await InternModel.find({
      collegeId: isCollegeNameAvailable._id,
      isDeleted: false,
    }).select({ name: 1, email: 1, mobile: 1 });

    selectedCollegeDetails.intern = internsOfThisCollege;

    res.status(200).send({
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