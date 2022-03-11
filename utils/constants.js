
// Move all these order's constant into the database
const MSG_UNREAD = 0;
const MSG_READ = 1;
const IS_OWNER = 1;
const IS_NORMAL_USER = 0;
const BUSINESS_NAME = "InnovandoLiving";
const ORDER_PROCESSED = 0;
const ORDER_PENDING_PAYMENT = 12;
const ORDER_FINISHED = 99;

const PAYMENT_METHOD_CREDIT_CARD = 'creditcard';
const PAYMENT_METHOD_MERCADOPAGO = 'mercadopago';
// Development
// const URL_FAILURE_PAYMENT = "http://eqfam:3000/failurepay";
// const URL_PENDING_PAYMENT = "http://eqfam:3000/pendingpay";
// const URL_SUCCESSFUL_PAYMENT = "http://eqfam:3000/successfulPay";

// Production
const URL_FAILURE_PAYMENT = "https://innovandoliving.com.ar/failurepay";
const URL_PENDING_PAYMENT = "https://innovandolivigin.com.ar/pendingpay";
const URL_SUCCESSFUL_PAYMENT = "https://innovandoliving.com.ar/successfulPay";

module.exports = {
    MSG_READ,
    MSG_UNREAD,
    ORDER_PROCESSED,
    ORDER_PENDING_PAYMENT,
    ORDER_FINISHED,
    BUSINESS_NAME,
    IS_NORMAL_USER,
    IS_OWNER,
    URL_PENDING_PAYMENT,
    URL_FAILURE_PAYMENT,
    URL_SUCCESSFUL_PAYMENT,
    PAYMENT_METHOD_CREDIT_CARD,
    PAYMENT_METHOD_MERCADOPAGO,
}