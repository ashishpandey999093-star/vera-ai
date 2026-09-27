export const getMetadata = (req, res) => {
    res.status(200).json({
        team_name: process.env.TEAM_NAME,
        team_members: process.env.TEAM_MEMBERS
            .split(",")
            .map(name => name.trim()),
        model: process.env.MODEL,
        approach: process.env.APPROACH,
        contact_email: process.env.CONTACT_EMAIL,
        version: process.env.VERSION,
        submitted_at: new Date().toISOString()
    });
};