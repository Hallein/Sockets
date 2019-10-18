const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;
const TOKEN_DURATION = process.env.TOKEN_DURATION;


router.post('/login',(req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        res.sendStatus(400);
    }

    // TODO: verify credentials
    //

    // TODO: generate token
    const token = jwt.sign({
        user: "hallein",
        role: 1,
        namespace: '/device_01'
    }, SECRET, { expiresIn: TOKEN_DURATION });

    res.json({ token: token });
});

module.exports = router;