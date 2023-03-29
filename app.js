const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const userLoginController = require("./controllers/userController/userLogin");
const userController = require("./controllers/userController/user");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);

app.post("/", userLoginController.postLogin);

app.post("/signup", userController.postSignUp);

app.listen(PORT);
