import { saveContext } from "../services/context.service.js";

export const pushContext = (req, res) => {
    const {
        scope,
        context_id,
        version,
        payload,
        delivered_at
    } = req.body;

    if (!delivered_at) {
        return res.status(400).json({
            accepted: false,
            reason: "invalid_request",
            details: "delivered_at is required"
        });
    }

    const result = saveContext({
        scope,
        contextId: context_id,
        version,
        payload
    });

    if (result.type === "invalid_scope") {
        return res.status(400).json({
            accepted: false,
            reason: "invalid_scope",
            details: result.message
        });
    }

    if (
        result.type === "invalid_context_id" ||
        result.type === "invalid_version" ||
        result.type === "invalid_payload"
    ) {
        return res.status(400).json({
            accepted: false,
            reason: result.type,
            details: result.message
        });
    }

    if (result.type === "stale") {
        return res.status(409).json({
            accepted: false,
            reason: "stale_version",
            current_version: result.currentVersion
        });
    }

    const storedAt = new Date().toISOString();

    return res.status(200).json({
        accepted: true,
        ack_id: `ack_${context_id}_v${version}`,
        stored_at: storedAt
    });
};