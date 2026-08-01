const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
    {
        repositoryUrl: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Scanning", "Completed", "Failed"],
            default: "Pending",
        },

        totalDependencies: {
            type: Number,
            default: 0,
        },

        vulnerabilitiesFound: {
            type: Number,
            default: 0,
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Scan", scanSchema);