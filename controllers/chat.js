const Chat = require('../models/chat');
const Owner = require("../models/owner");
const jwt = require("jsonwebtoken");
const { HTTP_UNAUTHORIZED, HTTP_NOT_FOUND } = require('../utils/httpCode');
const { BUSINESS_NAME, IS_OWNER, MSG_UNREAD, MSG_READ } = require('../utils/constants');

const getMessagesByProduct = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }
    console.log(req.params.productId)
    try {
        const chat = await Chat.findOne({ productId: req.params.productId, userId: req.params.userId });
        if (chat) {
            return res.json(chat.messages);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "error": "Chat ID Not Found or Insufficient Privileges."
        })

    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "error": "Error when trying to get messages for this chatt, check chat id and permissions." })
    }
}

const addChatMessageForProduct = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);

        let whereCondition = {};
        const owner = await Owner.findOne({}).where({ userOwnerId: id });
        if (!owner) {
            whereCondition = { userId: id };
        }

        const chat = await Chat.findOne({ productId: req.body.productId }).where(whereCondition);

        if (chat) {
            const msg = chat.messages;
            msg.push({
                username: req.body.username || BUSINESS_NAME,
                message: req.body.message,
                icon: req.body.icon || 'owner',
                msgread: req.body.msgread || 0,
                msgreadowner: req.body.msgreadowner || 0,
            })
            chat.messages = msg;
            await chat.save();
            return res.json(chat);
        } else {
            let msg = {
                productId: req.body.productId,
                userId: id,
                messages: [],
            };
            msg.messages.push({
                username: req.body.username || BUSINESS_NAME,
                message: req.body.message,
                icon: req.body.icon || 'owner',
                msgread: req.body.msgread || 0,
                msgreadowner: req.body.msgreadowner || 0,
            })
            const newChat = new Chat(msg);
            await newChat.save();
            return res.json(newChat);
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to add a message to the Chat, check chat id and permissions." })
    }
}

const replyMessageChat = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const chat = await Chat.findOne({ productId: req.body.productId, userId: req.body.userId })

        if (chat) {
            const msg = chat.messages;
            msg.push({
                username: req.body.username || BUSINESS_NAME,
                message: req.body.message,
                icon: req.body.icon || 'owner',
                msgread: req.body.msgread || 0,
                msgreadowner: req.body.msgreadowner || 0,
            })
            chat.messages = msg;
            await chat.save();
            return res.json(chat);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Chat Msg Not Found or Insufficient Privileges."
        })

    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to add a message to the Chat, check chat id and permissions." })
    }
}

const chatMarkMessageAsRead = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);
        const chat = await Chat.findOne({ productId: req.body.productId, userId: id });

        if (chat) {
            const chatModified = markChatAsRead(req.body.userType, chat);
            await chatModified.save()
            return res.json(chatModified.messages);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Chat ID Not Found or Insufficient Privileges."
        })
    }
    catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to get messages from the Chat, check chat id and permissions." })
    }
}

const markChatAsRead = (userType, chat) => {
    try {
        if (userType === IS_OWNER) {
            chat.messages.filter(msg => msg.msgreadowner === MSG_UNREAD).map(m => m.msgreadowner = MSG_READ);
        } else {
            chat.messages.filter(msg => msg.msgread === MSG_UNREAD).map(m => m.msgread = MSG_READ);
        }

        return chat;
    } catch (error) {
        throw new Error("Error updating chat: " + error)
    }
}

module.exports = {
    addChatMessageForProduct,
    chatMarkMessageAsRead,
    markChatAsRead,
    replyMessageChat,
    getMessagesByProduct,
}