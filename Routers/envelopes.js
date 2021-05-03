const express = require('express');
const router = express.Router();



const Envelopes = [];
router.use(express.json());

router.param('id', (req, res, next, id) => {
    const envIndex = Envelopes.findIndex( e => {
        return e.id === Number(id);
    });
    const env = Envelopes[envIndex];
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
        id: Number(req.body.id),
        name: req.body.name,
        budget: Number(req.body.budget)
    };
    Envelopes.push(env);
    res.status(201).send(env);
});

router.delete('/:id', (req, res) => {
    Envelopes.splice(req.env.id-1, 1);
    res.status(200).send(req.env);
});

module.exports = router;