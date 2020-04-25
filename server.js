const express = require("express");
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth")
const app = express();
const { HOST, PORT, DB_URL } = require("./config")

// Body Parser Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(authRoutes)

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
  console.log("Database connected successfully")
  app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`))
}).catch(err => {
  console.log(err);
})

// index Page
app.get("/",(req, res) => {
  res.send("<h4>Welcome to our hompage</h4>")
})

// handle 404 errors
app.all("*", (req, res) => {
  res.status(404).json({message: "Page not found"})
})
