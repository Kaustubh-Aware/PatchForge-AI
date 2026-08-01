const express = require("express");

const router = express.Router();

const {
    createScan,
    getAllScans,
    getScanById,
} = require("../controllers/scanController");

router.post("/", createScan);

router.get("/", getAllScans);

router.get("/:scanId", getScanById);

module.exports = router;