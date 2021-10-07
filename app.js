require("dotenv").config();
const express = require("express");
const envelopeRouter = require("./Routers/envelopes");
const transactionRouter = require("./Routers/transactions");
const docsRouter = require("./Routers/docs");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
    morgan("tiny");
    next();
});
app.use(cors());
app.use(express.json());
app.use("/api-docs", docsRouter);
app.use("/api/v1/envelopes", envelopeRouter);
app.use("/api/v1/transactions", transactionRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
