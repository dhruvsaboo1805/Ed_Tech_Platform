const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async(req , res , next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Autherisation").replace("Bearer" , "");

        //if token missing
        if(!token){
            return res.status(401).json({
                success:true,
                message:"Token is missing"
            })
        }

        //verify the token

        try{
            const decode = jwt.verify(token , process.env.JWT.SECRET);
            console.log(decode);
            req.user = decode;
        } catch(error){
            return res.status(401).json({
                success:false,
                message:"Token not Verified",
            })
        }

        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        })
    }
}

exports.isStudent = async (req , res , next) => {
    try{
        if(req.user.accounType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student",
            })
        }
        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

exports.isInstructor = async (req , res , next) => {
    try{
        if(req.user.accounType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor",
            })
        }

        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

exports.isAdmin = async (req , res , next) => {
    try{
        if(req.user.accounType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin",
            })
        }
        next();
    } catch(error){
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

