const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
var varEmail=""
var varLink=""
const sendEmail = async (email, subject, text) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    varEmail=email
    varLink=text

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      html: `<html>
      <head>
      <script type="text/javascript" src="./utils/details.js">
      document.getElementById("resetButton").href = detailsFunction(varEmail,varLink);
      </script>
      </head>
      <body>
        <p>Hi ${email.split('@')[0]},</p>
        <p>You requested to reset your password.</p>
        <p> Please, copy the link below to reset your password</p>
        <a href="${String(varLink)}"> Link </a>
        <p>${varLink}</p>
      </body>
    </html>`
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
    return error;
  }
};

module.exports = sendEmail;