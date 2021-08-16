const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("./db");

app.use(express.json());
app.listen(3000);

const globalToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1Y2Fzc291c2EiLCJ1c2VyX3Bvc2l0aW9uIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNjI5MDAxNjgxfQ.4U9aLemrXm68bRO0Yd4U5lLxIZt50IDvqnnYb9_hREw";

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
            if(result.password = hashPassword){
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

// all user positions query proccess

app.get("/user-positions", (req, res) => {
    // const token = req.cookies.token;

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.allUserPositionsQuery()
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active user positions query

app.get("/user-positions-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUserPositionsQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active and inactive user for id query proccess

app.get("/user-positions-id/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeAndInactiveUserPositionsForIdQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active or inactive user for id query proccess

app.get("/user-positions-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
        , status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUserPositionsForIdQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active and inactive user for name query proccess

app.get("/user-positions-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeAndInactiveUserPositionsForNameQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active or inactive user for name query proccess

app.get("/user-positions-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
        , status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUserPositionsForNameQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});


// USERS END-POINTS

// all users query proccess

app.get("/users", (req, res) => {
    // const token = req.cookies.token;

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.allUsersQuery()
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});


// all active or inactive users query proccess

app.get("/users-status/:status", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUsersQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});


// active or inactive user for id query proccess

app.get("/users-status-id/:status/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
        , status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUsersForIdQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active and inactive users for name query proccess

app.get("/users-name/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeAndInactiveUsersForNameQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// active or inactive users for name query proccess

app.get("/users-status-name/:status/:name", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        name: req.params.name
        , status: req.params.status
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.activeOrInactiveUsersForNameQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});

// user data query proccess

app.get("/users-data/:id", (req, res) => {
    // const token = req.cookies.token;

    const userData = {
        id: req.params.id
    };

    jwt.verify(globalToken, process.env.SECRET, (err) => {
        if (err){
            console.log(err);
            res.status(403).end();
        } else {
            db.userDataQuery(userData)
                .then((result) => {
                    res.status(200).send(result);
                }).catch((err) => {
                    console.log(err);
                    res.status(500).end();
                });
        };
    });
});