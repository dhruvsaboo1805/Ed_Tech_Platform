const nodeemailer = require("nodemailer");

const mailSender = async(email , title , body) => {
    try{
        let transporter = nodeemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASSWORD,
            }
        })

        let info = await transporter.sendMail({
            from: 'Study Notion from Dhruv Saboo',
            to:`${email}`,
            subject:`${title}`,
            html:`<p>${body}</p>`
        })

        console.log(info);
        return info;

    } catch(err){
        console.log("Email transmit Error");
        console.log("error message is -> " , err)
    }
};

module.exports = mailSender;