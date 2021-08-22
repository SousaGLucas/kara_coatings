const { Pool } = require('pg');
require('dotenv/config');

const connectDataBase = () => {
    return new Promise((resolve, reject) => {
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
};

module.exports = connectDataBase;