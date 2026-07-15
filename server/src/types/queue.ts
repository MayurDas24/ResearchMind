import Job from "../models/Job";
import Research from "../models/Research";
import { JobStatus } from "../types/job";

class QueueService {
  private queue: string[] = [];

  enqueue(jobId: string) {
    this.queue.push(jobId);

    console.log(`✅ Job ${jobId} added to queue`);

    this.process();
  }

  private async process() {
    if (this.queue.length === 0) return;

    const jobId = this.queue.shift();

    if (!jobId) return;

    await this.runJob(jobId);
  }

  private async runJob(jobId: string) {
    const job = await Job.findById(jobId);

    if (!job) return;

    console.log(`🚀 Processing Job ${jobId}`);

    const steps = [
      JobStatus.SEARCHING,
      JobStatus.READING,
      JobStatus.RAG,
      JobStatus.WRITING,
      JobStatus.CRITIC,
      JobStatus.COMPLETED,
    ];

    for (let i = 0; i < steps.length; i++) {
      job.status = steps[i];

      job.progress = Math.round(((i + 1) / steps.length) * 100);

      job.currentAgent = steps[i];

      await job.save();

      console.log(
        `${steps[i]} : ${job.progress}%`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
    }

    await Research.findByIdAndUpdate(job.research, {
      status: "completed",
    });

    console.log("✅ Research Finished");
  }
}

export default new QueueService();