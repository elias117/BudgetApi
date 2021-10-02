const express = require("express");
const router = express.Router();

const {
    getTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
} = require("../controllers/transactions");
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);

module.exports = router;
