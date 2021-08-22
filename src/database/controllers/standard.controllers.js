const connectDataBase = require("../database");

const standardExecution = (query, values) => {
    return new Promise((resolve, reject) => {
        connectDataBase()
            .then((client) => {
                return client.query(query, values);
            }).then((result) => {
                resolve(result.rows);
            }).catch((err) => {
                reject({
                    type: "internal"
                    , err: err
                });
            });
    });
};

module.exports = standardExecution;