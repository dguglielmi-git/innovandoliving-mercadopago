const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
    productId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    messages: [{
        username: String,
        icon: String,
        message: String,
        msgread: Number,
        msgreadowner: Number,
        messageDate: {
            type: Date,
            default: Date.now,
        },
    }],
});

module.exports = model('Chat', ChatSchema);
