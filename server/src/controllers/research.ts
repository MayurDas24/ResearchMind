import { Request, Response } from "express";
import Research from "../models/Research";
import Job from "../models/Job";
import queueService from "../services/queue";
export const createResearch = async (
  req: Request,
  res: Response
) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    // Temporary user until auth is implemented
    const demoUserId = "6873d0000000000000000001";

   const research = await Research.create({
  topic,
  status: "queued",
});
    const job = await Job.create({
      research: research._id,
      status: "queued",
      progress: 0,
      currentAgent: "Waiting",
    });
    queueService.enqueue(job._id.toString());

    return res.status(201).json({
      success: true,
      researchId: research._id,
      jobId: job._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllResearch = async (
  req: Request,
  res: Response
) => {
  const research = await Research.find().sort({
    createdAt: -1,
  });

  res.json(research);
};

export const getResearch = async (
  req: Request,
  res: Response
) => {
  const research = await Research.findById(req.params.id);

  if (!research) {
    return res.status(404).json({
      message: "Research not found",
    });
  }

  res.json(research);
};

export const deleteResearch = async (
  req: Request,
  res: Response
) => {
  await Research.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
  });
};