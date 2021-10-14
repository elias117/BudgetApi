const express = require("express");
const router = express.Router();

const { authenticate, refresh } = require("../controllers/auth");
/**
 * @swagger
 * /api/v1/auth/login:
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
 *        "200":
 *          description: Logged in Successfully
 *        "403":
 *          description: Invalid Credentials
 */
router.post("/login", authenticate);
/**
 * @swagger
 * /api/v1/auth/refresh:
 *    post:
 *      summary: get new access_token
 *      produces:
 *        - application/json
 *      tags:
 *        - Auth
 *      responses:
 *        "200":
 *          description: Logged in Successfully
 *        "403":
 *          description: Invalid Credentials
 */
router.get("/refresh", refresh);
module.exports = router;
