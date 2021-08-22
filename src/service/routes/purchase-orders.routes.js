const jwt = require("jsonwebtoken");

const router = require("./index");

const { purchaseOrders } = require("../../database/constructors/purchase-orders.constructors");

const errorRecord = require("../../log/log-record");

const authentication = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err){
                const error = {
                    type: "forbidden"
                    , err: err
                };
                reject(error);
            } else {
                resolve();
            };
        });
    });
};

router.get("/purchase-orders", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            return purchaseOrders().getAll();
        }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.get("/purchase-orders-status/:status", (req, res) => {
    const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            return purchaseOrders().getAllOpenOrCanceledOrReceived(data);
        }).then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.get("/purchase-orders-data/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    const response = {};

    authentication(token)
        .then(() => {
            return purchaseOrders().getData(data);
        }).then((result) => {
            response.data = result[0];
            return purchaseOrders().getItems(data);
        }).then((result) => {
            response.data.items = result;
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.post("/purchase-orders", (req, res) => {
    const token = req.cookies.token;
    
    const data = {
        provider_id: req.body.provider_id
        , status: req.body.status
        , total: parseFloat(req.body.total)
        , items: req.body.items
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return purchaseOrders().insert(data);
        }).then((result) => {
            const response = {
                "id": result.purchase_order_header_id
                , "msg": "purchase order added successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.put("/purchase-orders/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , provider_id: req.body.provider_id
        , status: req.body.status
        , total: parseFloat(req.body.total)
        , items: req.body.items
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return purchaseOrders().update(data);
        }).then(() => {
            const response = {
                "id": data.id
                , "msg": "purchase order changed successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.put("/purchase-orders-closing/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , provider_id: req.body.provider_id
        , status: req.body.status
        , installments_number: req.body.installments_number
        , value: req.body.value
        , payment_forecast: req.body.payment_forecast
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return purchaseOrders().closing(data);
        }).then(() => {
            const response = {
                "id": data.id
                , "msg": "purchase order closing successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.put("/purchase-orders-receiving/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return purchaseOrders().receiving(data);
        }).then(() => {
            response = {
                id: data.id
                , "msg": "purchase order receiving successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

router.delete("/purchase-orders/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return purchaseOrders().deleting(data);
        }).then(() => {
            const response = {
                id: data.id
                , msg: "purchase order deleted successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err
            };

            switch (err.type){
                case "forbidden":
                    res.status(403).send(err.err);
                    break;
                case "internal":
                    errorRecord(error);
                    res.status(500).send("internal error");
                    break;
                default:
                    break;
            };
        });
});

module.exports = router;