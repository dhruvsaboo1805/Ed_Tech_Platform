const User = require("../models/User");
const Profile = require("../models/Profile");

exports.updateProtfolio = async (req, res) => {
  try {
    //hw how toschedule any request in backend
    //data fetch
    const { gender, dateofBirth, about, contactNumber } = req.body;
    //user id lelo
    const id = req.user.id;
    //data validate
    if (!about || !gender || !dateofBirth || !contactNumber || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields should be filled",
      });
    }
    //find and update on profile
    const userDetials = await User.findById(id);
    if (!userDetials) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profileId = userDetials.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profileDetails.dateofBirth = dateofBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();
    //user me also update -> TODO (done)
    await User.findByIdAndUpdate(id , {additionalDetails : profileDetails} , {new:true});
    //return res
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      profileDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Profile Updation Error",
      error: err.message,
    });
  }
};

exports.deleteProfileAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validate
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id fetching error",
      });
    }
    //delete profile
    const userDetials = await User.findById(id);
    if (!userDetials) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const profileId = userDetials.additionalDetails;
    await Profile.findByIdAndDelete({ _id: profileId }); /// check karna padenga
    //delet user
    await User.findByIdAndDelete({ _id: id });
    //HW total students count se bhi minus karo (doubt)
    // await User.findOneAndUpdate({}, { $inc: { count: -1 } });  (doubt)

    // return res
    return res.status(200).json({
      success: true,
      message: "User Profile Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User Deletion Error",
      error: err.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    //validate
    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    //return res
    return res.status(200).json({
        success:true,
        message:"All Users Data given Successfully",
        userDetails,
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Get all UserDetails Error",
      error: err.message,
    });
  }
};
