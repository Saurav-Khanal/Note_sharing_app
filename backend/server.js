const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("backend is running");
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo db connected"))
.catch(()=>console.log(err));

const port=process.env.PORT || 5000;
app.use("/api/auth",require("./src/routes/auth.js"))
app.listen(port,()=>console.log(`server running on ${port}`));

