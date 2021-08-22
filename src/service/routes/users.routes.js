const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = require("./index");

const { users } = require("../../database/constructors/users.constructors");

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

router.get("/users", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            return users().getAll();
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

router.get("/users-status/:status", (req, res) => {
    const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            return users().getAllActiveOrInactive(data);
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

router.get("/users-status-id/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return users().getActiveAndInactiveForId(data);
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

router.get("/users-status-id/:status/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return users().getActiveOrInactiveForId(data)
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

router.get("/users-name/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            return users().getActiveAndInactiveForName(data);
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

router.get("/users-status-name/:status/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return users().getActiveOrInactiveForName(data);
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

router.get("/users-data/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return users().getData(data);
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

router.post("/users", (req, res) => {
    const token = req.cookies.token;

    const hashPassword = crypto
        .createHash("sha256")
        .update(req.body.password.toString())
        .digest("hex");
    
    const data = {
        position: req.body.position
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
        , username: req.body.username
        , password: hashPassword
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return users().insert(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "user added successfully"
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

router.put("/users/:id", (req, res) => {
    const token = req.cookies.token;

    const hashPassword = crypto
        .createHash("sha256")
        .update(req.body.password.toString())
        .digest("hex");
    
    const data = {
        id: req.params.id
        , position: req.body.position
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
        , username: req.body.username
        , password: hashPassword
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return users().update(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "user changed successfully"
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

router.delete("/users/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return users().deleting(data);
        }).then(() => {
            const response = {
                id: data.id
                , msg: "user deleted successfully"
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