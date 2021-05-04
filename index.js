const express = require('express');
const envelopeRouter = require('./Routers/envelopes');
const morgan = require('morgan');

const app = express();
const port = 4000;

app.use((req, res, next)=> {
  morgan('tiny');
  next();
});


app.use('/envelopes', envelopeRouter);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })