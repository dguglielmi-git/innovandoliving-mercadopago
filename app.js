require("dotenv").config();
const Server = require("./services/server");

const server = new Server();
server.listen();
