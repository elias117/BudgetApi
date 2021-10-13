const express = require("express");
const router = express.Router();

const { authenticate } = require("../controllers/auth");
/**
 * @swagger
 * /api/v1/auth:
 *    post:
 *      summary: Log User in
 *      produces:
 *        - application/json
 *      tags:
 *        - Auth
 *      requestBody:
 *        description: username and password
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: integer
 *              example:
 *                username: elias
 *                password: password
 *      responses:
 *        "403":
 *          description: Invalid Credentials
 */
router.post("/login", authenticate);
// router.post("/create-user", createUser);
// router.delete("/delete-user", deleteUser);
// router.patch("/update-user-password", updateUserPassword);
module.exports = router;
