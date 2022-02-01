const { Router } = require("express");
const { fieldValidator } = require("../middlewares/fieldValidators");
const {
    mercadoPagoGetOrder,
    mercadoPagoCheckout,
    mercadoPagoGetOrders,
    mercadoPagoSaveOrder,
    mercadoPagoUpdateOrder,
    mercadoPagoAddMessageToOrder,
    mercadoPagoMarkMessageAsRead,
    mercadoPagoGetMessagesByOrder,
    checkUserOwner,
    mercadoPagoUpdateOrderStatus,
    mercadoPagoGetOrderStatus,
} = require("../controllers/mercadoPago");
const {
    addChatMessageForProduct,
    replyMessageChat,
    chatMarkMessageAsRead,
    getMessagesByProduct,
    getOpenChats } = require("../controllers/chat");

const router = Router();

// [GET]
router.get("/order/:id", [fieldValidator], mercadoPagoGetOrder);
router.get("/orders", [fieldValidator], mercadoPagoGetOrders);
router.get("/order/messages/:id", [fieldValidator], mercadoPagoGetMessagesByOrder)
router.get("/userowner/:id", [fieldValidator], checkUserOwner)
router.get("/orderstatus", [fieldValidator], mercadoPagoGetOrderStatus);
router.get("/chat/messages/:productId/:userId", [fieldValidator], getMessagesByProduct);
router.get("/chat/open", [fieldValidator], getOpenChats);

// [POST]
router.post("/payment", [fieldValidator], mercadoPagoCheckout);
router.post("/order", [fieldValidator], mercadoPagoSaveOrder);
router.post("/order/message", [fieldValidator], mercadoPagoAddMessageToOrder);
router.post("/chat", [fieldValidator], addChatMessageForProduct);

// [PUT]
router.put("/order", [fieldValidator], mercadoPagoUpdateOrder);
router.put("/order/message/read/:id", [fieldValidator], mercadoPagoMarkMessageAsRead);
router.put("/order/status/:id", [fieldValidator], mercadoPagoUpdateOrderStatus);
router.put("/chat", [fieldValidator], replyMessageChat);
router.put("/chat/message", [fieldValidator], chatMarkMessageAsRead)

module.exports = router;