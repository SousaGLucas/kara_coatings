const jwt = require("jsonwebtoken");

const router = require("./index");

const { products } = require("../../database/constructors/products.constructors");

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

router.get("/products", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            return products().getAll();
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

router.get("/products-status/:status", (req, res) => {
    const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            return products().getAllActiveOrInactive(data);
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

router.get("/products-status-id/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return products().getActiveAndInactiveForId(data);
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

router.get("/products-status-id/:status/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return products().getActiveOrInactiveForId(data);
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

router.get("/products-name/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            return products().getActiveAndInactiveForName(data);
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

router.get("/products-status-name/:status/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return products().getActiveOrInactiveForName(data);
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

router.get("/products-data/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return products().getData(data);
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

router.post("/products", (req, res) => {
    const token = req.cookies.token;
    
    const data = {
        product_group: req.body.product_group
        , status: req.body.status
        , unit: req.body.unit
        , name: req.body.name
        , cost_price: parseFloat(req.body.cost_price)
        , profit_margin: parseFloat(req.body.profit_margin)
        , sale_price: parseFloat(req.body.sale_price)
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return products().insert(data);
        }).then((result) => {
            const response = {
                "id": result.product_id
                , "msg": "product added successfully"
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

router.put("/products/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , product_group: req.body.product_group
        , status: req.body.status
        , unit: req.body.unit
        , name: req.body.name
        , cost_price: parseFloat(req.body.cost_price)
        , profit_margin: parseFloat(req.body.profit_margin)
        , sale_price: parseFloat(req.body.sale_price)
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return products().update(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "product changed successfully"
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

router.delete("/products/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return products().deleting(data);
        }).then(() => {
            const response = {
                id: data.id
                , msg: "product deleted successfully"
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