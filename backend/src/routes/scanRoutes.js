const express = require("express");

const router = express.Router();

const {
    createScan,
    getAllScans,
    getScanById,
} = require("../controllers/scanController");

// ======================================================
// Create a New Scan
// POST /api/scan
// ======================================================

router.post("/", createScan);

// ======================================================
// Get All Scans
// GET /api/scan
// ======================================================

router.get("/", getAllScans);

// ======================================================
// Get Scan By Scan ID
// GET /api/scan/:scanId
// ======================================================

router.get("/:scanId", getScanById);

module.exports = router;