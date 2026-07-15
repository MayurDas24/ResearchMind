import { Schema, model } from "mongoose";
import { JobStatus } from "../types/job";
const jobSchema = new Schema(
  {
    research: {
      type: Schema.Types.ObjectId,
      ref: "Research",
      required: true,
    },

    status: {
    type: String,
    enum: Object.values(JobStatus),
    default: JobStatus.QUEUED,
},

    progress: {
      type: Number,
      default: 0,
    },

    currentAgent: {
      type: String,
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Job", jobSchema);