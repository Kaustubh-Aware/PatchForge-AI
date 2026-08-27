const express = require("express");
const router = express.Router();
const { 
    createScan, 
    streamScan, 
    getAllScans, 
    getScanById 
} = require("../controllers/scanController");

// =========================================================================
// Network Route Configurations
// CRITICAL: Stream route must sit ABOVE dynamic parameter bounds (/:scanId)
// =========================================================================

// GET /api/scan/stream?repositoryUrl=...
router.get("/stream", streamScan);

// POST /api/scan
router.post("/", createScan);

// GET /api/scan
router.get("/", getAllScans);

// GET /api/scan/:scanId
router.get("/:scanId", getScanById);

module.exports = router;
