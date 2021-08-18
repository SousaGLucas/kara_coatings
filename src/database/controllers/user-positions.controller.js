require('dotenv/config');

const { queryExecution } = require("../database");
const tableSpace = process.env.DB_TABLESPACE;

const UserPositions = () => {
    const getAll = () => {
        const query = `
            SELECT
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.deleted_at ISNULL;
        `;

        const values = [];
    
        return queryExecution(query, values);
    };
    const getAllActiveOrInactive = (data) => {
        const query = `
            SELECT
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND upos.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (data) => {
        const query = `
            SELECT
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.id = $1
                AND upos.deleted_at ISNULL;
        `;

        const values = [
            data.id
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (data) => {
        const query = `
            SELECT
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.id = $1
                AND upos.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND upos.deleted_at ISNULL;
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
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.position LIKE '%'||$1||'%'
                AND upos.deleted_at ISNULL;
        `;

        const values = [
            data.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (data) => {
        const query = `
            SELECT
                upos.id
                , upos.position
                , status.description AS status
            FROM
                ${tableSpace}.user_positions AS upos
                INNER JOIN
                    ${tableSpace}.status
                    ON upos.status_id = status.id
            WHERE
                upos.position LIKE '%'||$1||'%'
                AND upos.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND upos.deleted_at ISNULL;
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
                ${tableSpace}.user_positions (
                    status_id
                    , position
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
            , data.position
            , data.user_id
        ];

        return queryExecution(query, values);
    };
    const update = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.user_positions
            SET
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                , position = $3
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
            , data.position
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
    UserPositions
};