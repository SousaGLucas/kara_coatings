require('dotenv/config');

const standardExecution = require("../controllers/standard.controllers");

const tableSpace = process.env.DB_TABLESPACE;

const accountsPayable = () => {
    const getAll = () => {
        const query = `
            SELECT
                apayb.id
                , status.description AS status
                , prov.name AS provider_name
                , apayb.purchase_order_header_id
                , apayb.installment
                , apayb.installments_number
                , apayb.payment_forecast
                , CONCAT(
                    DATE_PART('day', apayb.payment_forecast)
                    , '/'
                    , DATE_PART('month', apayb.payment_forecast)
                    , '/'
                    , DATE_PART('year', apayb.payment_forecast)
                ) AS payment_forecast
                , CASE
                    WHEN
                        apayb.payment_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', apayb.payment_date)
                            , '/'
                            , DATE_PART('month', apayb.payment_date)
                            , '/'
                            , DATE_PART('year', apayb.payment_date)
                        )
                    END AS payment_date
            FROM
                ${tableSpace}.accounts_payable AS apayb
                INNER JOIN
                    ${tableSpace}.status
                    ON apayb.status_id = status.id
                INNER JOIN
                    ${tableSpace}.providers AS prov
                    ON apayb.provider_id = prov.id
            WHERE
                apayb.deleted_at ISNULL;
        `;
      
        return standardExecution(query, []);
    };
    const getAllPendingOrPaidout = (data) => {
        const query = `
            SELECT
                apayb.id
                , status.description AS status
                , prov.name AS provider_name
                , apayb.purchase_order_header_id
                , apayb.installment
                , apayb.installments_number
                , apayb.payment_forecast
                , CONCAT(
                    DATE_PART('day', apayb.payment_forecast)
                    , '/'
                    , DATE_PART('month', apayb.payment_forecast)
                    , '/'
                    , DATE_PART('year', apayb.payment_forecast)
                ) AS payment_forecast
                , CASE
                    WHEN
                        apayb.payment_date ISNULL
                        THEN '-'
                    ELSE
                        CONCAT(
                            DATE_PART('day', apayb.payment_date)
                            , '/'
                            , DATE_PART('month', apayb.payment_date)
                            , '/'
                            , DATE_PART('year', apayb.payment_date)
                        )
                    END AS payment_date
            FROM
                ${tableSpace}.accounts_payable AS apayb
                INNER JOIN
                    ${tableSpace}.status
                    ON apayb.status_id = status.id
                INNER JOIN
                    ${tableSpace}.providers AS prov
                    ON apayb.provider_id = prov.id
            WHERE
                apayb.status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = $1
                )
                AND apayb.deleted_at ISNULL;
        `;

        const values = [
            data.status
        ];

        return standardExecution(query, values);
    };
    const confirmPayment = (data) => {
        const query = `
            UPDATE
                ${tableSpace}.accounts_payable
            SET
                payment_date = now()
                , status_id = (
                    SELECT
                        id
                    FROM
                        ${tableSpace}.status
                    WHERE
                        description = 'paidout'
                )
                , update_at = now()
                , update_user = $2
            WHERE
                id = $1;
        `;

        const values = [
            data.id
            , data.user_id
        ];

        return standardExecution(query, values);
    };
    const agingList = () => {
        const query = `
            SELECT
                provider_id
                , provider_name
                , due_date
                , payment_category
            FROM
                ${tableSpace}.vw_accounts_payable;
        `;

        return standardExecution(query, []);
    };
    return {
        getAll
        , getAllPendingOrPaidout
        , confirmPayment
        , agingList
    };
};

module.exports = {
    accountsPayable
};