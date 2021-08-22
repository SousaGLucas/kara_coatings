const jwt = require("jsonwebtoken");

const router = require("./index");

const { providers } = require("../../database/constructors/providers.constructors");

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

router.get("/providers", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            return providers().getAll();
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

router.get("/providers-status/:status", (req, res) => {
    const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            return providers().getAllActiveOrInactive(data);
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

router.get("/providers-status-id/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return providers().getActiveAndInactiveForId(data);
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

router.get("/providers-status-id/:status/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return providers().getActiveOrInactiveForId(data);
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

router.get("/providers-name/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            return providers().getActiveAndInactiveForName(data);
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

router.get("/providers-status-name/:status/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return providers().getActiveOrInactiveForName(data);
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

router.get("/providers-data/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return providers().getData(data);
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

router.post("/providers", (req, res) => {
    const token = req.cookies.token;
    
    const data = {
        status: req.body.status
        , name: req.body.name
        , document: req.body.document
        , email: req.body.email
        , address: req.body.address
        , address_number: req.body.address_number
        , district: req.body.district
        , city: req.body.city
        , state: req.body.state
        , zip_code: req.body.zip_code
        , phone_ddi: req.body.phone_ddi
        , phone_ddd: req.body.phone_ddd
        , phone_number: req.body.phone_number
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return providers().insert(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "provider added successfully"
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

router.put("/providers/:id", (req, res) => {
    const token = req.cookies.token;
    
    const data = {
        id: req.params.id
        , status: req.body.status
        , name: req.body.name
        , document: req.body.document
        , email: req.body.email
        , address: req.body.address
        , address_number: req.body.address_number
        , district: req.body.district
        , city: req.body.city
        , state: req.body.state
        , zip_code: req.body.zip_code
        , phone_ddi: req.body.phone_ddi
        , phone_ddd: req.body.phone_ddd
        , phone_number: req.body.phone_number
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return providers().update(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "provider changed successfully"
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

router.delete("/providers/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return providers().deleting(data);
        }).then(() => {
            response = {
                id: data.id
                , msg: "provider deleted successfully"
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