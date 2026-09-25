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
app.use("/api/rooms", require("./src/routes/rooms.js"));
app.use("/api/notes", require("./src/routes/notes.js"));
app.listen(port,()=>console.log(`server running on ${port}`));


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjM5NDA1MjNlMjkyOWYzYzNkZmIzNCIsImlhdCI6MTc5MDE1Mzk1NCwiZXhwIjoxNzkwNzU4NzU0fQ.DAPL5zkcL3tRSGRV6ji3zBakR0l6xwI7hYP9IoXimCw

// 4KS4NX