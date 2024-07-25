const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary } = require("../utils/ImageUploader");

//create course
exports.createCourse = async (req, res) => {
  try {
    // fetch all data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // fetch file
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "Fill all the entries",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("instructor details", instructorDetails);

    //TODO verify that above bith ids are same or different

    if (!instructorDetails) {
      return res.status(400).json({
        success:false,
        message:"Instructor details not found"
      });
    }

    //check given tag is valid
    const tagDetails = await Category.findById(tag);
    if(!tagDetails)
        {
            return res.status(400).json({
                success:false,
                message:"Tag details not found"
              });
        }
    
    //upload image

    const thumbNailImage = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);

    //create an entry for new course
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor : instructorDetails._id,
        whatYouWillLearn : whatYouWillLearn,
        price,
        Category: tagDetails._id,
        thumbnail:thumbNailImage.secure_url,
    })

    //user update (instructior)
    await User.findByIdAndUpdate({id : instructorDetails._id} , {
        $push:{
            courses: newCourse._id,
        }
    } , {new:true});

    //update the tag schema hw
    await Category.findByIdAndUpdate({id : tagDetails._id} , {
        $push:{
            courses:newCourse._id,
        }
    } , {new:true});

    //return response
    return res.status(200).json({
        success:true,
        message:"Course Created Successfully",
        data:newCourse,
    })


  } catch (err) {
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"Course Creation Error",
        error:err.message,
    })
  }
};

// get all course

exports.getAllCourses = async (req , res) => {
    try{
        const allCourse = await Course.find({} , {courseName:true, price:true, thumbnail:true, instructor:true, ratingAndReviews:true,studentEnrolled:true}).populate("Instructor").exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses",
            data:allCourse,
        })

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cannot Fetch Course Data",
            error:err.message,
        })
    }
}