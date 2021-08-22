const connectDataBase = require("../database");


const providersInsertOrUpdateExecution = (
    documentVerificationQuery
    , insertQuery
    , documentVerificationValues
    , insertValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query(
                    documentVerificationQuery
                    , documentVerificationValues
                );
            }).then((result) => {
                if (result.rows.length === 0){
                    return client.connection.query(
                        insertQuery
                        , insertValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "document already exists"
                    };
                };
            }).then((result) => {
                resolve(result.rows);
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

const providerDeletingExecution = (
    itemDeletedVerificationQuery
    , itemInPurchaseOrdersHeaderTableVerificationQuery
    , itemInAccountsPayableTableVerificationQuery
    , deletingitemQuery
    , itemDeletedVerificationValues
    , itemInPurchaseOrdersHeaderTableVerificationValues
    , itemInAccountsPayableTableVerificationValues
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
                        itemInPurchaseOrdersHeaderTableVerificationQuery
                        , itemInPurchaseOrdersHeaderTableVerificationValues
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
                        itemInAccountsPayableTableVerificationQuery
                        , itemInAccountsPayableTableVerificationValues
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

module.exports = {
    providersInsertOrUpdateExecution
    , providerDeletingExecution
};