const auth = (req, res, next) => {
    const authToken = req.headers["auth_token"]; // Extract auth token

    if (!authToken || authToken !== "sri") {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    next();
};

module.exports = auth;
