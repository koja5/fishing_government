require("dotenv").config();
var express = require("express");
var nodemailer = require("nodemailer");
var router = express.Router();
var hogan = require("hogan.js");
var fs = require("fs");
const logger = require("../config/logger");
const sendMail = require("./providers/send-mail");
const sha1 = require("sha1");

module.exports = router;

var smtpTransport = nodemailer.createTransport({
  host: process.env.smtp_host,
  port: process.env.smtp_port,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.smtp_user,
    pass: process.env.smtp_pass,
  },
});

//#region SUPERADMIN

router.post("/sendNewGeneratedPassword", function (req, res, next) {
  var configuration = JSON.parse(
    fs.readFileSync(
      __dirname + "/i18n/send_new_generated_password.json",
      "utf-8"
    )
  );

  let subject = configuration.language.de.subject;
  let body = configuration.language.de.body;

  body.greetings = body.greetings.replaceAll("#name", req.body.firstname);

  body["loginLinkNow"] = process.env.link_client + "auth/login";

  body["password"] = req.body.password;

  sendMail(req.body.email, subject, body, configuration.template, res);
});

//#endregion

//#region AUTH

router.post("/resetPasswordLink", function (req, res, next) {
  var configuration = JSON.parse(
    fs.readFileSync(__dirname + "/i18n/forgot_password.json", "utf-8")
  );

  body = getMessage(configuration, req.body.lang);

  // generate reset password
  body["reset_password_link"] =
    process.env.link_client +
    "auth/reset-password/" +
    sha1(req.body.email.toLowerCase());

  sendMail(
    req.body.email,
    getSubject(configuration, req.body.lang),
    body,
    configuration.template,
    res
  );
});

//#endregion

//#region HELPFUL SERVICE

function getSubject(configuration, lang) {
  if (lang) {
    return configuration.language[lang].subject;
  } else {
    return configuration.language.de.subject;
  }
}

function getMessage(configuration, lang) {
  if (lang) {
    return configuration.language[lang].body;
  } else {
    return configuration.language.de.body;
  }
}

//#endregion
