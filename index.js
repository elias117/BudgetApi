const express = require('express');
const envelopeRouter = require('./Routers/envelopes');
const app = express();
const port = 4000;

app.use('/envelopes',envelopeRouter);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })