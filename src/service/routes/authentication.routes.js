const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const router = require("./index");

const { login } = require("../../database/constructors/authentication.constructors");

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

router.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const data = {
        username: username
    };

    const hashPassword = crypto
        .createHash("sha256")
        .update(password.toString())
        .digest("hex");

    login(data)
        .then((result) => {
            if (result.length === 0){
                res.status(403).send("user not found");
            } else {
                if(result[0].password = hashPassword){
                    const token = jwt.sign({
                            user_id: result.id
                            , username: result.username
                            , user_position: result.user_position
                        }
                        , process.env.SECRET
                    );
    
                    res.cookie("token", token, {secure: true, httpOnly: true});
                    res.status(200).end();
                } else {
                    res.status(403).send("incorrect password");
                };
            };
        }).catch((err) => {
            const error = {
                err: err
            };

            errorRecord(error);
            res.status(500).send("internal error");
        });
});

router.post("/logout", (req, res) => {
    const token = req.cookies.token;

    authentication(token)
        .then(() => {
            res.status(200).send();
        }).catch((err) => {
            res.status(403).send(err.err);
        });
});

module.exports = router;