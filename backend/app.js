const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const app = express();

mongoose.connect("mongodb://127.0.0.1/test")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection to DB failed');
  });

app.use(bodyParser.json());

app.use("/images/", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/api/posts", postRouter);
app.use("/api/user", userRouter);

module.exports = app;
