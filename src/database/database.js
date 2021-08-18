const { Pool, Connection } = require('pg');
require('dotenv/config');

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

// product and insert insert query execution

const productInsertExecution = (
    productQuery
    , productValues
    , stockQuery
    , stockValues
) => {
    console.log(`
        ${productQuery}
        , ${productValues}
        , ${stockQuery}
        , ${stockValues}
    `);
    return new Promise((resolve, reject) => {
        const client = {};
        
        connectDataBase
            .then((connection) => {
                client.connection = connection;
                return client.connection.query('BEGIN');
            }).then(() => {
                return client.connection.query(productQuery, productValues);
            }).then((result) => {
                return client.connection.query(
                    stockQuery
                    , [result.rows[0].id, ...stockValues]);
            }).then((result) => {
                client.connection.query('COMMIT');
                resolve(result.rows);
            }).catch((err) => {
                client.connection.query('ROLLBACK');
                reject(err);
            });
    });
};

module.exports = {
    queryExecution
    , productInsertExecution
};