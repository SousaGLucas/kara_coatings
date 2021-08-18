const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const router = require("./index");

const { login } = require("../../database/controllers/authentication.controller");

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
                res.status(403).end();
            };
        }).catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

module.exports = router;