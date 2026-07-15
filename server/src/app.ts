import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import researchRoutes from "./routes/research";
import jobRoutes from "./routes/job";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());
app.use("/api/research", researchRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "ResearchMind Backend Running",
  });
});
app.use("/api/jobs", jobRoutes);

export default app;