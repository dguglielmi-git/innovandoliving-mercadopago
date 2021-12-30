const mercadopago = require("mercadopago");
const Order = require("../models/order");
const Owner = require("../models/owner");
const OrderStatus = require("../models/orderStatus");
const jwt = require("jsonwebtoken");
const {
    ORDER_PROCESSED,
    ORDER_FINISHED,
    BUSINESS_NAME,
    MSG_READ,
    MSG_UNREAD,
    IS_OWNER,
    URL_PENDING_PAYMENT,
    URL_FAILURE_PAYMENT,
    URL_SUCCESSFUL_PAYMENT,
} = require("../utils/constants");
const {
    HTTP_UNAUTHORIZED,
    HTTP_NOT_FOUND,
} = require("../utils/httpCode");

mercadopago.configure({
    access_token: "APP_USR-4751668688491134-091522-e8ef3bd5e2dc07cd41183d8cd311df2c-825156262",
});

const mercadoPagoCheckout = (req, res) => {
    const { items } = req.body;

    if (items === undefined) {
        res.status(HTTP_NOT_FOUND);
        res.send(JSON.stringify({ error: "No items received" }));
    } else {
        let preference = {
            back_urls: {
                failure: URL_FAILURE_PAYMENT,
                pending: URL_PENDING_PAYMENT,
                success: URL_SUCCESSFUL_PAYMENT,
            },
            auto_return: "approved",
            statement_descriptor: BUSINESS_NAME,
            items,
        };

        mercadopago.preferences
            .create(preference)
            .then(function (response) {
                res.send(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

const mercadoPagoSaveOrder = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY)
        const order = new Order(req.body);
        order.userId = id;
        order.status = ORDER_PROCESSED;
        order.status_history = {
            status: ORDER_PROCESSED,
        }
        await order.save()
    } catch (error) {
        console.log(error);
        return res.json({ "response": "Error when trying to save the Order. - errormsg: " + error })
    }
    res.json({ "response": "Data received" })
}

const mercadoPagoUpdateOrder = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);
        const order = Order.findOneAndUpdate(
            {
                userId: id, paymentId: req.body.mercadoPagoPreferenceId
            }, {
            mercadoPagoStatus: req.body.mercadoPagoStatus,
            mercadoPagoPaymentId: req.body.mercadoPagoPaymentId,
            mercadoPagoPaymentType: req.body.mercadoPagoPaymentType,
            mercadoPagoMerchantOrderId: req.body.mercadoPagoMerchantOrderId,
            mercadoPagoProcessingMode: req.body.mercadoPagoProcessingMode
        }, { new: true }, function (err, task) {
            if (err)
                res.send(err);
            res.json(task);
        }).clone();
    }
    catch (error) {
        console.log(error);
        return res.json({ "response": "Error when trying to update the Order. - errormsg: " + error });
    }
}

const mercadoPagoGetOrderStatus = async (req, res) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: "Request without token."
        })
    }

    try {
        const orderStatus = await OrderStatus.find();

        return res.json(orderStatus);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}

const mercadoPagoGetOrder = async (req, res) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: "Request without token."
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);
        const order = await Order.findOne({ _id: req.params.id }).where({ userId: id });
        return res.json(order);
    } catch (error) {
        console.log(error);
        return res.status(HTTP_NOT_FOUND).json({
            error: "Something went wrong - error: " + error
        })
    }
}

const mercadoPagoGetOrders = async (req, res) => {
    const token = req.header('x-token');
    const filter = req.header('active');

    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: "Request without token."
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);
        const owner = await Owner.findOne({}).where({ userOwnerId: id });

        let whereData = {};
        if (owner) {
            try {
                if (owner.userOwnerId === id) {
                    whereData = (filter == 'true')
                        ? { status: { $ne: ORDER_FINISHED } }
                        : { status: ORDER_FINISHED };
                } else {
                    whereData = { userId: id };
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            whereData = { userId: id };
        }

        const orders = await Order.find({}).where(whereData).sort({ dateCreated: -1 });
        return res.json(orders);

    } catch (error) {
        console.log(error);
        return res.status(HTTP_NOT_FOUND).json({
            error: "Something went wrong - error: " + error
        })
    }
}

const checkUserOwner = async (req, res) => {

    const owner = await Owner.findOne({}).where({ userOwnerId: req.params.id });
    if (owner) {
        return res.json({ result: true });
    } else {
        return res.json({ result: false })
    }
}

const mercadoPagoUpdateOrderStatus = async (req, res) => {
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

        const order = await Order.findOne({ _id: req.params.id }).where(whereCondition);

        if (order) {
            const history = order.status_history;

            history.push({
                status: req.body.status,
            })

            order.status = req.body.status;
            order.status_history = history;
            if (req.body.status == ORDER_FINISHED) {
                order.dateClosed = Date.now()
            }
            await order.save();
            return res.json(order);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Order ID Not Found or Insufficient Privileges."
        })
    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to add a status to the History, check order id and permissions." })
    }
}

const mercadoPagoAddMessageToOrder = async (req, res) => {
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

        const order = await Order.findOne({ _id: req.body.orderId }).where(whereCondition);

        if (order) {
            const msg = order.messages;
            msg.push({
                username: req.body.username || BUSINESS_NAME,
                message: req.body.message,
                icon: req.body.icon || 'owner',
                msgread: req.body.msgread || 0,
                msgreadowner: req.body.msgreadowner || 0,
            })
            order.messages = msg;
            await order.save();
            return res.json(order);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Order ID Not Found or Insufficient Privileges."
        })

    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to add a message to the Order, check order id and permissions." })
    }
}

const markAsRead = (userType, order) => {
    try {
        if (userType === IS_OWNER) {
            order.messages.filter(msg => msg.msgreadowner === MSG_UNREAD).map(m => m.msgreadowner = MSG_READ);
        } else {
            order.messages.filter(msg => msg.msgread === MSG_UNREAD).map(m => m.msgread = MSG_READ);
        }

        return order;
    } catch (error) {
        throw new Error("Error updating order: " + error)
    }
}

const mercadoPagoMarkMessageAsRead = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);
        const order = await Order.findOne({ _id: req.params.id, user: id });

        if (order) {
            const orderModified = markAsRead(req.body.userType, order);
            await orderModified.save()
            return res.json(orderModified.messages);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Order ID Not Found or Insufficient Privileges."
        })
    }
    catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to get messages from the Order, check order id and permissions." })
    }
}

const mercadoPagoGetMessagesByOrder = async (req, res) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_UNAUTHORIZED).json({
            error: 'Request without token.'
        })
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETJWTKEY);

        const order = await Order.findOne({ _id: req.params.id, user: id });
        if (order) {
            return res.json(order.messages);
        }
        return res.status(HTTP_NOT_FOUND).json({
            "response": "Order ID Not Found or Insufficient Privileges."
        })
    } catch (error) {
        console.log(error);
        return res.status(HTTP_UNAUTHORIZED).json({ "response": "Error when trying to get messages from the Order, check order id and permissions." })
    }
}


module.exports = {
    mercadoPagoCheckout,
    mercadoPagoSaveOrder,
    mercadoPagoUpdateOrder,
    mercadoPagoAddMessageToOrder,
    mercadoPagoGetOrder,
    mercadoPagoGetOrders,
    mercadoPagoMarkMessageAsRead,
    mercadoPagoGetMessagesByOrder,
    markAsRead,
    checkUserOwner,
    mercadoPagoUpdateOrderStatus,
    mercadoPagoGetOrderStatus,
};