const express = require("express");

const router = express.Router();

const {
    getReportByScanId
} = require("../controllers/reportController");

// GET Complete Report
router.get("/:scanId", getReportByScanId);

module.exports = router;