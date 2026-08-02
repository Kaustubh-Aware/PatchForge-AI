const express = require("express");

const router = express.Router();

const {
    getAIAnalysis
} = require("../controllers/aiController");

router.get("/:scanId", getAIAnalysis);

module.exports = router;