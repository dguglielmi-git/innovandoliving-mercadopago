const mongoose = require("mongoose");
const { DB_CONNECTION_SUCCESSFULLY } = require("../utils/constants");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(DB_CONNECTION_SUCCESSFULLY);
  } catch (error) {
    console.log(error);
    throw new Error(`${ERROR_CONNECTING_DB} ${error}`);
  }
};

module.exports = {
  dbConnection,
};
