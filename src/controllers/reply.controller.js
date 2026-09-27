import { handleReply } from "../services/reply.service.js";

export const runReply = (req, res) => {

    const result = handleReply(req.body);

    if (result.error) {
        return res.status(400).json(result);
    }

    return res.status(200).json(result);
};