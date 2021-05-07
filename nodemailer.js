const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
exports.main = async (email, subject, html) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
        },
    });
    await transporter.sendMail({
        from: 'aneeshpissay997366@gmail.com',
        to: email,
        subject: subject,
        html: html,
  });
}