import mongoose from "mongoose";
import { env } from "../config/env";
import Research from "../models/Research";
import Job from "../models/Job";

const resetData = async () => {
  await mongoose.connect(env.mongoUri);

  const researchResult = await Research.deleteMany({});
  const jobResult = await Job.deleteMany({});

  console.log(`✅ Deleted ${researchResult.deletedCount} research records`);
  console.log(`✅ Deleted ${jobResult.deletedCount} job records`);

  await mongoose.disconnect();
  process.exit(0);
};

resetData().catch((err) => {
  console.error("Reset failed:", err);
  process.exit(1);
});