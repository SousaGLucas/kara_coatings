require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const login = (data) => {
    const query = `
        SELECT
            u.id
            ,u.username
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
        data.username
    ];
    
    return standardExecution(query, values);
};

module.exports = {
    login
};