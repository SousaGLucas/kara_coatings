require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const {
    userInsertOrUpdateExecution
    , userDeletingExecution
} = require("../controllers/users.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const users = () => {
    const getAll = () => {
        const query = `
            SELECT
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.deleted_at ISNULL;
        `;

        return standardExecution(query, []);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND users.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return standardExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.name LIKE '%'||$1||'%'
                AND users.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.id = $1
                AND users.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND users.deleted_at ISNULL;
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
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.name LIKE '%'||$1||'%'
                AND users.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                users.id
                , users.name
                , status.description AS status
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.status
                    ON users.status_id = status.id
            WHERE
                users.name LIKE '%'||$1||'%'
                AND users.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND users.deleted_at ISNULL;
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
                users.id
                , users.name
                , users.document
                , upos.position
                , users.phone_ddi
                , users.phone_ddd
                , users.phone_number
                , users.email
                , users.address
                , users.address_number
                , users.district
                , users.city
                , users.state
                , users.zip_code
            FROM
                ${tableSpace}.users
                INNER JOIN
                    ${tableSpace}.user_positions AS upos
                    ON users.user_position_id = upos.id
            WHERE
                users.id = $1
                AND users.deleted_at ISNULL;
        `;

        const values = [
            data.id
        ];

        return standardExecution(query, values);
    };
    const insert = (data) => {
        const usernameVerificationQuery = `
            SELECT
                username
            FROM
                ${tableSpace}.users
            WHERE
                username = $1
                AND deleted_at ISNULL;
        `;

        const usernameVerificationValues = [
            data.username
        ];

        const documentVerificationQuery = `
            SELECT
                document
            FROM
                ${tableSpace}.users
            WHERE
                document = $1
                AND deleted_at ISNULL;
        `;

        const documentVerificationValues = [
            data.document
        ];

        const insertQuery = `
            INSERT INTO
                ${tableSpace}.users (
                    user_position_id
                    , status_id
                    , name
                    , document
                    , email
                    , address
                    , address_number
                    , district
                    , city
                    , state
                    , zip_code
                    , phone_ddi
                    , phone_ddd
                    , phone_number
                    , username
                    , password
                    , create_user
                )
            VALUES (
                (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.user_positions
                    WHERE
                        position = $1
                )
                , (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , $3
                , $4
                , $5
                , $6
                , $7
                , $8
                , $9
                , $10
                , $11
                , $12
                , $13
                , $14
                , $15
                , $16
                , $17
            )
            RETURNING
                id;
        `;

        const insertValues = [
            data.position
            , data.status
            , data.name
            , data.document
            , data.email
            , data.address
            , data.address_number
            , data.district
            , data.city
            , data.state
            , data.zip_code
            , data.phone_ddi
            , data.phone_ddd
            , data.phone_number
            , data.username
            , data.password
            , data.user_id
        ];

        return userInsertOrUpdateExecution(
            usernameVerificationQuery
            , documentVerificationQuery
            , insertQuery
            , usernameVerificationValues
            , documentVerificationValues
            , insertValues
        );
    };
    const update = (data) => {
        const usernameVerificationQuery = `
            SELECT
                username
            FROM
                ${tableSpace}.users
            WHERE
                id <> $1
                AND username = $2
                AND deleted_at ISNULL;
        `;

        const usernameVerificationValues = [
            data.id
            , data.username
        ];

        const documentVerificationQuery = `
            SELECT
                document
            FROM
                ${tableSpace}.users
            WHERE
                id <> $1
                AND document = $2
                AND deleted_at ISNULL;
        `;

        const documentVerificationValues = [
            data.id
            , data.document
        ];

        const insertQuery = `
            UPDATE
                ${tableSpace}.users
            SET
                user_position_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.user_positions
                    WHERE
                        position = $2
                )
                , status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $3
                )
                , name = $4
                , document = $5
                , email = $6
                , address = $7
                , address_number = $8
                , district = $9
                , city = $10
                , state = $11
                , zip_code = $12
                , phone_ddi = $13
                , phone_ddd = $14
                , phone_number = $15
                , username = $16
                , password = $17
                , update_at = now()
                , update_user = $18
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const insertValues = [
            data.id
            , data.position
            , data.status
            , data.name
            , data.document
            , data.email
            , data.address
            , data.address_number
            , data.district
            , data.city
            , data.state
            , data.zip_code
            , data.phone_ddi
            , data.phone_ddd
            , data.phone_number
            , data.username
            , data.password
            , data.user_id
        ];

        return userInsertOrUpdateExecution(
            usernameVerificationQuery
            , documentVerificationQuery
            , insertQuery
            , usernameVerificationValues
            , documentVerificationValues
            , insertValues
        );
    };
    const deleting = (data) => {
        // item is already deleted verification
        
        const itemDeletedVerificationQuery = `
            SELECT
                deleted_at
            FROM
                ${tableSpace}.users
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is in user positions table verification

        const itemInUserPositionsTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.user_positions
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInUserPositionsTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in providers table verification

        const itemInProvidersTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.providers
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInProvidersTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in product groups table verification

        const itemInProductGroupsTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.product_groups
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInProductGroupsTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in units table verification

        const itemInUnitsTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.units
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInUnitsTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in products table verification

        const itemInProductsTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.products
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInProductsTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in products stock table verification

        const itemInProductsStockTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.products_stock
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInProductsStockTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in purchase orders header table verification

        const itemInPurchaseOrdersHeaderTableVerificationQuery = `
            SELECT
                user_id
                , create_user
                , update_user
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                (
                    user_id = $1
                    OR create_user = $2
                    OR update_user = $3
                )
                AND deleted_at ISNULL;
        `;

        const itemInPurchaseOrdersHeaderTableVerificationValues = [
            data.id
            , data.id
            , data.id
        ];

        // item is in purchase orders items table verification

        const itemInPurchaseOrdersItemsTableVerificationQuery = `
            SELECT
                create_user
                , update_user
            FROM
                ${tableSpace}.purchase_orders_items
            WHERE
                (
                    create_user = $1
                    OR update_user = $2
                )
                AND deleted_at ISNULL;
        `;

        const itemInPurchaseOrdersItemsTableVerificationValues = [
            data.id
            , data.id
        ];

        // item is in accounts payable table verification

        const itemInAccountsPayableTableVerificationQuery = `
            SELECT
                create_user
            FROM
                ${tableSpace}.accounts_payable
            WHERE
                create_user = $1
                AND deleted_at ISNULL;
        `;

        const itemInAccountsPayableTableVerificationValues = [
            data.id
        ];

        // deleting query

        const deletingitemQuery = `
            UPDATE
                ${tableSpace}.users
            SET
                deleted_at = now()
                , deleted_user = $2
            WHERE
                id = $1;
        `;

        const deletingitemValues = [
            data.id
            , data.user_id
        ];

        return userDeletingExecution(
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
    users
};