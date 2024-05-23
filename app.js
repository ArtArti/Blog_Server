const express = require("express");
const app = express();
const authRouter = require("./router/authRouter");
const sellerRouter= require("./router/sellerRouter")
const dbconnect = require("./Config/databaseConfig");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Connect to the database
dbconnect();

// Apply CORS middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], 
    methods: ['GET', 'POST','PUT','DELETE'], 
    credentials: true,
  })
)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// Use built-in and third-party middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/auth/", authRouter);
app.use("/api/post/", sellerRouter)

// Default route handler
app.get("/", (req, res) => {
  res.status(200).json({ data: "jwtaut Server" });
});

module.exports = app;
