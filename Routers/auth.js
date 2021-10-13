const express = require("express");
const router = express.Router();

const { authenticate } = require("../controllers/auth");

router.post("/login", authenticate);
// router.post("/create-user", createUser);
// router.delete("/delete-user", deleteUser);
// router.patch("/update-user-password", updateUserPassword);
module.exports = router;
