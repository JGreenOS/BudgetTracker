const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// console.log("process env", process.env.MONGODB_URI);

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
});

mongoose.connection.on('connected', () =>
  console.log('Connected to MongoDB Endpoint')
);

mongoose.connection.on('error', (err) =>
  console.log(`Mongoose default connection error: ${err}`)
);


//get the routes from here
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
    console.log(`App is on port ${PORT}`);
});