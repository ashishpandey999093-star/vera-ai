import {
    getConversation,
    createConversation,
    addMessage
} from "../store/conversation.store.js";

const AUTO_REPLY =
    "thank you for contacting us! our team will respond shortly.";

const isAutoReply = (message) => {
    return message.toLowerCase().trim() === AUTO_REPLY;
};

const isHostile = (message) => {
    const text = message.toLowerCase();

    return (
        text.includes("stop messaging me") ||
        text.includes("stop contacting me") ||
        text.includes("spam") ||
        text.includes("don't message me") ||
        text.includes("do not message me") ||
        text.includes("useless")
    );
};

const isIntentTransition = (message) => {
    const text = message.toLowerCase();

    return (
        text.includes("lets do it") ||
        text.includes("let's do it") ||
        text.includes("whats next") ||
        text.includes("what's next")
    );
};

export const handleReply = ({
    conversation_id,
    merchant_id,
    customer_id = null,
    message,
    turn_number
}) => {

    if (!conversation_id || !merchant_id || !message) {
        return {
            error: "conversation_id, merchant_id and message are required"
        };
    }

    // Create conversation if it does not already exist
    let conversation = getConversation(conversation_id);

    if (!conversation) {
        conversation = createConversation(conversation_id, {
            conversation_id,
            merchant_id,
            customer_id,
            trigger_id: null
        });
    }

    // Store merchant message
    addMessage(conversation_id, {
        role: "merchant",
        body: message,
        turn_number
    });

    // ------------------------------------------------
    // 1. HOSTILE / OPT-OUT MESSAGE
    // ------------------------------------------------

    if (isHostile(message)) {

        const response = {
            action: "end",
            body: "Understood. I won't message you again."
        };

        addMessage(conversation_id, {
            role: "vera",
            body: response.body
        });

        return response;
    }

    // ------------------------------------------------
    // 2. AUTOMATED REPLY
    // ------------------------------------------------

    if (isAutoReply(message)) {

        return {
            action: "wait",
            wait_seconds: 3600
        };
    }

    // ------------------------------------------------
    // 3. POSITIVE INTENT / USER WANTS TO PROCEED
    // ------------------------------------------------

    if (isIntentTransition(message)) {

        const response = {
            action: "send",
            body: "Done — the next step is to proceed with the setup. I'll take it forward now."
        };

        addMessage(conversation_id, {
            role: "vera",
            body: response.body
        });

        return response;
    }

    // ------------------------------------------------
    // 4. DEFAULT
    // ------------------------------------------------

    return {
        action: "wait",
        wait_seconds: 3600
    };
};