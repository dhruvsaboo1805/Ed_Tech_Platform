const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = reuqire("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, sectionId } = req.body;
    //extract file
    const video = req.files.videoFile;

    //data valid
    if (!title || !timeDuration || !description || !sectionId || !video) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    //upload video url
    const uploadDetials = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //create a sub setion
    const subSectionDetials = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetials.secure_url,
    });
    //create sub section id to section
    const updatedSection = await Section.findByIdAndUpdate(
      { id: sectionId._id },
      {
        $push: {
          subSection: subSectionDetials._id,
        },
      },
      { new: true }
    ).populate({ path: "Section" });
    //todo log updated section here after adding popultae query (done)
    // return res
    return res.status(200).json({
      success: true,
      message: "SubSection Created Successfully",
      updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to create Section",
    });
  }
};

//HW -> updated sub section and delete sub section

exports.UpdateSubSection = async (req, res) => {
  try {
    //data fetch
    const { title, timeDuration, description, sectionId } = req.body;
     //data valid
     if (!title || !timeDuration || !description || !sectionId || !video) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }
    //update wala db me entry push
    const updatedSubSectionData = await SubSection.findByIdAndUpdate(sectionId , {title} , {timeDuration} , {description} , {new:true});
    //return res
    return res.status(200).json({
      success: true,
      message: "SubSection Updated Successfully",
      updatedSubSectionData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to update SubSection",
    });
  }
};

exports.deleteSubSection = async (req , res) => {
  try {
    //data fetch assuming id in param
    const { sectionId } = req.params;
    //db se delete
    await SubSection.findByIdAndDelete(sectionId);
    //todo do we need to delete an entry from post schema in testing
    return res.status(200).json({
      success: true,
      message: "SubSection Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete SubSection",
    });
  }
}
