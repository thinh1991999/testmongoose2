const express = require("express");
const path = require("path");
var cors = require("cors");
var bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { connectDb } = require("./config/db");

connectDb();
const port = process.env.PORT || 3000;

const app = express();
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
app.use(listingRoutes);
app.use(amenityRoutes);
app.use(adminRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
