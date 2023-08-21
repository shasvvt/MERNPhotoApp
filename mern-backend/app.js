const fs = require("fs");
const path = require("path")

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

//middleware for image links
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

//Add headers to response so that when subsequest responses have headers attached
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//general error handling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    //`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tyxk0m3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    `mongodb://mernapp-mongo:MoStncrnqdZ7FLFgfHy4R8XXFaJS3a5Ri3edWOL6bikUaoE2h20C8JVnUpsHvqOVgBk2IdjJgDhyACDbcV7OjQ==@mernapp-mongo.mongo.cosmos.azure.com:10255/${process.env.DB_NAME}?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@mernapp-mongo@`
    )
  .then(() => {
    console.log("DB connection success!");
    app.listen(5001);
  })
  .catch((err) => {
    console.log(err);
  });
