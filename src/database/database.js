const { Pool } = require('pg');
require('dotenv/config');

const connectDataBase = new Promise((resolve, reject) => {
    try {
        if(global.connection){
            resolve(global.connection.connect());
        };
    
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });
    
        global.connection = pool;
    
        resolve(pool.connect());
    } catch (err){
        reject(err);
    };
});

// query execution

const queryExecution = (query, values) => {
    return new Promise((resolve, reject) => {
        connectDataBase
            .then((client) => {
                return client.query(query, values);
            }).then((result) => {
                resolve(result.rows);
            }).catch((err) => {
                reject(err);
            });
    });
};

// product and insert insert query execution

const productInsertExecution = (
    productQuery
    , productValues
    , stockQuery
    , stockValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(productQuery, productValues);
            }).then((result) => {
                return client.connection.query(
                    stockQuery
                    , [result.rows[0].id, ...stockValues]);
            }).then((result) => {
                client.connection.query('COMMIT');
                resolve(result.rows);
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject(err);
            });
    });
};

const purchaseOrderGetDataExecution = (
    headerQuery
    , itemsQuery
    , values
) => {
    const data = {};
    const client = {};

    return new Promise((resolve, reject) => {
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query(headerQuery, values);
            }).then((result) => {
                if (result.rows.length > 0){
                    data.header = result.rows[0];
                } else {
                    data.header = null;
                };
                return client.connection.query(itemsQuery, values);
            }).then((result) => {
                data.items = result.rows;
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
    });
};

const purchaseOrderInsertExecution = (
    headerQuery
    , headerValues
    , itemsQuery
    , itemsValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        const insertItems = (result) => {
            return new Promise((resolve, reject) => {
                itemsValues[0].forEach((item, index) => {
                    client.connection.query(
                        itemsQuery
                        , [
                            result.rows[0].id
                            , item.product_id
                            , item.status
                            , item.unit
                            , item.unit_price
                            , item.amount
                            , item.total
                            , itemsValues[1]
                    ]).then((result) => {
                        if (index === itemsValues[0].length - 1){
                            resolve(result);
                        };
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        };
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(headerQuery, headerValues);
            }).then((result) => {
                return insertItems(result);
            }).then((result) => {
                client.connection.query('COMMIT');
                resolve(result.rows);
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject(err);
            });
    });
};

const purchaseOrderUpdateExecution = (
    headerQuery
    , headerValues
    , updateItemsQuery
    , inserItemsQuery
    , itemsValues
    , existingItemsQuery
    , existingItemsValues
    , verificationQuery
    , verificationValues
) => {
    return new Promise((resolve, reject) => {
        const client = {};
        const existingItems = {};

        const itemsForUpdate = [];
        const itemsForInsert = [];

        const separateItems = () => {
            itemsValues[0].forEach((item) => {
                const productExist = existingItems.data.filter((existItem) => {
                    return item.product_id === existItem.product_id
                });
                if (productExist.length === 0){
                    itemsForInsert.push(item);
                } else {
                    itemsForUpdate.push(item);
                };
            });
        };

        const insertItems = (result) => {
            return new Promise((resolve, reject) => {
                if (itemsForInsert.length === 0){
                    resolve(result);
                } else {
                    itemsForInsert.forEach((item, index) => {
                        client.connection.query(
                            inserItemsQuery
                            , [
                                result.rows[0].purchase_order_header_id
                                , item.product_id
                                , item.status
                                , item.unit
                                , item.unit_price
                                , item.amount
                                , item.total
                                , itemsValues[1]
                        ]).then((result) => {
                            if (index === itemsForInsert.length - 1){
                                resolve(result);
                            };
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                };
            });
        };

        const updateItems = (result) => {
            return new Promise((resolve, reject) => {
                if (itemsForUpdate.length === 0){
                    resolve(result);
                } else {
                    itemsForUpdate.forEach((item, index) => {
                        client.connection.query(
                            updateItemsQuery
                            , [
                                result.rows[0].id
                                , item.product_id
                                , item.status
                                , item.unit
                                , item.unit_price
                                , item.amount
                                , item.total
                                , itemsValues[1]
                        ]).then((result) => {
                            if (index === itemsForUpdate.length - 1){
                                resolve(result);
                            };
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                };
            });
        };
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query(verificationQuery, verificationValues);
            }).then((result) => {
                if (result.rows[0].closing_date === null){
                    return client.connection.query('BEGIN');
                } else {
                    return new Error("closed purchase order");
                };
            }).then(() => {
                return client.connection.query(existingItemsQuery, existingItemsValues);
            }).then((result) => {
                existingItems.data = result.rows;
                return client.connection.query(headerQuery, headerValues);
            }).then((result) => {
                separateItems();
                return updateItems(result);
            }).then((result) => {
                return insertItems(result);
            }).then((result) => {
                client.connection.query('COMMIT');
                resolve(result.rows);
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject(err);
            });
    });
};

const purchaseOrderClosingExecution = (
    verificationQuery
    , closingQuery
    , values
) => {
    return new Promise((resolve, reject) => {
        const client = {};
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query(verificationQuery, [values[0]]);
            }).then((result) => {
                if (result.rows[0].closing_date === null){
                    return client.connection.query(closingQuery, values);
                } else {
                    reject(new Error("the purchase order has already been closed"));
                };
            }).then((result) => {
                resolve(result.rows);
            }).catch((err) => {
                reject(err);
            });
    });
};

const purchaseOrderReceivingExecution = (
    verificationQuery
    , receivingQuery
    , purchaseOrderItemsQuery
    , stockUpdateQuery
    , values
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        const orderProducts = {};

        const updateStock = (result) => {
            return new Promise((resolve, reject) => {
                if (orderProducts.data.length === 0){
                    resolve(result);
                } else {
                    orderProducts.data.forEach((item, index) => {
                        client.connection.query(
                            stockUpdateQuery
                            , [
                                item.product_id
                                , item.amount
                                , values[1]
                        ]).then((result) => {
                            if (index === orderProducts.data.length - 1){
                                resolve(result);
                            };
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                };
            });
        };
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query(verificationQuery, [values[0]]);
            }).then((result) => {
                if (
                    result.rows[0].closing_date === null
                    && result.rows[0].receipt_date === null
                ){
                    reject(new Error("the purchase order is not closed"));
                } else if (
                    result.rows[0].closing_date !== null
                    && result.rows[0].receipt_date !== null
                ) {
                    reject(new Error("the purchase order has already been received"));
                } else if (
                    result.rows[0].closing_date !== null
                    && result.rows[0].receipt_date === null
                ){
                    return client.connection.query(purchaseOrderItemsQuery, [values[0]]);
                };
            }).then((result) => {
                orderProducts.data = result.rows;
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(receivingQuery, values);
            }).then((result) => {
                return updateStock(result);
            }).then(() => {
                client.connection.query('COMMIT');
                resolve();
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject(err);
            });
    });
};

module.exports = {
    queryExecution
    , productInsertExecution
    , purchaseOrderGetDataExecution
    , purchaseOrderInsertExecution
    , purchaseOrderUpdateExecution
    , purchaseOrderClosingExecution
    , purchaseOrderReceivingExecution
};