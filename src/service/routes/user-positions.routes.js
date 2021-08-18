const jwt = require("jsonwebtoken");

const router = require("./index");

const { UserPositions } = require("../../database/controllers/user-positions.controller");

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

router.get("/user-positions", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            UserPositions()
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

router.get("/user-positions-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            UserPositions()
                .getAllActiveOrInactive(data)
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

router.get("/user-positions-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            UserPositions()
                .getActiveAndInactiveForId(data)
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

router.get("/user-positions-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            UserPositions()
                .getActiveOrInactiveForId(data)
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

router.get("/user-positions-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            UserPositions()
                .getActiveAndInactiveForName(data)
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

router.get("/user-positions-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            UserPositions()
                .getActiveOrInactiveForName(data)
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

router.post("/user-positions", (req, res) => {
    // const token = req.cookies.token;
    
    const data = {
        position: req.body.position
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            console.log(data);
            UserPositions()
                .insert(data)
                .then((result) => {
                    res.status(200).send({"msg": "user position added successfully", "id": result[0].id});
                }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/user-positions/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , position: req.body.position
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            UserPositions()
                .update(data)
                    .then((result) => {
                        res.status(200).send({"msg": "user position changed successfully", "id": result[0].id});
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

module.exports = router;
