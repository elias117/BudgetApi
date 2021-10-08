const express = require("express");
const router = express.Router();

const {
    createUser,
    deleteUser,
    updateUserPassword,
    login,
} = require("../controllers/auth");

router.post("/login", login);
router.post("/create-user", createUser);
router.delete("/delete-user", deleteUser);
router.patch("/update-user-password", updateUserPassword);
module.exports = router;
