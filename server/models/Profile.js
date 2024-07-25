const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateofBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        tupe:String,
        trim:true,
    }
});

module.exports = mongoose.model("Profile" , ProfileSchema);
