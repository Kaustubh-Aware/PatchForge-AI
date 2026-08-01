const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const scanRoutes = require("./routes/scanRoutes");
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/scan", scanRoutes);
// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "PatchForge AI",
        message: "Backend is running successfully 🚀"
    });
});

// Health Check Route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        timestamp: new Date()
    });
});

module.exports = app;