require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { parse } = require("cookie");
const cookieParser = require("cookie-parser");
const { createServer } = require("http"); // http server
const { Server } = require("socket.io"); // socket io server
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userLoginController = require("./controllers/userController/userLogin");
const userController = require("./controllers/userController/user");

const { onConnection } = require("./events");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.post("/", userLoginController.postLogin);
app.put("/signup", userController.putSignUp);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  cookie: {
    sameSite: "none",
    secure: true,
    expires: false,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

// io.engine.on("headers", (headers, request) => {
//   if (!request.headers.cookie) return;
//   const cookies = parse(request.headers.cookie);
//   console.log(cookies);
// });

// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) {
//     return next(new Error("authentication error"));
//   }
//   next();
// });

io.on("connection", onConnection(io));

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
