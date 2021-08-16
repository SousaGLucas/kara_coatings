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



// CREDENTIALS QUERY

const userCredentialLookup = (userCredential) => {
    return new Promise((resolve, reject) => {
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
        
        connectDataBase
            .then((client) => {
                return client.query(query, values);
            }).then((result) => {
                resolve(result.rows[0]);
            }).catch((err) => {
                reject(err);
            });
    });
};



// USER POSITIONS QUERIES

// all user positions query proccess

const allUserPositionsQuery = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                deleted_at ISNULL;
        `;

        const values = [];
        
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

// active and inactive user positions query

const activeOrInactiveUserPositionsQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.status
        ];
        
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

// active and inactive user position for id query

const activeAndInactiveUserPositionsForIdQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                id = $1
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.id
        ];
        
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

// active or inactive user position for id query

const activeOrInactiveUserPositionsForIdQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                id = $1
                AND status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.id
            , userData.status
        ];
        
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

// active and inactive user position for id query

const activeAndInactiveUserPositionsForNameQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                position LIKE '%'||$1||'%'
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.name
        ];
        
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

// active or inactive user position for name query

const activeOrInactiveUserPositionsForNameQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , position
            FROM
                ${tableSpace}.user_positions
            WHERE
                position LIKE '%'||$1||'%'
                AND status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.name
            , userData.status
        ];
        
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



// USERS QUERIES

// all users query proccess

const allUsersQuery = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , name
            FROM
                ${tableSpace}.users
            WHERE
                deleted_at ISNULL;
        `;

        const values = [];
        
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

// all active or inactive users query

const activeOrInactiveUsersQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , name
            FROM
                ${tableSpace}.users
            WHERE
                status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.status
        ];
        
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

// active or inactive user for id query

const activeOrInactiveUsersForIdQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , name
            FROM
                ${tableSpace}.users
            WHERE
                id = $1
                AND status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.id
            , userData.status
        ];
        
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

// active and inactive users for name query

const activeAndInactiveUsersForNameQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , name
            FROM
                ${tableSpace}.users
            WHERE
                name LIKE '%'||$1||'%'
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.name
        ];
        
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

// active or inactive users for name query

const activeOrInactiveUsersForNameQuery = (userData) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                id
                , name
            FROM
                ${tableSpace}.users
            WHERE
                name LIKE '%'||$1||'%'
                AND status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $2
                )
                AND deleted_at ISNULL;
        `;

        const values = [
            userData.name
            , userData.status
        ];
        
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

// user data query

const userDataQuery = (userData) => {
    return new Promise((resolve, reject) => {
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

module.exports = {
    userCredentialLookup
    , allUserPositionsQuery
    , activeOrInactiveUserPositionsQuery
    , activeAndInactiveUserPositionsForIdQuery
    , activeOrInactiveUserPositionsForIdQuery
    , activeAndInactiveUserPositionsForNameQuery
    , activeOrInactiveUserPositionsForNameQuery
    , allUsersQuery
    , activeOrInactiveUsersQuery
    , activeOrInactiveUsersForIdQuery
    , activeAndInactiveUsersForNameQuery
    , activeOrInactiveUsersForNameQuery
    , userDataQuery
};