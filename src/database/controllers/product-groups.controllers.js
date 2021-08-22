const connectDataBase = require("../database");

const productGroupDeletingExecution = (
    itemDeletedVerificationQuery
    , itemInProductsTableVerificationQuery
    , deletingitemQuery
    , itemDeletedVerificationValues
    , itemInProductsTableVerificationValues
    , deletingitemValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query(
                    itemDeletedVerificationQuery
                    , itemDeletedVerificationValues
                );
            }).then((result) => {
                if (result.rows.length === 0){
                    return client.connection.query(
                        itemInProductsTableVerificationQuery
                        , itemInProductsTableVerificationValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "item cannot be deleted"
                    };
                };
            }).then((result) => {
                if (result.rows.length === 0){
                    return client.connection.query(
                        deletingitemQuery
                        , deletingitemValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "item cannot be deleted"
                    };
                };
            }).then(() => {
                resolve();
            }).catch((err) => {
                if (err.type){
                    reject({
                        type: err.type
                        , err: err.err
                    });
                } else {
                    reject({
                        type: "internal"
                        , err: err
                    });
                };
            });
    });
};

module.exports = productGroupDeletingExecution;