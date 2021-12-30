const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
    addressDelivery: {},
    addressInvoice: {},
    addressTransport: {},
    costDelivery: Schema.Types.Decimal128,
    dateCreated: { type: Date, default: Date.now },
    dateClosed: { type: Date },
    deliveryOption: String,
    orderCollectorId: String,
    OrderPreferenceId: String,
    items: [{}],
    messages: [{
        username: String,
        icon: String,
        messageDate: {
            type: Date,
            default: Date.now,
        },
        message: String,
        msgread: Number,
        msgreadowner: Number,
    }],
    purchaseTotalAmount: Schema.Types.Decimal128,
    status: Number,
    status_history: [{
        status: Number,
        createAt: {
            type: Date,
            default: Date.now,
        },
    }],
    userId: String,
    paymentId: String,
    mercadoPagoStatus: String,
    mercadoPagoPaymentId: String,
    mercadoPagoPaymentType: String,
    mercadoPagoMerchantOrderId: String,
    mercadoPagoProcessingMode: String,
});

module.exports = model('Order', OrderSchema);
