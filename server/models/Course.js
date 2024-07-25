const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
   courseName:{
    type:String,
    trim:true,
    required:true,
   },
   courseDescription:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },
   whatYouWillLearn:{
    type:String,
    required:true,
   },
   courseContent:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true,
    }
   ],
   ratingAndReviews:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReviews",
    }
   ],
   price:{
    type:Number,
    required:true,
   },
   thumbnail:{
    type:String,
    required:true,
   },
   Category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:true,
   },
   studentsEnrolled:[
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    }
   ]

});

module.exports = mongoose.model("Course" , CourseSchema);
