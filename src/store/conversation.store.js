const conversations = new Map();

export const getConversation = (conversationId) => {
    return conversations.get(conversationId);
};

export const createConversation = (conversationId, data) => {
    if (conversations.has(conversationId)) {
        return conversations.get(conversationId);
    }

    conversations.set(conversationId, {
        ...data,
        messages: []
    });

    return conversations.get(conversationId);
};

export const addMessage = (conversationId, message) => {
    const conversation = conversations.get(conversationId);

    if (!conversation) {
        return null;
    }

    conversation.messages.push(message);

    return conversation;
};