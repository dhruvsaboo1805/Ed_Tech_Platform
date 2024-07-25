const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createTimeStramp: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// to send emails

async function sendVerificationMail(email, otp) {
  try {
    const Emailresponse = await mailSender(
      email,
      "Verification Email from Study Notion Team",
      otp
    );
    console.log("Email Sent Successfully ", Emailresponse);
  } catch (err) {
    console.log("error occured while accessing mail id");
    console.log("error message is -> ", err);
  }
}

OTPSchema.pre("save", async function (next) {
  await sendVerificationMail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
