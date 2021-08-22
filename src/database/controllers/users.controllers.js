const connectDataBase = require("../database");

const userInsertOrUpdateExecution = (
    usernameVerificationQuery
    , documentVerificationQuery
    , insertQuery
    , usernameVerificationValues
    , documentVerificationValues
    , insertValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query(
                    usernameVerificationQuery
                    , usernameVerificationValues
                );
            }).then((result) => {
                if (result.rows.length === 0){
                    return client.connection.query(
                        documentVerificationQuery
                        , documentVerificationValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "username already exists"
                    };
                };
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

const userDeletingExecution = (
    itemDeletedVerificationQuery
    , itemInUserPositionsTableVerificationQuery
    , itemInProvidersTableVerificationQuery
    , itemInProductGroupsTableVerificationQuery
    , itemInUnitsTableVerificationQuery
    , itemInProductsTableVerificationQuery
    , itemInProductsStockTableVerificationQuery
    , itemInPurchaseOrdersHeaderTableVerificationQuery
    , itemInPurchaseOrdersItemsTableVerificationQuery
    , itemInAccountsPayableTableVerificationQuery
    , deletingitemQuery
    , itemDeletedVerificationValues
    , itemInUserPositionsTableVerificationValues
    , itemInProvidersTableVerificationValues
    , itemInProductGroupsTableVerificationValues
    , itemInUnitsTableVerificationValues
    , itemInProductsTableVerificationValues
    , itemInProductsStockTableVerificationValues
    , itemInPurchaseOrdersHeaderTableVerificationValues
    , itemInPurchaseOrdersItemsTableVerificationValues
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
                        itemInUserPositionsTableVerificationQuery
                        , itemInUserPositionsTableVerificationValues
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
                        itemInProvidersTableVerificationQuery
                        , itemInProvidersTableVerificationValues
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
                        itemInProductGroupsTableVerificationQuery
                        , itemInProductGroupsTableVerificationValues
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
                        itemInUnitsTableVerificationQuery
                        , itemInUnitsTableVerificationValues
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
                        itemInProductsStockTableVerificationQuery
                        , itemInProductsStockTableVerificationValues
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
                        itemInPurchaseOrdersItemsTableVerificationQuery
                        , itemInPurchaseOrdersItemsTableVerificationValues
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
    userInsertOrUpdateExecution
    , userDeletingExecution
};