const express = require("express");
const {
    getEnvelopes,
    getEnvelopeById,
    addEnvelope,
    deleteEnvelope,
    updateEnvelope,
} = require("../controllers/envelopes");
const router = express.Router();

router.use(express.json());

router.get("/:id", getEnvelopeById);

router.get("/", getEnvelopes);

router.post("/", addEnvelope);

router.delete("/:id", deleteEnvelope);

router.put("/:id", updateEnvelope);

module.exports = router;
