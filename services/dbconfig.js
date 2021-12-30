const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connection succesfully.");
    } catch (error) {
        console.log(error);
        throw new Error(`Error connecting to DB: ${error}`);
    }
};

module.exports = {
    dbConnection,
};