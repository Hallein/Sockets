const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const SECRET = process.env.SECRET;
const TOKEN_DURATION = process.env.TOKEN_DURATION;


router.post('/login',(req, res) => {
    const {username, password} = req.body;

    if(!username || !password){
        res.sendStatus(400);
    }

    // TODO: get credentials from DB
    const user = {
        username: 'hallein',
        password: '$2a$10$p.VoJGvMrnKVub2JZlnxT.o9hmGUmYX9sGXXxhrbY5ZjUuJK3.vOq',
        role: 1,
        devices: ['/device_01']
    }

    if( !user){
        res.sendStatus(404);
    }

    if( username !== user.username ){
        res.sendStatus(401);
    }

    if( !isPasswordValid(password, user.password) ){
        res.sendStatus(401);
    }

    const token = generateToken(user);

    res.json({ token: token });
});

router.get('/hash', (req, res) => {
    const {password} = req.query;
    res.json({ hashed_password: bcrypt.hashSync(password) });
});

const isPasswordValid = (password, hashed_password) => bcrypt.compareSync(password, hashed_password);

const generateToken = user => {
    return jwt.sign({
        user: user.username,
        role: user.role,
        devices: user.devices
    }, SECRET, { expiresIn: TOKEN_DURATION });
}

module.exports = router;