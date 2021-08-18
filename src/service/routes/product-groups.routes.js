const jwt = require("jsonwebtoken");

const router = require("./index");

const { ProductGroups } = require("../../database/controllers/product-groups.controller");

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

router.get("/product-groups", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.get("/product-groups-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.get("/product-groups-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.get("/product-groups-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.get("/product-groups-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.get("/product-groups-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            ProductGroups()
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

router.post("/product-groups", (req, res) => {
    // const token = req.cookies.token;
    
    const data = {
        name: req.body.name
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            console.log(data);
            ProductGroups()
                .insert(data)
                .then((result) => {
                    res.status(200).send({"msg": "product groups added successfully", "id": result[0].id});
                }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/product-groups/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , name: req.body.name
        , status: req.body.status 
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            ProductGroups()
                .update(data)
                    .then((result) => {
                        res.status(200).send({"msg": "product groups changed successfully", "id": result[0].id});
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