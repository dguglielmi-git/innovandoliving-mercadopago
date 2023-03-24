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
const GENERIC_ERROR_MSG = "Something went wrong";
const GENERIC_ERROR_DETAILED = "Something went wrong - error: ";
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
const ERROR_UPDATE_ORDER = "Error updating order: ";
const NOT_FOUND_VERIFY_PROD =
  "not found, verify the product sent and try again.";
const NOT_ITEMS_RECEIVED = "No items received";
const APPROVED_STATUS = "approved";
const MERCADOPAGO_CREDIT_CARD = "credit_card";
const INSUFFICIENT_PRIVILEGES = "Insufficient privileges.";
const ORDER_SUCCESSFULLY_REMOVED = "Order successfully removed.";
const ORDER_ID_NOT_FOUND = "Order ID Not Found or Insufficient Privileges.";
const ERROR_SAVING_ORDER = "Error when trying to save the Order. - errormsg: ";
const ERROR_UPDATING_ORDER =
  "Error when trying to update the Order. - errormsg: ";
const ORDER_WITHOUT_PENDING_BALANCE = "No Pending Balance for this order.";
const ERROR_ADDING_STATUS_HISTORY =
  "Error when trying to add a status to the History, check order id and permissions.";
const ERROR_ADDING_MSG_ORDER =
  "Error when trying to add a message to the Order, check order id and permissions.";
const ERROR_RETRIEVING_MSGS_ORDER =
  "Error when trying to get messages from the Order, check order id and permissions.";
const DB_CONNECTION_SUCCESSFULLY = "DB Connection succesfully.";
const ERROR_CONNECTING_DB = "Error connecting to DB: ";
const SERVER_LISTENING_ON_PORT = "Server listening on port ";

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
  NOT_ITEMS_RECEIVED,
  APPROVED_STATUS,
  INSUFFICIENT_PRIVILEGES,
  ORDER_SUCCESSFULLY_REMOVED,
  ORDER_ID_NOT_FOUND,
  ERROR_SAVING_ORDER,
  MERCADOPAGO_CREDIT_CARD,
  ERROR_UPDATING_ORDER,
  GENERIC_ERROR_MSG,
  GENERIC_ERROR_DETAILED,
  ORDER_WITHOUT_PENDING_BALANCE,
  ERROR_ADDING_STATUS_HISTORY,
  ERROR_ADDING_MSG_ORDER,
  ERROR_UPDATE_ORDER,
  ERROR_RETRIEVING_MSGS_ORDER,
  DB_CONNECTION_SUCCESSFULLY,
  ERROR_CONNECTING_DB,
  SERVER_LISTENING_ON_PORT,
};
