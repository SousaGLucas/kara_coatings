const connectDataBase = require("../database");

const productInsertExecution = (
    productInsertQuery
    , productInsertValues
    , stockInsertQuery
    , data
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        const returning = {};
        
        connectDataBase()
            .then((connection) => {
                client.connection = connection;
                
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    productInsertQuery
                    , productInsertValues
                );
            }).then((result) => {
                returning.product_id = result.rows[0].id;

                const stockIsertValues = [
                    result.rows[0].id
                    , 0.00
                    , data.user_id
                ];

                return client.connection.query(
                    stockInsertQuery
                    , stockIsertValues
                );
            }).then(() => {
                client.connection.query('COMMIT');
                resolve(returning);
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject({
                    type: "internal"
                    , err: err
                });
            });
    });
};

const productDeletingExecution = (
    itemDeletedVerificationQuery
    , itemInPurchaseOrdersItemsTableVerificationQuery
    , deletingProductQuery
    , deletingProductsStockQuery
    , itemDeletedVerificationValues
    , itemInPurchaseOrdersItemsTableVerificationValues
    , deletingProductValues
    , deletingProductsStockValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    itemDeletedVerificationQuery
                    , itemDeletedVerificationValues
                );
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
                        deletingProductQuery
                        , deletingProductValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "item cannot be deleted"
                    };
                };
            }).then(() => {
                return client.connection.query(
                    deletingProductsStockQuery
                    , deletingProductsStockValues
                );
            }).then(() => {
                client.connection.query('COMMIT');
                resolve();
            }).catch((err) => {
                client.connection.query('ROLLBACK');
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
    productInsertExecution
    , productDeletingExecution
};