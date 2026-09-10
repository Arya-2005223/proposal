import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Proposal from "./models/Proposal.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Proposal backend is running",
  });
});

// Save proposal/reply
app.post("/api/proposals", async (req, res) => {
  try {
    const {
      name,
      question1,
      question2,
      date,
      location,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const proposal = await Proposal.create({
      name,
      question1,
      question2,
      date,
      location,
    });

    res.status(201).json({
      message: "Reply saved successfully ❤️",
      data: proposal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save reply",
      error: error.message,
    });
  }
});

// Get all replies
app.get("/api/proposals", async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({
      createdAt: -1,
    });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch replies",
      error: error.message,
    });
  }
});

// Get one reply
app.get("/api/proposals/:id", async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        message: "Reply not found",
      });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reply",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});