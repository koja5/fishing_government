const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const sqlDatabase = require("./providers/config/sql-database");
var cors = require("cors");
// sqlDatabase.connect();

const express = require("express");
// const express = require("express");

//#region providers
const general = require("./providers/apis/general");
const admin = require("./providers/apis/admin");
const superadmin = require("./providers/apis/superadmin");
const auth = require("./providers/apis/auth");
const mail = require("./providers/mails/mail-api");
//#endregion

const app = express();

//use cors
app.use(cors({ origin: "*" }));

module.exports = app;

app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header("Access-Control-Allow-Origin", "");
  res.header("SameSite", "None");
  res.header(
    "set-cookie",
    "Expires=Fri, 24-Apr-2026 21:24:11 GMT;Secure;HttpOnly; SameSite=None"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Parsers for POST data
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

//providers
app.use("/api", general);
app.use("/api/admin", admin);
app.use("/api/superadmin", superadmin);
app.use("/api/auth", auth);
app.use("/api/mail", mail);

app.use(express.static(path.join(__dirname, "../client/src")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/index.html"));
});

const port = process.env.PORT || "3001";
app.set("port", port);
const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
