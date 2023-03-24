// Move all these order's constant into the database
const MSG_UNREAD = 0;
const MSG_READ = 1;
const IS_OWNER = 1;
const IS_NORMAL_USER = 0;
const BUSINESS_NAME = "InnovandoLiving";
const ORDER_PROCESSED = 0;
const ORDER_PENDING_PAYMENT = 12;
const ORDER_FINISHED = 99;

const PAYMENT_METHOD_CREDIT_CARD = "creditcard";
const PAYMENT_METHOD_MERCADOPAGO = "mercadopago";
// Development
const URL_FAILURE_PAYMENT = "http://eqfam:3000/failurepay";
const URL_PENDING_PAYMENT = "http://eqfam:3000/pendingpay";
const URL_SUCCESSFUL_PAYMENT = "http://eqfam:3000/successfulPay";

// Strings
const REQUEST_WITHOUT_TOKEN = "Request without token.";
const ERROR_ADDING_AUDIT_REGISTER =
  "Something went wrong when trying to add a new Audit register.";
const CHAT_ID_NOT_FOUND = "Chat ID Not Found or Insufficient Privileges.";
const CHAT_MSG_NOT_FOUND = "Chat Msg Not Found or Insufficient Privileges.";
const ERROR_RETRIEVING_MSGS =
  "Error when trying to get messages for this chat, check chat id and permissions.";
const ERROR_ADDING_CHAT_MSG =
  "Error when trying to add a message to the Chat, check chat id and permissions.";
const ERROR_GET_UNREAD_MSGS = "Error getting Unread messages";
const ERROR_UPDATE_CHAT = "Error updating chat: ";
const NOT_FOUND_VERIFY_PROD =
  "not found, verify the product sent and try again.";
// Production
// const URL_FAILURE_PAYMENT = "https://innovandoliving.com.ar/failurepay";
// const URL_PENDING_PAYMENT = "https://innovandolivigin.com.ar/pendingpay";
// const URL_SUCCESSFUL_PAYMENT = "https://innovandoliving.com.ar/successfulPay";

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
  REQUEST_WITHOUT_TOKEN,
  ERROR_ADDING_AUDIT_REGISTER,
  CHAT_ID_NOT_FOUND,
  ERROR_RETRIEVING_MSGS,
  ERROR_GET_UNREAD_MSGS,
  NOT_FOUND_VERIFY_PROD,
  CHAT_MSG_NOT_FOUND,
  ERROR_ADDING_CHAT_MSG,
  ERROR_UPDATE_CHAT,
};
