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
    const update = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.products_stock
            SET
                amount = $2
                , update_at = now()
                , update_user = $3
            WHERE
                product_id = $1
                AND deleted_at ISNULL
            RETURNING
                product_id;
        `;

        const values = [
            data.product_id
            , data.amount
            , data.user_id
        ];

        return queryExecution(query, values);
    };
    return {
        getAll
        , getForId
        , update
    };
};

module.exports = {
    ProductsStock
};