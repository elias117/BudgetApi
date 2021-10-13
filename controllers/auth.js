const { db } = require("../config");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res) => {
    const findUserQuery = "SELECT * FROM budget_users WHERE username = $1";
    try {
        const users = await db.query(findUserQuery, [req.body.username]);
        if (users.rowCount < 1) {
            return res.status(401).send("Username and password not found");
        }
        const user = users.rows[0];
        if (
            user.username === req.body.username &&
            req.body.password === user.password
        ) {
            const token = jwt.sign(
                { username: user.username },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "3600s",
                }
            );
            res.cookie("access_token", token, {
                httpOnly: true,
            });
            res.status(200).send("You are now logged in");
        }
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.authorize = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).send("Please log in again.");
    }
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.username = data.username;
        next();
    } catch {
        return res.status(403).send("Please log in again.");
    }
};
