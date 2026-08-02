const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({

    scanId: {
        type: String,
        required: true,
        unique: true
    },

    repositoryUrl: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Scanning"
    },

    totalDependencies: {
        type: Number,
        default: 0
    },

    vulnerabilitiesFound: {
        type: Number,
        default: 0
    },

    // =====================================
    // NEW: AI Analysis from Lyzr
    // =====================================

    aiAnalysis: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    startedAt: {
        type: Date,
        default: Date.now
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Scan",
    scanSchema
);