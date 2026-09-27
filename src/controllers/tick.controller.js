import { buildTickContext } from "../services/tick.service.js";
import { buildVeraPrompt } from "../services/prompt.service.js";
import { generateWithGemini } from "../services/llm.service.js";
import { createConversation, addMessage } from "../store/conversation.store.js";
import {
    hasSentEngagement,
    markEngagementSent
} from "../store/engagement.store.js";

export const runTick = async (req, res) => {
    const { available_triggers } = req.body;

    if (!Array.isArray(available_triggers)) {
        return res.status(400).json({
            actions: [],
            reason: "invalid_request",
            details: "available_triggers must be an array"
        });
    }

    const actions = [];

    for (const triggerId of available_triggers) {
        const result = buildTickContext(triggerId);

        if (result.error) {
            continue;
        }

        const suppressionKey = result.trigger.suppression_key;

        if (hasSentEngagement(suppressionKey)) {
            continue;
        }

        const prompt = buildVeraPrompt(result);

        const aiResult = await generateWithGemini(prompt);

        if (!aiResult.should_act) {
            continue;
        }
        markEngagementSent(suppressionKey);

        const conversationId = `conv_${triggerId}`;

        createConversation(conversationId, {
            conversation_id: conversationId,
            merchant_id: result.merchant.merchant_id,
            customer_id: result.customer?.customer_id ?? null,
            trigger_id: triggerId
        });

        addMessage(conversationId, {
            role: "vera",
            body: aiResult.action.body
        });

        actions.push({
            conversation_id: conversationId,
            merchant_id: result.merchant.merchant_id,
            customer_id: result.customer?.customer_id ?? null,
            send_as: aiResult.action.send_as,
            trigger_id: triggerId,
            body: aiResult.action.body,
            cta: aiResult.action.cta,
            suppression_key: result.trigger.suppression_key,
            rationale: aiResult.action.rationale
        });
    }

    return res.status(200).json({
        actions
    });
};