require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const unitDeletingExecution = require("../controllers/units.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const units = () => {
    const getAll = () => {
        const query = `
            SELECT
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.deleted_at ISNULL;
        `;

        return standardExecution(query, []);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND units.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return standardExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.name LIKE '%'||$1||'%'
                AND units.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.id = $1
                AND units.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND units.deleted_at ISNULL;
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
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.description LIKE '%'||$1||'%'
                AND units.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return standardExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                units.id
                , units.description
                , status.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.description LIKE '%'||$1||'%'
                AND units.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND units.deleted_at ISNULL;
        `;

        const values = [
            data.name
            , data.status
        ];

        return standardExecution(query, values);
    };
    const insert = (data) => {
        const query = `
            INSERT INTO
                ${tableSpace}.units (
                    status_id
                    , description
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
            )
            RETURNING
                id;
        `;

        const values = [
            data.status
            , data.description
            , data.user_id
        ];

        return standardExecution(query, values);
    };
    const update = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.units
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , description = $3
                , update_at = now()
                , update_user = $4
            WHERE
                id = $1
                AND deleted_at ISNULL
            RETURNING
                id;
        `;

        const values = [
            data.id
            , data.status
            , data.description
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
                ${tableSpace}.units
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is in products table verification

        const itemInProductsTableVerificationQuery = `
            SELECT
                unit_id
            FROM
                ${tableSpace}.products
            WHERE
                unit_id = $1
                AND deleted_at ISNULL;
        `;

        const itemInProductsTableVerificationValues = [
            data.id
        ];

        // deleting query

        const deletingitemQuery = `
            UPDATE
                ${tableSpace}.units
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

        return unitDeletingExecution(
            itemDeletedVerificationQuery
            , itemInProductsTableVerificationQuery
            , deletingitemQuery
            , itemDeletedVerificationValues
            , itemInProductsTableVerificationValues
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
        , insert
        , update
        , deleting
    };
};

module.exports = {
    units
};