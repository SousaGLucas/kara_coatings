require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const productsStock = () => {
    const getAll = () => {
        const query = `
            SELECT
                product_id
                , amount
            FROM
                ${tableSpace}.products_stock
            WHERE
                deleted_at ISNULL;
        `;
      
        return standardExecution(query, []);
    };
    const getForId = (data) => {
        const query = `
            SELECT
                product_id
                , amount
            FROM
                ${tableSpace}.products_stock
            WHERE
                product_id = $1
                AND deleted_at ISNULL;
        `;

        const values = [
            data.product_id
        ];

        return standardExecution(query, values);
    };
    return {
        getAll
        , getForId
    };
};

module.exports = {
    productsStock
};