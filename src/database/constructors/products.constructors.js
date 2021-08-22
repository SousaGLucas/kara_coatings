require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const { 
    productInsertExecution
    , productDeletingExecution
} = require("../controllers/products.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const products = () => {
    const getAll = () => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.deleted_at ISNULL;
        `;

        return standardExecution(query, []);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return standardExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.name LIKE '%'||$1||'%'
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.id = $1
                AND prod.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.id
            , data.status
        ];

        return standardExecution(query, values);
    };
    const getActiveAndInactiveForName = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.name LIKE '%'||$1||'%'
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , units.description AS unit
                , pstk.amount
                , prod.sale_price
                , status.description AS status
            FROM
                ${tableSpace}.products AS prod
                INNER JOIN
                    ${tableSpace}.units
                    ON prod.unit_id = units.id
                INNER JOIN
                    ${tableSpace}.products_stock AS pstk
                    ON prod.id = pstk.product_id
                INNER JOIN
                    ${tableSpace}.status
                    ON prod.status_id = status.id
            WHERE
                prod.name LIKE '%'||$1||'%'
                AND prod.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.name
            , data.status
        ];

        return standardExecution(query, values);
    };
    const getData = (data) => {
        const query = `
            SELECT
                prod.id
                , prod.name
                , pgrp.name
                , units.description
                , prod.cost_price
                , prod.profit_margin
                , prod.sale_price
                , status.description
            FROM
                ${tableSpace}.products AS prod
                    INNER JOIN
                        ${tableSpace}.product_groups AS pgrp
                        ON prod.product_group_id = pgrp.id
                    INNER JOIN
                        ${tableSpace}.units
                        ON prod.unit_id = units.id
                    INNER JOIN
                        ${tableSpace}.status
                        ON prod.status_id = status.id
            WHERE
                prod.id = $1
                AND prod.deleted_at ISNULL;
        `;

        const values = [
            data.id
        ];

        return standardExecution(query, values);
    };
    const insert = (data) => {
        const productInsertQuery = `
            INSERT INTO
                ${tableSpace}.products (
                    product_group_id
                    , status_id
                    , unit_id
                    , name
                    , cost_price
                    , profit_margin
                    , sale_price
                    , create_user
                )
            VALUES (
                (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.product_groups
                    WHERE
                        name = $1
                )
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.units
                    WHERE
                        description = $3
                )
                , $4
                , $5
                , $6
                , $7
                , $8
            )
            RETURNING
                id;
        `;

        const productInsertValues = [
            data.product_group
            , data.status
            , data.unit
            , data.name
            , data.cost_price
            , data.profit_margin
            , data.sale_price
            , data.user_id
        ];

        const stockInsertQuery = `
            INSERT INTO
                ${tableSpace}.products_stock (
                    product_id
                    , amount
                    , create_user
                )
            VALUES (
                $1
                , $2
                , $3
            )
            RETURNING
                product_id;
        `;

        return productInsertExecution(
            productInsertQuery
            , productInsertValues
            , stockInsertQuery
            , data
        );
    };
    const update = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.products
            SET
                product_group_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.product_groups
                    WHERE
                        name = $2
                )
                , status_id = (
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
                , name = $5
                , cost_price = $6
                , profit_margin = $7
                , sale_price = $8
                , update_at = now()
                , update_user = $9
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const values = [
            data.id
            , data.product_group
            , data.status
            , data.unit
            , data.name
            , data.cost_price
            , data.profit_margin
            , data.sale_price
            , data.user_id
        ];

        return standardExecution(query, values);
    };
    const deleting = (data) => {
        // item is already deleted verification
        
        const itemDeletedVerificationQuery = `
            SELECT
                deleted_at
            FROM
                ${tableSpace}.products
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is in purchase orders items table verification

        const itemInPurchaseOrdersItemsTableVerificationQuery = `
            SELECT
                product_id
            FROM
                ${tableSpace}.purchase_orders_items
            WHERE
                product_id = $1
                AND deleted_at ISNULL;
        `;

        const itemInPurchaseOrdersItemsTableVerificationValues = [
            data.id
        ];

        // product deleting query

        const deletingProductQuery = `
            UPDATE
                ${tableSpace}.products
            SET
                deleted_at = now()
                , deleted_user = $2
            WHERE
                id = $1;
        `;

        const deletingProductValues = [
            data.id
            , data.user_id
        ];

        // products stock deleting query

        const deletingProductsStockQuery = `
            UPDATE
                ${tableSpace}.products_stock
            SET
                deleted_at = now()
                , deleted_user = $2
            WHERE
                product_id = $1;
        `;

        const deletingProductsStockValues = [
            data.id
            , data.user_id
        ];    

        return productDeletingExecution(
            itemDeletedVerificationQuery
            , itemInPurchaseOrdersItemsTableVerificationQuery
            , deletingProductQuery
            , deletingProductsStockQuery
            , itemDeletedVerificationValues
            , itemInPurchaseOrdersItemsTableVerificationValues
            , deletingProductValues
            , deletingProductsStockValues
        );
    };
    return {
        getAll
        , getAllActiveOrInactive
        , getActiveAndInactiveForId
        , getActiveOrInactiveForId
        , getActiveAndInactiveForName
        , getActiveOrInactiveForName
        , getData
        , insert
        , update
        , deleting
    };
};

module.exports = {
    products
};