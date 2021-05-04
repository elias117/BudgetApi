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


router.get('/:id', (req, res) => {
    res.status(200).send(req.env);
});

router.get('/', (req, res) => {
    res.status(200).send(Envelopes);
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

router.put('/:id', (req, res) => {
    const updatedEnv = {
        id: Number(req.env.id),
        name: req.body.name,
        budget: Number(req.body.budget)
    };
    Envelopes[req.envIndex] = updatedEnv;
    res.status(200).send(updatedEnv);
});

router.post('/transfer/:from/:to', (req, res) => {
    const transferAmount = Number(req.body.amount);
    const fromIndex = Envelopes.findIndex( e => {
        return e.name.toLowerCase() == req.params.from.toLowerCase();
    });
    const toIndex = Envelopes.findIndex(e => {
        return e.name.toLowerCase() == req.params.to.toLowerCase();
    });

    if(fromIndex === -1){
        res.status(404).send(`${req.params.from} Envelope Doesnt Exist`);
    }else if(toIndex === -1){
        res.status(404).send(`${req.params.to} Envelope Doesnt exist`);
    }

    const fromEnv = Envelopes[fromIndex];

    if (transferAmount <= fromEnv.budget){
        Envelopes[fromIndex].budget -= transferAmount;
        Envelopes[toIndex].budget += transferAmount;
        res.status(200).send('Amount Transferred');
    }else{
        res.status(404).send(`Error: Not enough money to transfer from ${fromEnv.name}!`);
    }
});

module.exports = router;