const Server = require('./services/server')
require("dotenv").config();

const server = new Server();
server.listen();
