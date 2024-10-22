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
const auth = require("../config/authentification/auth-admin");
const sql = require("../config/sql-database");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

//#region Inspectors

router.get("/getAllFsdOrgans", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select distinct fo.*, b.bh from fsd_organs fo join bestellungen b on fo.fsd_id = b.fsd_id where fo.sperre = 0 and fo.todesfall = 0 group by fo.id",
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

router.get("/filterFsdOrgan", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let defaultSelection = "select distinct fo.*, b.bh";

        let query =
          " from fsd_organs fo join bestellungen b on fo.fsd_id = b.fsd_id ";

        if (req.query.bh != "null" && req.query.fbz != "null") {
          query +=
            " join FBZ_linked_to_Bestellungen fbz_link on b.UniID = fbz_link.UniID_link";
          query +=
            " where b.bh = '" +
            req.query.bh +
            "' and fbz_link.FBZ='" +
            req.query.fbz +
            "'";
        } else if (req.query.bh != "null" && req.query.fbz == "null") {
          query += " where b.bh = '" + req.query.bh + "'";
        } else if (req.query.bh == "null" && req.query.fbz != "null") {
          defaultSelection += " , fbz_link.fbz";
          query +=
            " join FBZ_linked_to_Bestellungen fbz_link on b.UniID = fbz_link.UniID_link";
          query += " where fbz_link.FBZ = '" + req.query.fbz + "'";
        } else {
          query =
            " from fsd_organs fo join bestellungen b on fo.fsd_id = b.fsd_id";
        }

        query = defaultSelection + query;

        query += " group by fo.fsd_id";

        conn.query(query, function (err, rows, fields) {
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

router.post("/exportBirthdayAndFortbildung", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        let whereQuery = "";
        for (let i = 0; i < req.body.length; i++) {
          whereQuery += " fo.fsd_id = " + req.body[i].fsd_id;
          if (i < req.body.length - 1) {
            whereQuery += " or ";
          }
        }

        console.log(whereQuery);

        conn.query(
          "select DATE_FORMAT(fo.geburtsdatum, '%d.%m.%Y') as 'geburtsdatum', fort.*,  DATE_FORMAT(fort.fortbilfdungstermin, '%d.%m.%Y') as 'fortbilfdungstermin' from fsd_organs fo join fortbildungstermine fort on fo.fsd_id = fort.fsd_id where " +
            whereQuery,
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

router.post(
  "/exportAllPersonalInformationAndFortbildungen",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          let whereQuery = "";
          for (let i = 0; i < req.body.length; i++) {
            whereQuery += " fo.fsd_id = " + req.body[i].fsd_id;
            if (i < req.body.length - 1) {
              whereQuery += " or ";
            }
          }

          console.log(whereQuery);

          conn.query(
            "select fo.*, DATE_FORMAT(fo.geburtsdatum, '%d.%m.%Y') as 'geburtsdatum', fort.*, DATE_FORMAT(fort.fortbilfdungstermin, '%d.%m.%Y') as 'fortbilfdungstermin' from fsd_organs fo join fortbildungstermine fort on fo.fsd_id = fort.fsd_id where " +
              whereQuery,
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
  }
);

router.post(
  "/exportAllPersonalInformationAndFortbildungenAndBestellungen",
  auth,
  async (req, res, next) => {
    try {
      connection.getConnection(function (err, conn) {
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        } else {
          let whereQuery = "";
          for (let i = 0; i < req.body.length; i++) {
            whereQuery += " fo.fsd_id = " + req.body[i].fsd_id;
            if (i < req.body.length - 1) {
              whereQuery += " or ";
            }
          }

          console.log(whereQuery);

          conn.query(
            "select fo.*, DATE_FORMAT(fo.geburtsdatum, '%d.%m.%Y') as 'geburtsdatum', fort.*, DATE_FORMAT(fort.fortbilfdungstermin, '%d.%m.%Y') as 'fortbilfdungstermin', be.*, DATE_FORMAT(be.bescheid_datum, '%d.%m.%Y') as 'bescheid_datum', DATE_FORMAT(be.bestellt_seit, '%d.%m.%Y') as 'bestellt_seit', DATE_FORMAT(be.Abbestellung, '%d.%m.%Y') as 'Abbestellung' from fsd_organs fo join fortbildungstermine fort on fo.fsd_id = fort.fsd_id join bestellungen be on fo.fsd_id = be.fsd_id where " +
              whereQuery,
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
  }
);

router.get("/getFsdOrgan/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from fsd_organs where fsd_id = ?",
          [req.params.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows.length ? rows[0] : {});
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

router.get("/getFortbildungstermine/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from fortbildungstermine where fsd_id = ? order by fortbilfdungstermin desc",
          [req.params.id],
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

router.get("/getAllBestellungen/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from bestellungen where fsd_id = ?",
          [req.params.id],
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

router.get("/getAllRegions", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query("select * from regions", function (err, rows, fields) {
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

router.get("/getAllFbz", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query("select * from all_fbz", function (err, rows, fields) {
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

//#endregion
