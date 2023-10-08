const express = require('express');
const router = express.Router();
const User = require('../models/user')
const auth = require('../middlewares/auth')

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        console.log('Saving user')
        await user.save();
        console.log('user saved')
        const token = await user.generateJWTToken();
        res.cookie('jwt', token);
        res.redirect('/chat-room')
    }

    catch(e) {
        console.log(e)
        res.redirect('/?error=Signup-Failed');
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.verifyByCreds(req.body.username, req.body.password);
        const token = await user.generateJWTToken();
        res.cookie('jwt', token);
        res.redirect('/chat-room');
    }
    catch(e) {
        res.redirect('/?error=Signup-Failed');
    }
})

router.get('/current_user', auth, async (req, res) => {
    res.send(req.user);
})

module.exports = router;