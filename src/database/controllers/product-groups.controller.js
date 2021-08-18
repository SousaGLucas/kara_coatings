require('dotenv/config');

const { queryExecution } = require("../database");
const tableSpace = process.env.DB_TABLESPACE;

const ProductGroups = () => {
    const getAll = () => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.deleted_at ISNULL;
        `;

        const values = [];
      
        return queryExecution(query, values);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND pgr.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.name LIKE '%'||$1||'%'
                AND pgr.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.id = $1
                AND pgr.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND pgr.deleted_at ISNULL;
        `;

        const values = [
            data.id
            , data.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (data) => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.name LIKE '%'||$1||'%'
                AND pgr.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                pgr.id
                , pgr.name
                , status.description AS status
            FROM
                ${tableSpace}.product_groups AS pgr
                INNER JOIN
                    ${tableSpace}.status
                    ON pgr.status_id = status.id
            WHERE
                pgr.name LIKE '%'||$1||'%'
                AND pgr.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND pgr.deleted_at ISNULL;
        `;

        const values = [
            data.name
            , data.status
        ];

        return queryExecution(query, values);
    };
    const insert = (data) => {
        const query = `
            INSERT INTO
                ${tableSpace}.product_groups (
                    status_id
                    , name
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
            , data.name
            , data.user_id
        ];

        return queryExecution(query, values);
    };
    const update = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.product_groups
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
            , data.name
            , data.user_id
        ];

        return queryExecution(query, values);
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
    };
};

module.exports = {
    ProductGroups
};