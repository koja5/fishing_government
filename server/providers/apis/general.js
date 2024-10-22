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

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

//#region SETTINGS

router.get("/getMyProfile", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where id = ?",
          [req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.post("/saveProfile", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "update users set ? where id = ?",
      [req.body, req.user.user.id],
      function (err, rows, fields) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        } else {
          res.json(true);
        }
      }
    );
  });
});

router.post("/changePassword", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "select * from users where password = ? and email = ?",
      [sha1(req.body.oldPassword), req.user.email],
      function (err, rows, fields) {
        if (err) {
          res.json(true);
        } else {
          if (rows.length) {
            conn.query(
              "update users set password = ? where email = ?",
              [sha1(req.body.newPassword), req.user.email],
              function (err, rows, fields) {
                conn.release();
                if (err) {
                  res.json(false);
                } else {
                  res.json(true);
                }
              }
            );
          } else {
            conn.release();
            res.json(false);
          }
        }
      }
    );
  });
});

//#endregion SETTINGS

//#endregion
