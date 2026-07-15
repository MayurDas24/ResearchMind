import axios from "axios";

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export interface AIResearchResponse {
  report: string;
  feedback: string;
  confidence: number;
  sources: string[];
  scraped_content: string;
}

export async function generateResearch(
  topic: string
): Promise<AIResearchResponse> {
  try {
    console.log("🤖 Calling AI Service...");

    const response = await axios.post(
      `${AI_URL}/research`,
      {
        topic,
      },
      {
        timeout: 1000 * 60 * 10, // 10 minutes
      }
    );

    console.log("✅ AI Service Finished");

    return response.data;
  } catch (error: any) {
    console.error("AI Service Error");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
}