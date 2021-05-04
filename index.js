require('dotenv').config();
const express = require('express');
const envelopeRouter = require('./Routers/envelopes');
const morgan = require('morgan');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.port || 4000;

app.use((req, res, next)=> {
  morgan('tiny');
  next();
});


app.use('/envelopes', envelopeRouter);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })