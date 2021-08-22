require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");
const userPositionDeletingExecution = require("../controllers/user-positions.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const userPositions = () => {
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

        return standardExecution(query, []);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
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

        return standardExecution(query, values);
    };
    const deleting = (data) => {
        // item is already deleted verification

        const itemDeletedVerificationQuery = `
            SELECT
                deleted_at
            FROM
                ${tableSpace}.user_positions
            WHERE
                id = $1
                AND deleted_at IS NOT NULL;
        `;

        const itemDeletedVerificationValues = [
            data.id
        ];

        // item is in users table verification

        const itemInUsersTableVerificationQuery = `
            SELECT
                deleted_at
            FROM
                ${tableSpace}.users
            WHERE
                user_position_id = $1
                AND deleted_at ISNULL;
        `;

        const itemInUsersTableVerificationValues = [
            data.id
        ];

        // deleting verification

        const deletingitemQuery = `
            UPDATE
                ${tableSpace}.user_positions
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

        return userPositionDeletingExecution(
            itemDeletedVerificationQuery
            , itemInUsersTableVerificationQuery
            , deletingitemQuery
            , itemDeletedVerificationValues
            , itemInUsersTableVerificationValues
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
    userPositions
};