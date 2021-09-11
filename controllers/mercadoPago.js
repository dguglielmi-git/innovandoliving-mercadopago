const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: "TEST-654019751816075-052005-b2014b5e220c4922b34e2321c223f266-231512312",
});

const mercadoPagoCheckout = (req, res) => {
    const { items } = req.body;
    if (items === undefined) {
        res.status(404);
        res.send(JSON.stringify({ error: "No items received" }));
    } else {
        let preference = {
            back_urls: {
                failure: "https://littleamsterdam.com.ar/mp",
                pending: "https://littleamsterdam.com.ar/mp",
                success: "https://littleamsterdam.com.ar/mp",
            },
            auto_return: "approved",
            items,
        };

        mercadopago.preferences
            .create(preference)
            .then(function (response) {
                res.send(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

module.exports = {
    mercadoPagoCheckout,
};
