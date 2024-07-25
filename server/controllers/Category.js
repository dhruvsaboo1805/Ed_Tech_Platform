const Category = require("../models/Category");

// craete tag handler fuction

exports.CreateTag = async (req , res) => {
    try{
        const {name , description} = req.body;

        // validation
        if(!name || !description)
            {
                return res.status(401).json({
                    success:false,
                    message:"All Fields are required",
                })
            }
        
        // ceate entry in db
        const tagDetails = await Category.create({
            name:mane,
            description:description,
        })

        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
        })
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"Tag creation error",
        })
    }
}

exports.GetAllTags = async (req , res) => {
    try{
        const allTags = await Category.find({} , {name:true , description:true});

        req.status(200).json({
            success:true,
            message:"All Tags given Successfully",
        })
    } catch(error) {
        return res.status(401).json({
            success:false,
            message:"get all Tags error",
        })
    }
}