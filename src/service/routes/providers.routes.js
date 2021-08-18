const jwt = require("jsonwebtoken");

const router = require("./index");

const { Providers } = require("../../database/controllers/providers.controler");

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

router.get("/providers", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        status: req.params.status
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.get("/providers-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        id: req.params.id
    };

    authentication(token)
        .then(() => {
            Providers()
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

router.post("/providers", (req, res) => {
    // const token = req.cookies.token;
    
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
            Providers()
                .insert(data)
                    .then((result) => {
                        res.status(200).send({"msg": "provider added successfully", "id": result[0].id});
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).end();
                    });
        }).catch((err) => {
            console.log(err);
            res.status(403).end();
        });
});

router.put("/providers/:id", (req, res) => {
    // const token = req.cookies.token;
    
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
            Providers()
                .update(data)
                    .then((result) => {
                        res.status(200).send({"msg": "provider changed successfully", "id": result[0].id});
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