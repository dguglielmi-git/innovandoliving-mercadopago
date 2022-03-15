const Chat = require('../models/chat');
const Owner = require("../models/owner");
const Order = require("../models/order");
const Product = require('../models/producto');
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
        return res.status(HTTP_UNAUTHORIZED).json({ "error": "Error when trying to get messages for this chat, check chat id and permissions." })
    }
}

const getProduct = async (productId) => {
    const product = await Product.findOne({ _id: productId });
    if (product) {
        return product;
    }
    return null;
}

const countClientUnreadMsg = (order) => order.reduce(
    (sum, acum) => sum + (acum.messages.filter(msg => msg.msgread === 0).length), 0);

const countOwnerUnreadMsg = (order) => order.reduce(
    (sum, acum) => sum + (acum.messages.filter(msg => msg.msgreadowner === 0).length), 0);

const getUnreadMsg = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    const { id } = jwt.verify(token, process.env.SECRETJWTKEY);

    try {
        const owner = await Owner.findOne({}).where({ userOwnerId: id });
        let whereQueries = (owner)
            ? { unreadmsgs: { $gt: 0 } }
            : { userId: id, clientUnreadMsg: { $gt: 0 } };

        let whereOrders = (owner)
            ? { status: { $ne: 99 } }
            : { userId: id, status: { $ne: 99 } };

        const queryCount = await Chat.find(whereQueries).count();
        const orderCount = await Order.find(whereOrders);

        const unreadMsgs = (owner)
            ? countOwnerUnreadMsg(orderCount)
            : countClientUnreadMsg(orderCount);

        return res.json(
            {
                "queryCounter": queryCount || 0,
                "ordersCounter": unreadMsgs || 0
            });

    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "error": "Error getting Unread messages" + error })
    }
}

const getOpenChats = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    const { id } = jwt.verify(token, process.env.SECRETJWTKEY);

    try {
        const owner = await Owner.findOne({}).where({ userOwnerId: id });
        if (!owner) {
            const chat = await Chat.find({ status: 'open' }).where({ userId: id });
            if (chat) {
                return res.json(chat);
            }
            return res.status(HTTP_NOT_FOUND).json({
                "error": "Chat ID Not Found or Insufficient Privileges."
            })
        }
        const chat = await Chat.find({ status: 'open' });
        if (chat) {
            return res.json(chat);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "error": "Chat ID Not Found or Insufficient Privileges."
        })

    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "error": "Error when trying to get messages for this chat, check chat id and permissions." })
    }
}

const closeChatForProduct = async (req, res) => {
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
            chat.unreadmsgs = 0;
            chat.status = 'closed';
            chat.closedAt = Date.now();
            await chat.save();
            return res.json(chat);
        }
        return res.status(HTTP_NOT_FOUND).json({ "error": "productId: " + req.body.productId + " & userId: " + id + " not found." });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to add a message to the Chat, check chat id and permissions." })
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
            if (!owner) {
                chat.unreadmsgs = chat.unreadmsgs + 1;
            } else {
                chat.clientUnreadMsg = chat.clientUnreadMsg + 1;
            }
            await chat.save();
            return res.json(chat);
        } else {
            const product = await getProduct(req.body.productId);

            if (!product) {
                return res.status(HTTP_NOT_FOUND).json({
                    "response": `productId: ${req.body.productId} not found, verify the product sent and try again.`
                })
            }

            let msg = {
                productName: req.body.productName,
                username: req.body.username,
                productId: req.body.productId,
                userId: id,
                createAt: Date.now(),
                status: 'open',
                unreadmsgs: 1,
                clientUnreadMsg: 0,
                url: product.url,
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
        const chat = await Chat.findOne({ productId: req.body.productId, userId: req.body.userId });

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
            chat.unreadmsgs = 0;
        } else {
            chat.messages.filter(msg => msg.msgread === MSG_UNREAD).map(m => m.msgread = MSG_READ);
            chat.clientUnreadMsg = 0;
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
    closeChatForProduct,
    getOpenChats,
    getUnreadMsg,
}