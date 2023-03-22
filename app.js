require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const userLoginController = require('./controllers/userController/userLogin')
const userController = require("./controllers/userController/user");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);

app.post("/", userLoginController.postLogin)

app.post("/signup", userController.postSignUp)


app.listen(PORT);
