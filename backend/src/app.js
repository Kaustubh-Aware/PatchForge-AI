const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Routes
const scanRoutes = require("./routes/scanRoutes");
const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes");
const aiRoutes = require("./routes/aiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { getStatsFromSupabase } = require("./services/supabaseService");

const app = express();

// ======================================================
// Security Middlewares
// ======================================================

app.use(helmet());

// CORS — allow frontend origin
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsing with size limit
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Logging
app.use(morgan("dev"));

// ======================================================
// Simple Rate Limiting (in-memory)
// ======================================================

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // max requests per window

app.use((req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || "unknown";
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return next();
    }

    const entry = rateLimitMap.get(ip);

    if (now - entry.start > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return next();
    }

    entry.count++;

    if (entry.count > RATE_LIMIT_MAX) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    }

    next();
});

// ======================================================
// Request Timeout (2 minutes for scan operations)
// ======================================================

app.use((req, res, next) => {
    res.setTimeout(120000, () => {
        if (!res.headersSent) {
            res.status(408).json({
                success: false,
                message: "Request timeout.",
            });
        }
    });
    next();
});

// ======================================================
// API Routes
// ======================================================

app.use("/api/scan", scanRoutes);
app.use("/api/scans", scanRoutes); // Alias for plural endpoint
app.use("/api/vulnerabilities", vulnerabilityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/report", reportRoutes);

// ======================================================
// Root Route
// ======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "PatchForge AI",
        database: "Supabase (PostgreSQL)",
        message: "Backend is running successfully 🚀",
    });
});

// ======================================================
// Health Check
// ======================================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy",
        storage: "Supabase (PostgreSQL)",
        timestamp: new Date(),
    });
});

// ======================================================
// Stats Endpoint (for dashboard)
// ======================================================

app.get("/api/stats", async (req, res) => {
    try {
        const stats = await getStatsFromSupabase();
        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve stats from Supabase.",
        });
    }
});

// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// ======================================================
// Global Error Handler
// ======================================================

app.use((err, req, res, next) => {
    console.error("Global Error:", err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message || "Internal Server Error",
    });
});

module.exports = app;