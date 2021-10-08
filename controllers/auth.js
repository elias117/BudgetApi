const { db } = require("../config");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
    const query =
        "INSERT INTO users (username, password) VALUES ($1,$2) RETURNING *";
    const username = req.body.username;
    const password = req.body.password;
    try {
        await db.query(query, [username, password]);
        res.status(201).send({
            status: "Success",
            message: "New User Created",
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const getUserquery =
        "SELECT username, password FROM users WHERE username = $1";
    const deleteUserquery = "DELETE FROM users WHERE username = $1";
    const username = req.body.username;
    const password = req.body.password;
    try {
        const userRecord = await db.query(getUserquery, [username]);
        if (userRecord && userRecord[0].password == password) {
            await db.query(deleteUserquery, [username]);
        } else {
            res.status(404).send({ message: "Wrong old password." });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.updateUserPassword = async (req, res) => {
    const getUserquery =
        "SELECT username, password FROM users WHERE username = $1";
    const updateUserquery =
        "UPDATE users SET password = $1 WHERE username = $2";
    const username = req.body.username;
    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const newPassword2 = req.body.newPassword2;

    if (newPassword !== newPassword2)
        return res.status(404).send({ message: "Passwords do not match" });
    try {
        const userRecord = await db.query(getUserquery, [username]);
        if (userRecord && userRecord[0].password === password) {
            await db.query(updateUserquery, [newPassword, username]);
            res.status(200).send({ message: "Password updated." });
        } else {
            res.status(404).send({ message: "Wrong old password." });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

exports.login = async (req, res, next) => {
    const getUserquery =
        "SELECT username, password FROM users WHERE username = $1";
    const username = req.username;
    const password = req.password;
    const userRecord = await db.query(getUserquery, [username]);
    if (userRecord && password === userRecord[0].password) {
        const token = jwt.sign(userRecord, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3600s",
        });
        res.cookie("Authorization", `Bearer ${token}`, {
            maxAge: 900000,
            httpOnly: true,
        });
        next();
    } else {
        res.status(404).send({ message: "Invalid log in" });
    }
};
