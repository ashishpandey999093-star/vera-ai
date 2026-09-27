import {
    getStoredContext,
    setStoredContext
} from "../store/context.store.js";

const VALID_SCOPES = [
    "category",
    "merchant",
    "customer",
    "trigger"
];

export const saveContext = ({
    scope,
    contextId,
    version,
    payload
}) => {
    if (!VALID_SCOPES.includes(scope)) {
        return {
            type: "invalid_scope",
            message: `Invalid scope: ${scope}`
        };
    }

    if (!contextId || typeof contextId !== "string") {
        return {
            type: "invalid_context_id",
            message: "context_id must be a non-empty string"
        };
    }

    if (!Number.isInteger(version) || version < 1) {
        return {
            type: "invalid_version",
            message: "version must be a positive integer"
        };
    }

    if (
        payload === null ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        return {
            type: "invalid_payload",
            message: "payload must be an object"
        };
    }

    const existing = getStoredContext(scope, contextId);

    /*
     * No existing context:
     * Store the first version.
     */
    if (!existing) {
        setStoredContext(scope, contextId, {
            version,
            payload
        });

        return {
            type: "stored",
            version
        };
    }

    /*
     * Same version:
     * Idempotent request.
     */
    if (version === existing.version) {
        return {
            type: "duplicate",
            version
        };
    }

    /*
     * Older version:
     * Reject stale update.
     */
    if (version < existing.version) {
        return {
            type: "stale",
            currentVersion: existing.version
        };
    }

    /*
     * Newer version:
     * Replace the existing context.
     */
    setStoredContext(scope, contextId, {
        version,
        payload
    });

    return {
        type: "stored",
        version
    };
};