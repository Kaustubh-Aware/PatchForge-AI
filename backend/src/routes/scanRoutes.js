const express = require("express");

const router = express.Router();

const { createScan } = require("../controllers/scanController");

router.post("/", createScan);

module.exports = router;