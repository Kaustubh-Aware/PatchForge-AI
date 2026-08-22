require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log("==================================");
            console.log(`🚀 PatchForge AI Backend Running`);
            console.log(`🌐 http://localhost:${PORT}`);
            console.log(`📦 Database: Supabase (PostgreSQL)`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log("==================================");
        });

    } catch (error) {
        console.error("❌ Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();