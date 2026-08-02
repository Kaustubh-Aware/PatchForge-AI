const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const reportRoutes = require("./routes/reportRoutes");
// Routes
const scanRoutes = require("./routes/scanRoutes");
const vulnerabilityRoutes = require("./routes/vulnerabilityRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();


// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// API Routes
app.use("/api/vulnerabilities", vulnerabilityRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/report", reportRoutes);

// Root Route
app.get("/", (req,res)=>{
    res.status(200).json({
        success:true,
        project:"PatchForge AI",
        message:"Backend is running successfully 🚀"
    });
});


// Health Check
app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        status:"Healthy",
        timestamp:new Date()
    });
});


// 404 Handler
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
});


// Error Handler
app.use((err,req,res,next)=>{
    console.error(err.stack);

    res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });
});


module.exports = app;