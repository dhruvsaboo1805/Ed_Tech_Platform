const User = require("../models/User");
const OTP = require("../models/OTP");
const otp_generator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//send OTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;

    // check if user present
    const checkUserPresent = await User.findOne(email);

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Exist",
      });
    }

    //generrate otp
    var otp = otp_generator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated -> ", otp);

    //check unique otp
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otp_generator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry in DB for otp

    const otpBody = await OTP.create(otpPayload);
    console.log("otpbody", otpBody);

    res.status(200).json({
      sucess: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "OTP Sending Error",
    });
  }
};

//sign up

exports.SignUp = async (req, res) => {
  try {
    // data fetch from req.body

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate karlo
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "Something missing out in filling the form",
      });
    }
    // 2 password match karo

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "password and confirmPassword must be same",
      });
    }
    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User is already existing",
      });
    }

    // otp de do most recent
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOTP);

    if (recentOTP.length === 0) {
      return res.status(401).json({
        success: false,
        message: "OTP Not Found",
      });
    } else if (otp !== recentOTP.otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // db entry

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails:profileDetails._id,
      image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res.status(200).json({
        success:true,
        message:"User Signed Up Successfully",
    })
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "User cannot be registered please try again",
    });
  }
};

// login

exports.login = async (req , res) => {
    try{
        const {email , password} = req.body;
        // validtae data
        if(!email || !password)
            {
                return res.status(403).json({
                    success:false,
                    message:"All fields should be entered",
                })
            }
        //user not registered ??
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered please Sign Up First",
            })
        }

        //token generate after match of password
        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email : user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expipresIn:"2h",
            })

            user.token = token;
            user.password = undefined;
            //cookie

            const options = {
                expiresIn:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token" , token , options).sttaus(200).json({
                success:true,
                token,
                user,
                message:"Logged In Successfully",
            })

        } else{
            return res.status(401).json({
                success:false,
                message:"Password is inCorrect",
            })
        }

    } catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Login Fal=ilure , Please LogIn Again",
        })
    }
}


//change password
exports.changePassword = async (req , res) => {
    try{
        // get the data from req.body
        //get oldPassword , newPassword , confirmNew Password
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.id;
        console.log("user id -> " , userId);
        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(401).json({
              success: false,
              message: "All fields are required",
            });
          }
        
          if (newPassword !== confirmNewPassword) {
            return res.status(401).json({
              success: false,
              message: "New password and confirm password must match",
            });
          }
      
          const user = await User.findById(userId);

          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          const isMatch = await bcrypt.compare(oldPassword, user.password);

          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: "Old password is incorrect",
            });
          }


        // update passsord on db
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        //send email
        await mailSender(user.email , "Password Changed Successfully" , "Now you can login with your new password");
        // return response

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
          });
    } catch(error){
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error changing password, please try again",
        });
    }
}