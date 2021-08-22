require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const {
    providersInsertOrUpdateExecution
    , providerDeletingExecution
} = require("../controllers/providers.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const providers = () => {
    const getAll = () => {
        const query = `
            SELECT
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.deleted_at ISNULL;
        `;
        
        return standardExecution(query, []);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND prov.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return standardExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.name LIKE '%'||$1||'%'
                AND prov.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.id = $1
                AND prov.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND prov.deleted_at ISNULL;
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
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.name LIKE '%'||$1||'%'
                AND prov.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                prov.id
                , prov.name
                , status.description AS status
            FROM
                ${tableSpace}.providers AS prov
                INNER JOIN
                    ${tableSpace}.status
                    ON prov.status_id = status.id
            WHERE
                prov.name LIKE '%'||$1||'%'
                AND prov.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND prov.deleted_at ISNULL;
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
                id
                , name
                , document
                , phone_ddi
                , phone_ddd
                , phone_number
                , email
                , address
                , address_number
                , district
                , city
                , state
                , zip_code
            FROM
                ${tableSpace}.providers
            WHERE
                id = $1
                AND deleted_at ISNULL;
        `;

        const values = [
            data.id
        ];

        return standardExecution(query, values);
    };
    const insert = (data) => {
        const documentVerificationQuery = `
            SELECT
                document
            FROM
                ${tableSpace}.providers
            WHERE
                document = $1
                AND deleted_at ISNULL;
        `;

        const documentVerificationValues = [
            data.document
        ];

        const insertQuery = `
            INSERT INTO
                ${tableSpace}.providers (
                    status_id
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
                    , create_user
                )
            VALUES (
                (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                , $2
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
            )
            RETURNING
                id;
        `;

        const insertValues = [
            data.status
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
            , data.user_id
        ];

        return providersInsertOrUpdateExecution(
            documentVerificationQuery
            , insertQuery
            , documentVerificationValues
            , insertValues
        );
    };
    const update = (data) => {
        const documentVerificationQuery = `
            SELECT
                document
            FROM
                ${tableSpace}.providers
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
                ${tableSpace}.providers
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , name = $3
                , document = $4
                , email = $5
                , address = $6
                , address_number = $7
                , district = $8
                , city = $9
                , state = $10
                , zip_code = $11
                , phone_ddi = $12
                , phone_ddd = $13
                , phone_number = $14
                , update_at = now()
                , update_user = $15
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const insertValues = [
            data.id
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
            , data.user_id
        ];

        return providersInsertOrUpdateExecution(
            documentVerificationQuery
            , insertQuery
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
                ${tableSpace}.providers
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is in purchase orders header table verification

        const itemInPurchaseOrdersHeaderTableVerificationQuery = `
            SELECT
                provider_id
            FROM
                ${tableSpace}.purchase_orders_header
            WHERE
                provider_id = $1
                AND deleted_at ISNULL;
        `;

        const itemInPurchaseOrdersHeaderTableVerificationValues = [
            data.id
        ];

        // item is in accounts payable table verification

        const itemInAccountsPayableTableVerificationQuery = `
            SELECT
                provider_id
            FROM
                ${tableSpace}.accounts_payable
            WHERE
                provider_id = $1
                AND deleted_at ISNULL;
        `;

        const itemInAccountsPayableTableVerificationValues = [
            data.id
        ];

        // deleting query

        const deletingitemQuery = `
            UPDATE
                ${tableSpace}.providers
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

        return providerDeletingExecution(
            itemDeletedVerificationQuery
            , itemInPurchaseOrdersHeaderTableVerificationQuery
            , itemInAccountsPayableTableVerificationQuery
            , deletingitemQuery
            , itemDeletedVerificationValues
            , itemInPurchaseOrdersHeaderTableVerificationValues
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
    providers
};