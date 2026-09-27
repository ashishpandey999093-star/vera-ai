const sentEngagements = new Set();

export const hasSentEngagement = (suppressionKey) => {
    return sentEngagements.has(suppressionKey);
};

export const markEngagementSent = (suppressionKey) => {
    sentEngagements.add(suppressionKey);
};