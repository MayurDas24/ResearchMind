import Job from "../models/Job";
import Research from "../models/Research";
import { JobStatus } from "../types/job";
import { generateResearch } from "./ai";
import { getIO } from "./socket";

class QueueService {
  private queue: string[] = [];
  private processing = false;

  enqueue(jobId: string) {
    this.queue.push(jobId);

    console.log(`✅ Job ${jobId} added to queue`);

    if (!this.processing) {
      this.process();
    }
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const jobId = this.queue.shift();

      if (jobId) {
        try {
          await this.runJob(jobId);
        } catch (err) {
          console.error(err);
        }
      }
    }

    this.processing = false;
  }

  private async updateJob(
    job: any,
    status: JobStatus,
    progress: number
  ) {
    job.status = status;
    job.progress = progress;
    job.currentAgent = status;

    await job.save();

    getIO().emit("job:update", {
      jobId: job._id,
      researchId: job.research,
      stage: status,
      progress,
      status,
    });

    console.log(`${status} - ${progress}%`);
  }
private async runJob(jobId: string) {
    const job = await Job.findById(jobId);

    if (!job) return;

    const research = await Research.findById(job.research);

    if (!research) return;

    console.log(`🚀 Processing Job ${jobId}`);

    const startTime = Date.now();

    try {
      //------------------------------------
      // SEARCH
      //------------------------------------

      await this.updateJob(job, JobStatus.SEARCHING, 10);

      //------------------------------------
      // READING
      //------------------------------------

      await this.updateJob(job, JobStatus.READING, 30);

      //------------------------------------
      // RAG
      //------------------------------------

      await this.updateJob(job, JobStatus.RAG, 50);

      //------------------------------------
      // CALL PYTHON AI SERVICE
      //------------------------------------

      const result = await generateResearch(research.topic);

      //------------------------------------
      // WRITER
      //------------------------------------

      await this.updateJob(job, JobStatus.WRITING, 75);

      //------------------------------------
      // SAVE REPORT
      //------------------------------------

      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

      research.report = result.report;
      research.sources = result.sources || [];
      research.status = "completed";
      research.runtime = elapsedSeconds;

      // Optional fields
      (research as any).feedback = result.feedback;
      (research as any).confidence = result.confidence;
      (research as any).scrapedContent = result.scraped_content;

      await research.save();

      //------------------------------------
      // CRITIC
      //------------------------------------

      await this.updateJob(job, JobStatus.CRITIC, 90);

      //------------------------------------
      // COMPLETE
      //------------------------------------

      await this.updateJob(job, JobStatus.COMPLETED, 100);

      getIO().emit("job:completed", {
        jobId: job._id,
        researchId: research._id,
      });

      console.log(`✅ Research Finished in ${elapsedSeconds}s`);
    } catch (error) {
      console.error(error);

      job.status = JobStatus.FAILED;
      await job.save();

      research.status = "failed";
      await research.save();

      getIO().emit("job:failed", {
        jobId: job._id,
      });
    }
  }
}

export default new QueueService();
