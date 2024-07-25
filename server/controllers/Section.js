const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    //data valid
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required*",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    ////update course
    const UpdatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ) .populate({
      path: 'Section',
      populate: {
        path: 'SubSection',
      },
    });
    //todo poplulate both section and sub section in updated course details (done)
    //return res

    return res.statsu(200).json({
      success: true,
      message: "Section Created Successfully",
      UpdatedCourseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId } = req.body;
    //data valid
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required*",
      });
    }
    //update data
    const updatedSectionDetials = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Section Details Updated Successfully",
      updatedSectionDetials,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    //data fetch assuming id in param
    const { sectionId } = req.params;
    //db se delete
    await Section.findByIdAndDelete(sectionId);
    //todo do we need to delete an entry from post schema in testing
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section",
    });
  }
};

