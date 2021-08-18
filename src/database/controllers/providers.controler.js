require('dotenv/config');

const { queryExecution } = require("../database");
const tableSpace = process.env.DB_TABLESPACE;

const Providers = () => {
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

        const values = [];
      
        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
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

        return queryExecution(query, values);
    };
    const insert = (data) => {
        const query = `
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

        const values = [
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

        return queryExecution(query, values);
    };
    const update = (data) => {
        const query = `
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

        const values = [
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
    Providers
};