const jwt = require("jsonwebtoken");

const router = require("./index");

const { ProductsStock } = require("../../database/controllers/products-stock.controller");

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

router.get("/products-stock", (req, res) => {
    // const token = req.cookies.token;

    authentication(token)
        .then(() => {
            ProductsStock()
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

router.get("/products-stock-id/:product_id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        product_id: req.params.product_id
    };

    authentication(token)
        .then(() => {
            ProductsStock()
                .getForId(data)
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

// router.post("/products-stock", (req, res) => {
//     // const token = req.cookies.token;
    
//     const data = {
//         product_id: req.body.product_id
//         , amount: parseFloat(req.body.amount)
//     };

//     authentication(token)
//         .then(() => {
//             data.user_id = jwt.decode(token).user_id;
//             ProductsStock()
//                 .insert(data)
//                 .then((result) => {
//                     res.status(200).send({"msg": "product stock added successfully", "id": result[0].id});
//                 }).catch((err) => {
//                         console.log(err);
//                         res.status(500).end();
//                     });
//         }).catch((err) => {
//             console.log(err);
//             res.status(403).end();
//         });
// });

router.put("/products-stock/:product_id", (req, res) => {
    // const token = req.cookies.token;

    const data = {
        product_id: req.params.product_id
        , amount: parseFloat(req.body.amount)
    };

    authentication(token)
        .then(() => {
            data.user_id = jwt.decode(token).user_id;
            ProductsStock()
                .update(data)
                    .then((result) => {
                        res.status(200).send({"msg": "product stock changed successfully", "id": result[0].id});
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