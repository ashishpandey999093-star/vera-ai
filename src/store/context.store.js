const contexts = {
    category: new Map(),
    merchant: new Map(),
    customer: new Map(),
    trigger: new Map()
};

export const getStoredContext = (scope, contextId) => {
    return contexts[scope]?.get(contextId);
};

export const setStoredContext = (scope, contextId, context) => {
    contexts[scope].set(contextId, context);
};

export const getContextCounts = () => {
    return {
        category: contexts.category.size,
        merchant: contexts.merchant.size,
        customer: contexts.customer.size,
        trigger: contexts.trigger.size
    };
};