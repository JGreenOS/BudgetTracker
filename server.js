const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijdcu.mongodb.net/budgettracker?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useFindAndModify: false
});

//get the routes from here
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
    console.log(`App is on port ${PORT}`);
});