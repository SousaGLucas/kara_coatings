const jwt = require("jsonwebtoken");

const router = require("./index");

const { PurchaseOrders } = require("../../database/controllers/purchase-orders.controller");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Imx1Y2Fzc291c2EiLCJ1c2VyX3Bvc2l0aW9uIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNjI5MjA4OTk2fQ.SMwdN94BxFk9nUhgd0Q4B0J5jd0V3AWCpb3mrSQnqqY";

const authentication = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET, (err) => {
            if (err){
                reject(err);
            } else {
                resolve();
            };
        });
    });
};

router.get("/purchase-orders", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            PurchaseOrders()
                .getAll()
                    .then((result) => {
                        res.status(200).send(result);
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.get("/purchase-orders-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            PurchaseOrders()
                .getAllOpenOrCanceledOrReceived(data)
                    .then((result) => {
                        res.status(200).send(result);
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.get("/purchase-orders-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            PurchaseOrders()
                .getData(data)
                    .then((result) => {
                        res.status(200).send(result);
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.post("/purchase-orders", (req, res) => {
    // const token = req.cookies.token;
    
    const data = {
        provider: req.body.provider
        , status: req.body.status
        , total: parseFloat(req.body.total)
        , items: req.body.items
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            PurchaseOrders()
                .insert(data)
                    .then((result) => {
                        res.status(200).send({
                            "msg": "purchase order added successfully"
                            , "id": result[0].purchase_order_header_id});
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/purchase-orders/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.body.status
        , total: parseFloat(req.body.total)
        , items: req.body.items
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            PurchaseOrders()
                .update(data)
                    .then((result) => {
                        res.status(200).send({
                            "msg": "purchase order changed successfully"
                            , "id": result[0].purchase_order_header_id
                        });
                    }).catch((err) => {
                        console.dir(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/purchase-orders-closing/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            PurchaseOrders()
                .closing(data)
                    .then((result) => {
                        res.status(200).send({
                            "msg": "purchase order closing successfully"
                            , "id": result[0].id
                        });
                    }).catch((err) => {
                        console.dir(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/purchase-orders-receiving/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            PurchaseOrders()
                .receiving(data)
                    .then((result) => {
                        res.status(200).send({
                            "msg": "purchase order receiving successfully"
                        });
                    }).catch((err) => {
                        console.dir(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

module.exports = router;