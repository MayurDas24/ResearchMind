import { Router } from "express";

import { getJob } from "../controllers/job";

const router = Router();

router.get("/:id", getJob);

export default router;