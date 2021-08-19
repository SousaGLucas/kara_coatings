require('dotenv/config');

const { queryExecution } = require("../database");
const tableSpace = process.env.DB_TABLESPACE;

const ProductsStock = () => {
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

        const values = [];
      
        return queryExecution(query, values);
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

        return queryExecution(query, values);
    };
    return {
        getAll
        , getForId
    };
};

module.exports = {
    ProductsStock
};