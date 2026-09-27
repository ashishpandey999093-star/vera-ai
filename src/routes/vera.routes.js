import express from "express";
import { healthCheck } from "../controllers/health.controller.js";
import { getMetadata } from "../controllers/metadata.controller.js";
import { pushContext } from "../controllers/context.controller.js";
import { runTick } from "../controllers/tick.controller.js";
import { runReply } from "../controllers/reply.controller.js";

const router = express.Router();

router.get("/healthz", healthCheck);
router.get("/metadata", getMetadata);
router.post("/context", pushContext);
router.post("/tick", runTick);
router.post("/reply", runReply);

export default router;