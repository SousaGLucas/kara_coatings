const connectDataBase = require("../database");

const purchaseOrderInsertExecution = (
    purchaseOrderHeaderQuery
    , purchaseOrderItemsQuery
    , purchaseOrderHeaderValues
    , data
) => {
    return new Promise((resolve, reject) => {
        const client = {};
        const returning = {};

        const insertItems = () => {
            return new Promise((resolve, reject) => {
                data.items.forEach((item, index) => {
                    const purchaseOrderItemsValues = [
                        returning.purchase_order_header_id
                        , item.product_id
                        , item.status
                        , item.unit
                        , item.unit_price
                        , item.amount
                        , item.total
                        , data.user_id
                    ];
                    client.connection.query(
                        purchaseOrderItemsQuery
                        , purchaseOrderItemsValues
                        ).then(() => {
                            if (index === data.items.length - 1){
                                resolve();
                            };
                        }).catch((err) => {
                            reject(err);
                        });
                });
            });
        };
        
        connectDataBase()
            .then((connection) => {
                client.connection = connection;
                
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    purchaseOrderHeaderQuery
                    , purchaseOrderHeaderValues
                );
            }).then((result) => {
                returning.purchase_order_header_id = result.rows[0].id;
                return insertItems();
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

const purchaseOrderUpdateExecution = (
    statusVerificationQuery
    , purchaseOrderHeaderQuery
    , purchaseItemsUpdateQuery
    , purchaseItemsInsertQuery
    , existingPurchaseOrderItemsQuery
    , statusVerificationValues
    , purchaseOrderHeaderValues
    , existingPurchaseOrderItemsValues
    , data
) => {
    return new Promise((resolve, reject) => {
        const client = {};
        const existingPurchaseOrdersItems = {};

        const purchaseOrderItemsForUpdate = [];
        const purchaseOrderItemsForInsert = [];

        const separateItems = () => {
            data.items.forEach((item) => {
                const existingItems = existingPurchaseOrdersItems.data
                    .filter((existingItem) => {
                        return item.product_id === existingItem.product_id;
                    });

                if (existingItems.length === 0){
                    purchaseOrderItemsForInsert.push(item);
                } else {
                    purchaseOrderItemsForUpdate.push(item);
                };
            });
        };

        const insertItems = () => {
            return new Promise((resolve, reject) => {
                if (purchaseOrderItemsForInsert.length === 0){
                    resolve();
                } else {
                    purchaseOrderItemsForInsert.forEach((item, index) => {
                        const purchaseOrderItemsForInsertValues = [
                            data.id
                            , item.product_id
                            , item.status
                            , item.unit
                            , item.unit_price
                            , item.amount
                            , item.total
                            , data.user_id
                        ];

                        client.connection.query(
                            purchaseItemsInsertQuery
                            , purchaseOrderItemsForInsertValues
                            ).then(() => {
                                if (index === purchaseOrderItemsForInsert.length - 1){
                                    resolve();
                                };
                            }).catch((err) => {
                                reject(err);
                            });
                    });
                };
            });
        };

        const updateItems = () => {
            return new Promise((resolve, reject) => {
                if (purchaseOrderItemsForUpdate.length === 0){
                    resolve();
                } else {
                    purchaseOrderItemsForUpdate.forEach((item, index) => {
                        const purchaseOrderItemsForUpdateValues = [
                            data.id
                            , item.product_id
                            , item.status
                            , item.unit
                            , item.unit_price
                            , item.amount
                            , item.total
                            , data.user_id
                        ];

                        client.connection.query(
                            purchaseItemsUpdateQuery
                            , purchaseOrderItemsForUpdateValues
                            ).then(() => {
                                if (index === purchaseOrderItemsForUpdate.length - 1){
                                    resolve();
                                };
                            }).catch((err) => {
                                reject(err);
                            });
                    });
                };
            });
        };
        
        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    statusVerificationQuery
                    , statusVerificationValues
                );
            }).then((result) => {
                if (result.rows[0].closing_date === null){
                    return client.connection.query(
                        existingPurchaseOrderItemsQuery
                        , existingPurchaseOrderItemsValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "closed purchase order"
                    };
                };
            }).then((result) => {
                existingPurchaseOrdersItems.data = result.rows;

                return client.connection.query(
                    purchaseOrderHeaderQuery
                    , purchaseOrderHeaderValues
                );
            }).then(() => {
                separateItems();
                return updateItems();
            }).then(() => {
                return insertItems();
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

const purchaseOrderClosingExecution = (
    statusVerificationQuery
    , closingPurchaseOrderQuery
    , accountsPayableInsertQuery
    , statusVerificationValues
    , closingPurchaseOrderValues
    , data
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        const insertAccountsPayable = () => {
            return new Promise((resolve, reject) => {
                let count = 1;
                do {
                    const accountsPayableInsertValues = [
                        data.id
                        , data.provider_id
                        , data.status
                        , count
                        , data.installments_number
                        , data.value
                        , data.payment_forecast
                        , data.user_id
                    ];
                    client.connection.query(
                        accountsPayableInsertQuery
                        , accountsPayableInsertValues
                        ).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    count++;
                } while (count <= data.installments_number);
            });
        };
        
        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    statusVerificationQuery
                    , statusVerificationValues
                );
            }).then((result) => {
                if (result.rows[0].closing_date === null){
                    return client.connection.query(
                        closingPurchaseOrderQuery
                        , closingPurchaseOrderValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "the purchase order has already been closed"
                    };
                };
            }).then(() => {
                return insertAccountsPayable();
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

const purchaseOrderReceivingExecution = (
    statusVerificationQuery
    , receivingPurchaseOrderQuery
    , purchaseOrderItemsQuery
    , stockUpdateQuery
    , statusVerificationValues
    , receivingPurchaseOrderValues
    , purchaseOrderItemsValues
    , data
) => {
    return new Promise((resolve, reject) => {
        const client = {};

        const orderProducts = {};

        const updateStock = () => {
            return new Promise((resolve, reject) => {
                if (orderProducts.data.length === 0){
                    resolve();
                } else {
                    orderProducts.data.forEach((item, index) => {
                        const stockUpdateValues = [
                            item.product_id
                            , item.amount
                            , data.user_id
                        ];
                        client.connection.query(
                            stockUpdateQuery
                            , stockUpdateValues
                            ).then(() => {
                                if (index === orderProducts.data.length - 1){
                                    resolve();
                                };
                            }).catch((err) => {
                                reject(err);
                            });
                    });
                };
            });
        };
        
        connectDataBase()
            .then((connection) => {
                client.connection = connection;

                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(
                    statusVerificationQuery
                    , statusVerificationValues
                );
            }).then((result) => {
                if (
                    result.rows[0].closing_date === null
                    && result.rows[0].receipt_date === null
                ){
                    throw {
                        type: "forbidden"
                        , err: "the purchase order is not closed"
                    };
                } else if (
                    result.rows[0].closing_date !== null
                    && result.rows[0].receipt_date !== null
                ) {
                    throw {
                        type: "forbidden"
                        , err: "the purchase order has already been received"
                    };
                } else if (
                    result.rows[0].closing_date !== null
                    && result.rows[0].receipt_date === null
                ){
                    return client.connection.query(
                        purchaseOrderItemsQuery
                        , purchaseOrderItemsValues
                    );
                };
            }).then((result) => {
                orderProducts.data = result.rows;

                return client.connection.query(
                    receivingPurchaseOrderQuery
                    , receivingPurchaseOrderValues
                );
            }).then(() => {
                return updateStock();
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

const purchaseOrederDeletingExecution = (
    itemDeletedVerificationQuery
    , itemIsClosedVerificationQuery
    , deletingPurchaseOrderQuery
    , deletingPurchaseOrderItemsQuery
    , itemDeletedVerificationValues
    , itemIsClosedVerificationValues
    , deletingPurchaseOrderValues
    , deletingPurchaseOrderItemsValues
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
                        itemIsClosedVerificationQuery
                        , itemIsClosedVerificationValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "item already deleted"
                    };
                };
            }).then((result) => {
                if (result.rows[0].closing_date === null){
                    return client.connection.query(
                        deletingPurchaseOrderQuery
                        , deletingPurchaseOrderValues
                    );
                } else {
                    throw {
                        type: "forbidden"
                        , err: "item cannot be deleted"
                    };
                };
            }).then(() => {
                return client.connection.query(
                    deletingPurchaseOrderItemsQuery
                    , deletingPurchaseOrderItemsValues
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
    purchaseOrderInsertExecution
    , purchaseOrderUpdateExecution
    , purchaseOrderClosingExecution
    , purchaseOrderReceivingExecution
    , purchaseOrederDeletingExecution
};