const mongoose = require("mongoose");
const env = require("dotenv");

env.config();

const MONGODB_URL = process.env.MONGODB_URL;

const db = async () => {
  try {
    const con = await mongoose.connect(MONGODB_URL);
    console.log(`mongodb connected: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = db;
