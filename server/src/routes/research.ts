import { Router } from "express";

import {
  createResearch,
  deleteResearch,
  getAllResearch,
  getResearch,
} from "../controllers/research";

const router = Router();

router.post("/", createResearch);

router.get("/", getAllResearch);

router.get("/:id", getResearch);

router.delete("/:id", deleteResearch);

export default router;