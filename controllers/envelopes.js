const { db } = require("../config");

exports.getEnvelopes = async (req, res) => {
    const query = "SELECT * FROM envelopes";
    try {
        const envelopes = await db.query(query);
        if (envelopes.rowCount < 1) {
            return res.status(404).send({
                message: "Records not found",
            });
        }
        res.status(200).send({
            status: "Success",
            message: "Envelopes information retrieved",
            data: envelopes.rows,
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.getEnvelopeById = async (req, res) => {
    const query = "SELECT * FROM envelopes WHERE id = $1";
    const { id } = req.params;

    try {
        const envelope = await db.query(query, [id]);
        if (envelope.rowCount < 1) {
            return res.status(404).send({
                message: "No envelope information found",
            });
        }
        res.status(200).send({
            status: "Success",
            message: "Envelope Information Received",
            data: envelope.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.addEnvelope = async (req, res) => {
    const { title, budget } = req.body;
    const query =
        "INSERT INTO envelopes (title, budget) VALUES ($1, $2) RETURNING *";

    try {
        const newEnvelope = await db.query(query, [title, budget]);
        res.status(201).send({
            status: "Success",
            message: "New Envelope Created",
            data: newEnvelope.rows[0],
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.updateEnvelope = async (req, res) => {
    const { title, budget } = req.body;
    const { id } = req.params;
    const query =
        "UPDATE envelopes SET title = $1, budget = $2 WHERE id = $3 RETURNING *";

    try {
        const updatedEnvelope = await db.query(query, [title, budget, id]);
        res.status(200).send(updatedEnvelope.rows[0]);
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.deleteEnvelope = async (req, res) => {
    const { id } = req.params;
    const envelopeQuery = "SELECT * FROM envelopes WHERE id = $1";
    const deleteEnvQuery = "DELETE FROM envelopes WHERE id = $1";

    try {
        const record = await db.query(envelopeQuery, [id]);
        if (record.rowCount < 1) {
            return res.status(404).message({
                message: "Record not found",
            });
        }
        await db.query(deleteEnvQuery, [id]);
        res.sendStatus(204);
    } catch (err) {
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.addEnvelopeTransaction = async (req, res) => {
    const { id } = req.params;
    const { title, amount } = req.body;
    const date = new Date();

    const envelopeQuery = "SELECT * FROM envelopes WHERE envelopes.id = $1";
    const transactionQuery =
        "INSERT INTO transactions (title, amount, date, envelope_id) Values ($1, $2, $3, $4) RETURNING *";
    const updateEnvQuery =
        "UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *";

    try {
        await db.query("BEGIN");
        const envelope = await db.query(envelopeQuery, [id]);
        if (envelope.rowCount < 1) {
            return res.status(404).send({
                message: "No envelope information found",
            });
        }
        const newTransaction = await db.query(transactionQuery, [
            title,
            amount,
            date,
            id,
        ]);
        await db.query(updateEnvQuery, [amount, id]);
        await db.query("COMMIT");

        res.status(201).send({
            status: "Success",
            message: "New transaction created",
            data: newTransaction.rows[0],
        });
    } catch (err) {
        await db.query("ROLLBACK");
        return res.status(500).send({
            error: err.message,
        });
    }
};

exports.getEnvelopeTransactions = async (req, res) => {
    const query = "SELECT * FROM transactions WHERE envelope_id = $1";
    const { id } = req.params;

    try {
        const transactions = await db.query(query, [id]);
        if (transactions.rows < 1) {
            return res.status(404).send({
                message: "No envelope information found",
            });
        }
        res.status(200).send({
            status: "Success",
            message: "Transactions information retrieved",
            data: transactions.rows,
        });
    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
};
