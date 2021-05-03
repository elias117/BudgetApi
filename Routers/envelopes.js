const express = require('express');
const router = express.Router();



const Envelopes = [];
router.use(express.json());

router.param('id', (req, res, next) => {
    const env = Envelopes.filter( e => {
        e.id == req.params.id;
    });
    if (env){
        req.env = env;
        next();
    }else{
        res.status(404).send();
    }
});

router.get('/', (req, res) => {
    res.status(200).send(Envelopes);
});

router.get('/:id', (req, res) => {
    res.status(200).send(req.env);
});

router.post('/', (req, res) => {
    const env = {
        id: req.body.id,
        name: req.body.name,
        budget: req.body.budget
    };
    Envelopes.push(env);
    res.status(201).send(env);
});
module.exports = router;