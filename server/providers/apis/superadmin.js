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
const auth = require("../config/authentification/auth-superadmin");
const sql = require("../config/sql-database");
const makeRequest = require("./help-function/makeRequest");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

//#region USERS

router.get("/getAllUsers", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query("select * from users", function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.post("/setUser", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    if (isValidSHA1(req.body.password)) {
      req.body.password = sha1(req.body.password);
    }

    conn.query(
      "INSERT INTO users set ? ON DUPLICATE KEY UPDATE ?",
      [req.body, req.body],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.post("/generateNewPassword", auth, function (req, res) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    const newPassword = Math.random().toString(36).slice(-8);

    conn.query(
      "update users set password = ? where id = ?",
      [sha1(newPassword), req.body.id],
      function (err, rows) {
        conn.release();
        if (!err) {
          req.body.password = newPassword;

          makeRequest(req.body, "mail/sendNewGeneratedPassword", res);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

//#endregion

//#region HELP FUNCTION

function isValidSHA1(s) {
  return s.indexOf("^[a-fA-F0-9]{40}$") == 1;
}

//#endregion
