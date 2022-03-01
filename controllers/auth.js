const { db } = require("../config/db");
const jwt = require("jsonwebtoken");
const guid = require("js-guid");
const cache = {};
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
            const guidString = guid.Guid.newGuid().StringGuid;
            const refreshToken = jwt.sign(
                { id: guidString, username: user.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "180d" }
            );
            res.cookie("access_token", token, {
                httpOnly: true,
            });
            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                path: "/api/v1/auth/refresh",
            });
            cache[refreshToken] = user.username;
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
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.redirect("/api/v1/auth/refresh");
        }
        res.status(403).send("Please Log In Again");
    }
};

exports.refresh = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    try {
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            try {
                const refreshData = jwt.verify(
                    refreshToken,
                    process.env.ACCESS_TOKEN_SECRET
                );
                if (cache[refreshToken]) {
                    const newAccessToken = jwt.sign(
                        { username: refreshData.username },
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "3600s",
                        }
                    );
                    res.cookie("access_token", newAccessToken, {
                        httpOnly: true,
                    });
                    next();
                } else {
                    res.status(403).send("Please Log In Again");
                }
            } catch (e) {
                res.status(403).send("Please Log In Again");
            }
        } else {
            res.status(403).send("Please Log In Again");
        }
    }
};
