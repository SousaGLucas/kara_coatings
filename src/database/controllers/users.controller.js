require('dotenv/config');

const { queryExecution } = require("../database");
const tableSpace = process.env.DB_TABLESPACE;

const Users = () => {
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

        const values = [];
    
        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
    };
    const insert = (data) => {
        const query = `
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

        const values = [
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

        return queryExecution(query, values);
    };
    const update = (data) => {
        const query = `
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

        const values = [
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

        return queryExecution(query, values);
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
    };
};

module.exports = {
    Users
};