const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body

    const { email } = req.body;

    const user = User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        messsage: "Your Email is Not Registered",
      });
    }

    // check user if exist and validation
    //token

    const token = crypto.randomUUID();

    // update user by adding token and expire time
    const updateddetails = await User.findOneAndUpdate(
      { email: email },
      {
        token,
        resertPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `https://localhost:3000/update-password/${token}`;
    // send mail with url
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link -> ${url}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully please move forward to change your password",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Reset Link sent Error",
    });
  }
};

// reset password

exports.resertPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password does not match",
      });
    }
    //get user detils using db token
    const userDetails = await User.findOne({ token: token });

    // if no entry invalid token or expires time
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Inalid Token",
      });
    }

    if (userDetails.resertPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is expired , pls re generate it",
      });
    }
    //hash password
    const hashedPassword = bcrypt.hash(password, 10);
    //passqword update

    await User.findByIdAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.sttaus(200).json({
      success: true,
      message: "Password reset Successfull",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Soemthing went wrong while reset password",
    });
  }
};
