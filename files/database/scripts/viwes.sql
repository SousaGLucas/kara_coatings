SET search_path TO kara_coatings;



CREATE VIEW vw_accounts_payable AS
	SELECT
		prov.id AS provider_id
		, prov.name AS provider_name
		, CONCAT(
			DATE_PART('day', apayb.payment_forecast)
			, '/'
			, DATE_PART('month', apayb.payment_forecast)
			, '/'
			, DATE_PART('year', apayb.payment_forecast)
		) AS due_date
		, CASE
			WHEN
				date_part('day', apayb.payment_forecast - now()) >= 0
				AND date_part('day', apayb.payment_forecast - now()) <= 30
				THEN 'A vencer'
			WHEN
				date_part('day', apayb.payment_forecast - now()) > 30
				AND date_part('day', apayb.payment_forecast - now()) <= 60
				THEN '30 dias'
			WHEN
				date_part('day', apayb.payment_forecast - now()) > 60
				AND date_part('day', apayb.payment_forecast - now()) <= 90
				THEN '60 dias'
			WHEN
				date_part('day', apayb.payment_forecast - now()) > 90
				AND date_part('day', apayb.payment_forecast - now()) <= 120
				THEN '90 dias'
			WHEN
				date_part('day', apayb.payment_forecast - now()) >= 120
				THEN '120 dias'
			ELSE
				'Não quitados'
		END AS payment_category
	FROM
		providers AS prov
		INNER JOIN accounts_payable AS apayb
			ON prov.id = apayb.provider_id
			AND prov.deleted_at ISNULL
			AND apayb.payment_date ISNULL;
