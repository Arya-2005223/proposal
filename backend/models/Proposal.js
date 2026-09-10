import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    question1: {
      type: String,
      default: "",
    },

    question2: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;