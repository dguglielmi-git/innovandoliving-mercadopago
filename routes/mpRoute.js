const { Router } = require("express");
const { fieldValidator } = require("../middlewares/fieldValidators");
const { mercadoPagoCheckout } = require("../controllers/mercadoPago");

const router = Router();

router.post("/payment",[fieldValidator], mercadoPagoCheckout);

module.exports = router;