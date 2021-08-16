const { Pool } = require('pg');
require('dotenv/config');

const tableSpace = process.env.DB_TABLESPACE;

const connectDataBase = new Promise((resolve, reject) => {
    try {
        if(global.connection){
            resolve(global.connection.connect());
        };
    
        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });
    
        global.connection = pool;
    
        resolve(pool.connect());
    } catch (err){
        reject(err);
    };
});



// query execution

const queryExecution = (query, values) => {
    return new Promise((resolve, reject) => {
        connectDataBase
            .then((client) => {
                return client.query(query, values);
            }).then((result) => {
                resolve(result.rows);
            }).catch((err) => {
                reject(err);
            });
    });
};



// CREDENTIALS QUERY

const userCredentialLookup = (userCredential) => {
    const query = `
        SELECT
            u.username
            , u.password
            , upos.position AS user_position
        FROM
            ${tableSpace}.users AS u
            INNER JOIN
                ${tableSpace}.user_positions AS upos
                ON u.user_position_id = upos.id
        WHERE
            u.username = $1
            AND u.status_id = 1
            AND u.deleted_at ISNULL;
    `;

    const values = [
        userCredential.username
    ];
    
    return queryExecution(query, values);
};



// USER POSITIONS QUERIES

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
    const getAllActiveOrInactive = (userPositionData) => {
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
            userPositionData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (userPositionData) => {
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
            userPositionData.id
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (userPositionData) => {
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
            userPositionData.id
            , userPositionData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (userPositionData) => {
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
            userPositionData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (userPositionData) => {
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
            userPositionData.name
            , userPositionData.status
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
    };
};



// USERS QUERIES

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
    const getAllActiveOrInactive = (userData) => {
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
            userData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (userData) => {
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
            userData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (userData) => {
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
            userData.id
            , userData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (userData) => {
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
            userData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (userData) => {
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
            userData.name
            , userData.status
        ];

        return queryExecution(query, values);
    };
    const getData = (userData) => {
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
            userData.id
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
    };
};



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
    const getAllActiveOrInactive = (providerData) => {
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
            providerData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (providerData) => {
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
            providerData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (providerData) => {
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
            providerData.id
            , providerData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (providerData) => {
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
            providerData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (providerData) => {
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
            providerData.name
            , providerData.status
        ];

        return queryExecution(query, values);
    };
    const getData = (providerData) => {
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
            providerData.id
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
    };
};



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
    const getAllActiveOrInactive = (productGroupData) => {
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
            productGroupData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (productGroupData) => {
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
            productGroupData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (productGroupData) => {
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
            productGroupData.id
            , productGroupData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (productGroupData) => {
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
            productGroupData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (productGroupData) => {
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
            productGroupData.name
            , productGroupData.status
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
    };
};



const Units = () => {
    const getAll = () => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
            FROM
                ${tableSpace}.units
                INNER JOIN
                    ${tableSpace}.status
                    ON units.status_id = status.id
            WHERE
                units.deleted_at ISNULL;
        `;

        const values = [];
      
        return queryExecution(query, values);
    };
    const getAllActiveOrInactive = (unitData) => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
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
            unitData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (unitData) => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
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
            unitData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (unitData) => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
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
            unitData.id
            , unitData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (unitData) => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
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
            unitData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (unitData) => {
        const query = `
            SELECT
                units.id
                , units.description
                , units.description AS status
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
            unitData.name
            , unitData.status
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
    };
};



const Products = () => {
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

        const values = [];
      
        return queryExecution(query, values);
    };
    const getAllActiveOrInactive = (productData) => {
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
            productData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForId = (productData) => {
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
            productData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForId = (productData) => {
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
            productData.id
            , productData.status
        ];

        return queryExecution(query, values);
    };
    const getActiveAndInactiveForName = (productData) => {
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
            productData.name
        ];

        return queryExecution(query, values);
    };
    const getActiveOrInactiveForName = (productData) => {
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
            productData.name
            , productData.status
        ];

        return queryExecution(query, values);
    };
    const getData = (productData) => {
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
            productData.id
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
    };
};



module.exports = {
    userCredentialLookup
    , UserPositions
    , Users
    , Providers
    , ProductGroups
    , Units
    , Products
};