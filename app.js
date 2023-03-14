const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: false }));

const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);

app.listen(8080);
