const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const cookieEncrypter = require("cookie-encrypter");
const SECRET = "foobarbaz1234567foobarbaz1234567";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
// app.use(cookieEncrypter(SECRET));

const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);

app.listen(8080);
