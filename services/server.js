const cors = require("cors");
const express = require("express");
const { dbConnection } = require("./dbconfig");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.mercadoPagoPath = "/api/mercadopago";

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.mercadoPagoPath, require("../routes/mpRoute"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`${SERVER_LISTENING_ON_PORT} ${this.port}`);
    });
  }
}

module.exports = Server;
