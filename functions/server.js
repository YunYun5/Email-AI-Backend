const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

let records = [];

router.get("/", (req, res) => {
  res.send("App is running..");
});

router.post("/add", (req, res) => {
  res.send("New record added.");
});

router.delete("/", (req, res) => {
  res.send("Deleted existing record");
});

router.put("/", (req, res) => {
  res.send("Updating existing record");
});

router.get("/pricing", (req, res) => {
  res.sendFile(path.join("public", "views", "pricing.html"));
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
