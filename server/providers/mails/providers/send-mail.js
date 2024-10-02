require("dotenv").config();
var nodemailer = require("nodemailer");
var fs = require("fs");
var hogan = require("hogan.js");
const logger = require("../../config/logger");
var fs = require("fs");

var smtpTransport = nodemailer.createTransport({
  host: process.env.smtp_host,
  port: process.env.smtp_port,
  secure: process.env.secure,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.smtp_user,
    pass: process.env.smtp_pass,
  },
});

async function sendMail(to, subject, message, template = false, res) {
  if (template) {
    var emailTemplate = fs.readFileSync(
      "./providers/mails/mail_templates/" + template,
      "utf-8"
    );
    var hoganTemplate = hogan.compile(emailTemplate);
    var mailOptions = {
      from: '"Fischereiverband"' + process.env.smtp_user,
      to: to,
      subject: subject,
      html: hoganTemplate.render(message),
    };
  } else {
    var mailOptions = {
      from: '"Fischereiverband"' + process.env.smtp_user,
      to: to,
      subject: subject,
      text: message,
    };
  }
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      logger.log("error", `${to}: ${error}`);
      res.send(false);
    } else {
      logger.log("info", `Sent mail to: ${to}`);
      res.send(true);
    }
  });
}

module.exports = sendMail;
