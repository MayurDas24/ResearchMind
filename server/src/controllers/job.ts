import { Request, Response } from "express";

import Job from "../models/Job";

export const getJob = async (
  req: Request,
  res: Response
) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({
      message: "Job not found",
    });
  }

  res.json(job);
};