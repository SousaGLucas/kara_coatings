require('dotenv/config');

const {
    queryExecution
    , purchaseOrderGetDataExecution
    , purchaseOrderInsertExecution
    , purchaseOrderUpdateExecution
    , purchaseOrderClosingExecution
    , purchaseOrderReceivingExecution
} = require("../database");

const tableSpace = process.env.DB_TABLESPACE;

const PurchaseOrders = () => {
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

        const values = [];
      
        return queryExecution(query, values);
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
      
        return queryExecution(query, values);
    };
    const getData = (data) => {
        const headerQuery = `
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

        const itemsQuery = `
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

        return purchaseOrderGetDataExecution(
            headerQuery
            , itemsQuery
            , values
        );
    };
    const insert = (data) => {
        const headerQuery = `
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
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.providers
                    WHERE
                        name = $2
                )
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

        const headerValues = [
            data.user_id
            , data.provider
            , data.status
            , data.total
            , data.user_id
        ];

        const itemsQuery = `
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

        const itemsValues = [
            data.items
            , data.user_id
        ];

        return purchaseOrderInsertExecution(
            headerQuery
            , headerValues
            , itemsQuery
            , itemsValues
        );
    };
    const update = (data) => {
        const verificationQuery = `
            SELECT
                closing_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const verificationValues = [
            data.id
        ];

        const headerQuery = `
            UPDATE
                ${tableSpace}.purchase_orders_header
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , total = $3
                , update_at = now()
                , update_user = $4
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const headerValues = [
            data.id
            , data.status
            , data.total
            , data.user_id
        ];

        const updateItemsQuery = `
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
                AND deleted_at ISNULL
            RETURNING
                purchase_order_header_id;
        `;

        const inserItemsQuery = `
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

        const itemsValues = [
            data.items
            , data.user_id
        ];

        const existingItemsQuery = `
            SELECT
                product_id
            FROM
                ${tableSpace}.purchase_orders_items
            WHERE
                purchase_order_header_id = $1;
        `;

        const existingItemsValues = [
            data.id
        ];

        return purchaseOrderUpdateExecution(
            headerQuery
            , headerValues
            , updateItemsQuery
            , inserItemsQuery
            , itemsValues
            , existingItemsQuery
            , existingItemsValues
            , verificationQuery
            , verificationValues
        );

    };
    const closing = (data) => {
        const verificationQuery = `
            SELECT
                closing_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const closingQuery = `
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
                id = $1
            RETURNING
                id;
        `;

        const values = [
            data.id
            , data.user_id
        ];

        return purchaseOrderClosingExecution(
            verificationQuery
            , closingQuery
            , values
        );

    };
    const receiving = (data) => {
        const verificationQuery = `
            SELECT
                closing_date
                , receipt_date
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                id = $1;
        `;

        const receivingQuery = `
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
                id = $1
            RETURNING
                id;
        `;

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

        const values = [
            data.id
            , data.user_id
        ];

        return purchaseOrderReceivingExecution(
            verificationQuery
            , receivingQuery
            , purchaseOrderItemsQuery
            , stockUpdateQuery
            , values
        );

    };
    return {
        getAll
        , getAllOpenOrCanceledOrReceived
        , getData
        , insert
        , update
        , closing
        , receiving
    };
};

module.exports = {
    PurchaseOrders
};