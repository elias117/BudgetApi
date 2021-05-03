const express = require('express');
const router = express.Router();



const Envelopes = [];
router.use(express.json());

router.param('id', (req, res, next, id) => {
    const envIndex = Envelopes.findIndex( e => {
        return e.id === Number(id);
    });
    if (envIndex !== -1){
        const env = Envelopes[envIndex];
        req.env = env;
        req.envIndex = envIndex;
        next();
    }else{
        res.status(404).send('Envelope not Found');
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
    Envelopes.splice(req.envIndex, 1);
    res.status(200).send(req.env);
});

module.exports = router;