require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const expiresToken = "24h";
const logger = require("../config/logger");
const request = require("request");
const fs = require("fs");
const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
const auth = require("../config/authentification/auth");
const sql = require("../config/sql-database");
const makeRequest = require("./help-function/makeRequest");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

// #region AUTH

router.post("/login", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      return res.json(err);
    }

    conn.query(
      "select * from users WHERE (email = ? or username = ?) AND password = ?",
      [req.body.email, req.body.email, sha1(req.body.password)],
      function (err, rows, fields) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        }

        if (rows.length > 0) {
          if (rows[0].active) {
            const token = generateToken(rows[0]);
            logger.log(
              "info",
              `USER: ${
                req.body.email
              } is LOGIN at ${new Date().toDateString()}.`
            );
            return res.json({
              token: token,
            });
          } else {
            return res.json({
              type: "active",
              value: 0,
            });
          }
        } else {
          return res.json({
            type: "exist",
            value: 0,
          });
        }
      }
    );
  });
});

//#endregion

//#region HELP FUNCTION

function generateToken(data) {
  return jwt.sign(
    {
      user: {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        type: data.type,
      },
      email: data.email,
    },
    process.env.TOKEN_KEY,
    {
      expiresIn: expiresToken,
    }
  );
}

//#endregion
