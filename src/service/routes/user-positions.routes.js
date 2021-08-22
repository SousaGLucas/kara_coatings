const jwt = require("jsonwebtoken");

const router = require("./index");

const { userPositions } = require("../../database/constructors/user-positions.constructors");

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

router.get("/user-positions", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            return userPositions().getAll();
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

router.get("/user-positions-status/:status", (req, res) => {
    const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            return userPositions().getAllActiveOrInactive(data);
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

router.get("/user-positions-id/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            return userPositions().getActiveAndInactiveForId(data);
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

router.get("/user-positions-status-id/:status/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return userPositions().getActiveOrInactiveForId(data);
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

router.get("/user-positions-name/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            return userPositions().getActiveAndInactiveForName(data);
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

router.get("/user-positions-status-name/:status/:name", (req, res) => {
    const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            return userPositions().getActiveOrInactiveForName(data);
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

router.post("/user-positions", (req, res) => {
    const token = req.cookies.token;
    
    const data = {
        position: req.body.position
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return userPositions().insert(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "user position added successfully"
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

router.put("/user-positions/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
        , position: req.body.position
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return userPositions().update(data);
        }).then((result) => {
            const response = {
                "id": result[0].id
                , "msg": "user position changed successfully"
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

router.delete("/user-positions/:id", (req, res) => {
    const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            return userPositions().deleting(data);
        }).then(() => {
            const response = {
                id: data.id
                , msg: "user position deleted successfully"
            };
            res.status(200).send(response);
        }).catch((err) => {
            const error = {
                err: err.err
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
