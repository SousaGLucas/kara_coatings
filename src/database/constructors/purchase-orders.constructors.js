require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const {
    purchaseOrderInsertExecution
    , purchaseOrderUpdateExecution
    , purchaseOrderClosingExecution
    , purchaseOrderReceivingExecution
    , purchaseOrederDeletingExecution
} = require("../controllers/purchase-orders.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const purchaseOrders = () => {
    const getAll = () => {
        const query = `
            SELECT
                pohead.id
                , prov.name AS provider_name
                , pohead.total
                , CASE
                    WHEN
                        pohead.closing_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', pohead.closing_date)
                            , '/'
                            , DATE_PART('month', pohead.closing_date)
                            , '/'
                            , DATE_PART('year', pohead.closing_date)
                        )
                    END AS closing_date
                , CASE
                    WHEN
                        pohead.receipt_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', pohead.receipt_date)
                            , '/'
                            , DATE_PART('month', pohead.receipt_date)
                            , '/'
                            , DATE_PART('year', pohead.receipt_date)
                        )
                    END AS receipt_date
                , users.name AS user_name
            FROM
                ${tableSpace}.purchase_orders_header AS pohead
                INNER JOIN
                    ${tableSpace}.providers AS prov
                    ON pohead.provider_id = prov.id
                INNER JOIN
                    ${tableSpace}.users
                    ON pohead.user_id = users.id
            WHERE
                pohead.deleted_at ISNULL;
        `;

        return standardExecution(query, []);
    };
    const getAllOpenOrCanceledOrReceived = (data) => {
        const query = `
            SELECT
                pohead.id
                , prov.name AS provider_name
                , pohead.total
                , CASE
                    WHEN
                        pohead.closing_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', pohead.closing_date)
                            , '/'
                            , DATE_PART('month', pohead.closing_date)
                            , '/'
                            , DATE_PART('year', pohead.closing_date)
                        )
                    END AS closing_date
                , CASE
                    WHEN
                        pohead.receipt_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', pohead.receipt_date)
                            , '/'
                            , DATE_PART('month', pohead.receipt_date)
                            , '/'
                            , DATE_PART('year', pohead.receipt_date)
                        )
                    END AS receipt_date
                , users.name AS user_name
            FROM
                ${tableSpace}.purchase_orders_header AS pohead
                INNER JOIN
                    ${tableSpace}.providers AS prov
                    ON pohead.provider_id = prov.id
                INNER JOIN
                    ${tableSpace}.users
                    ON pohead.user_id = users.id
            WHERE
                pohead.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND pohead.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];
      
        return standardExecution(query, values);
    };
    const getData = (data) => {
        const query = `
            SELECT
                pohead.id
                , prov.name AS provider_name
                , pohead.total
                , users.name AS user_name
            FROM
                ${tableSpace}.purchase_orders_header AS pohead
                    INNER JOIN
                        ${tableSpace}.providers AS prov
                        ON pohead.provider_id = prov.id
                    INNER JOIN
                        ${tableSpace}.users
                        ON pohead.user_id = users.id
            WHERE
                pohead.id = $1
                AND pohead.deleted_at ISNULL;
        `;

        const values = [
            data.id
        ];

        return standardExecution(query, values);
    };
    const getItems = (data) => {
        const query = `
            SELECT
                poitem.product_id
                , prod.name AS product_name
                , units.description AS unit
                , poitem.amount
                , poitem.unit_price
                , poitem.total
            FROM
                ${tableSpace}.purchase_orders_items AS poitem
                    INNER JOIN
                        ${tableSpace}.products AS prod
                        ON poitem.product_id = prod.id
                    INNER JOIN
                        ${tableSpace}.units
                        ON poitem.unit_id = units.id
            WHERE
                poitem.purchase_order_header_id = $1
                AND poitem.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = 'active'
                );
        `;

        const values = [
            data.id
        ];

        return standardExecution(query, values);
    };
    const insert = (data) => {
        const purchaseOrderHeaderQuery = `
            INSERT INTO
                ${tableSpace}.purchase_orders_header (
                    user_id
                    , provider_id
                    , status_id
                    , total
                    , create_user
                )
            VALUES (
                $1
                , $2
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , $4
                , $5
            )
            RETURNING
                id;
        `;

        const purchaseOrderHeaderValues = [
            data.user_id
            , data.provider_id
            , data.status
            , data.total
            , data.user_id
        ];

        const purchaseOrderItemsQuery = `
            INSERT INTO
                ${tableSpace}.purchase_orders_items (
                    purchase_order_header_id
                    , product_id
                    , status_id
                    , unit_id
                    , unit_price
                    , amount
                    , total
                    , create_user
                )
            VALUES (
                $1
                , $2
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.units
                    WHERE
                        description = $4
                )
                , $5
                , $6
                , $7
                , $8
            );
        `;

        return purchaseOrderInsertExecution(
            purchaseOrderHeaderQuery
            , purchaseOrderItemsQuery
            , purchaseOrderHeaderValues
            , data
        );
    };
    const update = (data) => {
        const statusVerificationQuery = `
            SELECT
                closing_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const statusVerificationValues = [
            data.id
        ];

        const purchaseOrderHeaderQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_header
            SET
                provider_id = $2
                , status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , total = $4
                , update_at = now()
                , update_user = $5
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const purchaseOrderHeaderValues = [
            data.id
            , data.provider_id
            , data.status
            , data.total
            , data.user_id
        ];

        const purchaseItemsUpdateQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_items
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , unit_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.units
                    WHERE
                        description = $4
                )
                , unit_price = $5
                , amount = $6
                , total = $7
                , update_at = now()
                , update_user = $8
            WHERE
                purchase_order_header_id = $1
                AND product_id = $2
                AND deleted_at ISNULL;
        `;

        const purchaseItemsInsertQuery = `
            INSERT INTO
                ${tableSpace}.purchase_orders_items (
                    purchase_order_header_id
                    , product_id
                    , status_id
                    , unit_id
                    , unit_price
                    , amount
                    , total
                    , create_user
                )
            VALUES (
                $1
                , $2
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.units
                    WHERE
                        description = $4
                )
                , $5
                , $6
                , $7
                , $8
            )
            RETURNING
                purchase_order_header_id;
        `;

        const existingPurchaseOrderItemsQuery = `
            SELECT
                product_id
            FROM
                ${tableSpace}.purchase_orders_items
            WHERE
                purchase_order_header_id = $1;
        `;

        const existingPurchaseOrderItemsValues = [
            data.id
        ];


        return purchaseOrderUpdateExecution(
            statusVerificationQuery
            , purchaseOrderHeaderQuery
            , purchaseItemsUpdateQuery
            , purchaseItemsInsertQuery
            , existingPurchaseOrderItemsQuery
            , statusVerificationValues
            , purchaseOrderHeaderValues
            , existingPurchaseOrderItemsValues
            , data
        );

    };
    const closing = (data) => {
        const statusVerificationQuery = `
            SELECT
                closing_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const statusVerificationValues = [
            data.id
        ];

        const closingPurchaseOrderQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_header 
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = 'closed'
                )
                , closing_date = now()
                , update_at = now()
                , update_user = $2
            WHERE
                id = $1;
        `;

        const closingPurchaseOrderValues = [
            data.id
            , data.user_id
        ];

        const accountsPayableInsertQuery = `
            INSERT INTO
                ${tableSpace}.accounts_payable (
                    purchase_order_header_id
                    , provider_id
                    , status_id
                    , installment
                    , installments_number
                    , value
                    , payment_forecast
                    , create_user
                )
            VALUES (
                $1
                , $2
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , $4
                , $5
                , $6
                , $7::timestamp
                , $8
            );
        `;

        return purchaseOrderClosingExecution(
            statusVerificationQuery
            , closingPurchaseOrderQuery
            , accountsPayableInsertQuery
            , statusVerificationValues
            , closingPurchaseOrderValues
            , data
        );

    };
    const receiving = (data) => {
        const statusVerificationQuery = `
            SELECT
                closing_date
                , receipt_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const statusVerificationValues = [
            data.id
        ];

        const receivingPurchaseOrderQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_header 
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = 'received'
                )
                , receipt_date = now()
                , update_at = now()
                , update_user = $2
            WHERE
                id = $1;
        `;

        const receivingPurchaseOrderValues = [
            data.id
            , data.user_id
        ];

        const purchaseOrderItemsQuery = `
            SELECT
                product_id
                , amount
            FROM
                ${tableSpace}.purchase_orders_items
            WHERE
                purchase_order_header_id = $1
                AND status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = 'active'
                );
        `;

        const purchaseOrderItemsValues = [
            data.id
        ];

        const stockUpdateQuery = `
            UPDATE
                ${tableSpace}.products_stock
            SET
                amount = amount + $2
                , update_at = now()
                , update_user = $3
            WHERE
                product_id = $1;
        `;

        return purchaseOrderReceivingExecution(
            statusVerificationQuery
            , receivingPurchaseOrderQuery
            , purchaseOrderItemsQuery
            , stockUpdateQuery
            , statusVerificationValues
            , receivingPurchaseOrderValues
            , purchaseOrderItemsValues
            , data
        );

    };
    const deleting = (data) => {
        // item is already deleted verification
        
        const itemDeletedVerificationQuery = `
            SELECT
                deleted_at
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is closed verification

        const itemIsClosedVerificationQuery = `
            SELECT
                closing_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const itemIsClosedVerificationValues = [
            data.id
        ];

        // purchase order deleting query

        const deletingPurchaseOrderQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_header
            SET
                deleted_at = now()
                , deleted_user = $2
            WHERE
                id = $1;
        `;

        const deletingPurchaseOrderValues = [
            data.id
            , data.user_id
        ];

        // purchase order items deleting query

        const deletingPurchaseOrderItemsQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_items
            SET
                deleted_at = now()
                , deleted_user = $2
            WHERE
                purchase_order_header_id = $1;
        `;

        const deletingPurchaseOrderItemsValues = [
            data.id
            , data.user_id
        ];    

        return purchaseOrederDeletingExecution(
            itemDeletedVerificationQuery
            , itemIsClosedVerificationQuery
            , deletingPurchaseOrderQuery
            , deletingPurchaseOrderItemsQuery
            , itemDeletedVerificationValues
            , itemIsClosedVerificationValues
            , deletingPurchaseOrderValues
            , deletingPurchaseOrderItemsValues
        );
    };
    return {
        getAll
        , getAllOpenOrCanceledOrReceived
        , getData
        , getItems
        , insert
        , update
        , closing
        , receiving
        , deleting
    };
};

module.exports = {
    purchaseOrders
};