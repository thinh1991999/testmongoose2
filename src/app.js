const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
var cors = require("cors");
var bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const { connectDb } = require("./config/db");
const startSocket = require("./socket/socket");

connectDb();

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);
startSocket(io);
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.get("/", function (req, res) {
  console.log(" mot GET Request ve Homepage");
  return res.send("Hello GET");
});

app.use(userRouter);
app.use(roomRoutes);
app.use(amenityRoutes);
app.use(categoryRoutes);
app.use(adminRoutes);
app.use(reviewRoutes);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
