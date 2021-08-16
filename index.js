const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");
const { resolve } = require("path");
const { rejects } = require("assert");

app.use(express.json());
app.listen(3000);

const globalToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1Y2Fzc291c2EiLCJ1c2VyX3Bvc2l0aW9uIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNjI5MDAxNjgxfQ.4U9aLemrXm68bRO0Yd4U5lLxIZt50IDvqnnYb9_hREw";

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

//login proccess

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userCredential = {
        username: username
    };

    const hashPassword = crypto
        .createHash("sha256")
        .update(password.toString())
        .digest("hex");

    db.userCredentialLookup(userCredential)
        .then((result) => {
            if(result[0].password = hashPassword){
                const token = jwt.sign({
                        username: result.username
                        , user_position: result.user_position
                    }
                    , process.env.SECRET
                );

                res.cookie("token", token, {secure: true, httpOnly: true});
                res.status(200).end();
            } else {
                res.status(403).end();
            };
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});



// USER POSITIONS END-POINTS

app.get("/user-positions", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
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

app.get("/user-positions-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
                .getAllActiveOrInactive(userData)
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

app.get("/user-positions-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
                .getActiveAndInactiveForId(userData)
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

app.get("/user-positions-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
                .getActiveOrInactiveForId(userData)
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

// active and inactive user for name query proccess

app.get("/user-positions-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
                .getActiveAndInactiveForName(userData)
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

app.get("/user-positions-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.UserPositions()
                .getActiveOrInactiveForName(userData)
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



// USERS END-POINTS

app.get("/users", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.Users()
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

app.get("/users-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getAllActiveOrInactive(userData)
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

app.get("/users-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getActiveAndInactiveForId(userData)
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

app.get("/users-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getActiveOrInactiveForId(userData)
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

app.get("/users-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getActiveAndInactiveForName(userData)
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

app.get("/users-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getActiveOrInactiveForName(userData)
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

app.get("/users-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Users()
                .getData(userData)
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



// PROVIDERS END-POINTS

app.get("/providers", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.Providers()
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

app.get("/providers-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getAllActiveOrInactive(providerData)
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

app.get("/providers-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getActiveAndInactiveForId(providerData)
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

app.get("/providers-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getActiveOrInactiveForId(providerData)
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

app.get("/providers-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getActiveAndInactiveForName(providerData)
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

app.get("/providers-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getActiveOrInactiveForName(providerData)
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

app.get("/providers-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const providerData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Providers()
                .getData(providerData)
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



// PRODUCT GROUPS END-POINTS

app.get("/product-groups", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
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

app.get("/product-groups-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const productGroupData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
                .getAllActiveOrInactive(productGroupData)
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

app.get("/product-groups-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const productGroupData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
                .getActiveAndInactiveForId(productGroupData)
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

app.get("/product-groups-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const productGroupData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
                .getActiveOrInactiveForId(productGroupData)
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

app.get("/product-groups-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const productGroupData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
                .getActiveAndInactiveForName(productGroupData)
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

app.get("/product-groups-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const productGroupData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.ProductGroups()
                .getActiveOrInactiveForName(productGroupData)
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



// UNITS END-POINTS

app.get("/units", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.Units()
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

app.get("/units-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const unitData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Units()
                .getAllActiveOrInactive(unitData)
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

app.get("/units-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const unitData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Units()
                .getActiveAndInactiveForId(unitData)
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

app.get("/units-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const unitData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Units()
                .getActiveOrInactiveForId(unitData)
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

app.get("/units-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const unitData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.Units()
                .getActiveAndInactiveForName(unitData)
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

app.get("/units-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const unitData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Units()
                .getActiveOrInactiveForName(unitData)
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



// PRODUCTS END-POINTS

app.get("/products", (req, res) => {
    // const token = req.cookies.token;

    authentication(globalToken)
        .then(() => {
            db.Products()
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

app.get("/products-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getAllActiveOrInactive(productData)
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

app.get("/products-status-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getActiveAndInactiveForId(productData)
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

app.get("/products-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        id: req.params.id
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getActiveOrInactiveForId(productData)
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

app.get("/products-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        name: req.params.name
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getActiveAndInactiveForName(productData)
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

app.get("/products-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        name: req.params.name
        , status: req.params.status
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getActiveOrInactiveForName(productData)
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

app.get("/products-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const productData = {
        id: req.params.id
    };

    authentication(globalToken)
        .then(() => {
            db.Products()
                .getData(productData)
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

