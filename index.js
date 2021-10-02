require("dotenv").config();
const express = require("express");
const envelopeRouter = require("./Routers/envelopes");
const transactionRouter = require("./Routers/transactions");
const morgan = require("morgan");
var cors = require("cors");

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.port || 4000;

app.use((req, res, next) => {
    morgan("tiny");
    next();
});
app.use(cors());

app.use("/api/v1/envelopes", envelopeRouter);
app.use("/api/v1/transactions", transactionRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
