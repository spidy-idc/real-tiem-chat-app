const express = require('express');
const router = express.Router()
const User = require('../models/user');
const auth = require('../middlewares/auth');
const Chat = require('../models/chats');

router.get('/chat-room', auth, async (req, res) => {
    try {
        const users = await User.find({ _id:{$ne: req.user._id} });
        res.render('chat-room', {users, current_user: req.user});
    }

    catch(e) {
        res.redirect('/login?error=login/signup-failed');
    }
});

router.get('/messageSeq', auth, async(req, res) => {
    try {
        const chatId = String(req.query.chatId);
        const messageCount = await Chat.countDocuments({chatId});
        res.send({count: messageCount});
    }

    catch(e) {
        res.status(200).send({count: 0});
    }
});

router.get('/getChats/:chatId', auth, async(req, res) => {
    try {
        const chatId = req.params.chatId;
        const chats = await Chat.find({chatId});
        
        if(chats[0].sender !== req.user.username && chats[0].receiver !== req.user.username)
            return res.status(401).send({error: 'You"re unauthorized to read these chats'})
        
        res.send({messages: chats});
    }

    catch(e) {
        console.log(e)
        res.status(500).send({error: 'Server error'});
    }
})

module.exports = router;