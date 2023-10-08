const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true
    },

    chatId: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    messageSeq: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

const messageModel = mongoose.model('chats', chatSchema);

module.exports = messageModel;