import { getContextCounts } from "../store/context.store.js";

export const healthCheck = (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime_seconds: Math.floor(process.uptime()),
        contexts_loaded: getContextCounts()
    });
};
