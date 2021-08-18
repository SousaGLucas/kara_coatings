const jwt = require("jsonwebtoken");

const router = require("./index");

const { Units } = require("../../database/controllers/units.controler");

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

router.get("/units", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            Units()
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

router.get("/units-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            Units()
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

router.get("/units-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            Units()
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

router.get("/units-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            Units()
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

router.get("/units-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            Units()
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

router.get("/units-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            Units()
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

router.post("/units", (req, res) => {
    // const token = req.cookies.token;
    
    const data = {
        description: req.body.description
        , status: req.body.status
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            Units()
                .insert(data)
                .then((result) => {
                    res.status(200).send({"msg": "unit added successfully", "id": result[0].id});
                }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/units/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , description: req.body.description
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            Units()
                .update(data)
                    .then((result) => {
                        res.status(200).send({"msg": "unit changed successfully", "id": result[0].id});
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