const router = require('express').Router();
const User = require('.././models/User');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJs.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const hashedPassword = cryptoJs.AES.decrypt(user.password, process.env.SECRET_KEY);
            const pass = hashedPassword.toString(cryptoJs.enc.Utf8);
            if (pass !== req.body.password) {
                res.status(401).json("Wrong password.");
            } else {
                const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin
                }, process.env.JWT_KEY, { expiresIn: '3d' })
                //avoid sending password to client
                const { password, ...others } = user._doc;
                res.status(201).json({...others, accessToken});
            }
        } else {
            res.status(401).json("User not found.");
        }

    } catch (err) {
        res.status(500).json({ "error": err });
    }
})

module.exports = router;