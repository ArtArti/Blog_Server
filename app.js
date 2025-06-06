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
const allowedOrigin = 'https://art-gallery-client.vercel.app';

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,    // allow cookies to be sent
    exposedHeaders: ['Authorization']
  })
);



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
