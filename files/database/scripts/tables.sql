SET search_path TO kara_coatings;



CREATE TABLE products (
	id serial NOT NULL
	, product_group_id integer NOT NULL
	, status_id integer NOT NULL
	, unit_id integer NOT NULL
	, name varchar(250) NOT NULL
	, cost_price decimal(5,2) NOT NULL
	, profit_margin decimal(5,2) NOT NULL
	, sale_price decimal(5,2) NOT NULL
	, image_path varchar(250) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT products_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE products_stock (
	product_id integer NOT NULL
	, amount decimal(7,2) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user varchar(80) NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT products_stock_pk PRIMARY KEY (product_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE customers (
	id serial NOT NULL
	, status_id integer NOT NULL
	, name varchar(80) NOT NULL
	, document varchar(19) NOT NULL
	, email varchar(80) NOT NULL
	, address varchar(250) NOT NULL
	, address_number varchar(6) NOT NULL
	, district varchar(80) NOT NULL
	, city varchar(80) NOT NULL
	, state varchar(2) NOT NULL
	, zip_code varchar(9) NOT NULL
	, phone_ddi varchar(3) NOT NULL
	, phone_ddd varchar(2) NOT NULL
	, phone_number varchar(10) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT customers_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE sales_header (
	id serial NOT NULL
	, user_id integer NOT NULL
	, customer_id integer NOT NULL
	, status_id integer NOT NULL
	, total decimal(9,2) NOT NULL
	, closing_date timestamp
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT sales_header_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE sales_items (
	sale_header_id integer NOT NULL
	, product_id integer NOT NULL
	, status_id integer NOT NULL
	, unit_id integer NOT NULL
	, unit_price decimal(5,2) NOT NULL
	, amount decimal(7,2) NOT NULL
	, total decimal(9,2) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT sales_items_pk PRIMARY KEY (sale_header_id, product_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE users (
	id serial NOT NULL
	, user_position_id integer NOT NULL
	, status_id integer NOT NULL
	, name varchar(80) NOT NULL
	, document varchar(19) NOT NULL
	, email varchar(80) NOT NULL
	, address varchar(250) NOT NULL
	, address_number varchar(6) NOT NULL
	, district varchar(80) NOT NULL
	, city varchar(80) NOT NULL
	, state varchar(2) NOT NULL
	, zip_code varchar(9) NOT NULL
	, phone_ddi varchar(3) NOT NULL
	, phone_ddd varchar(2) NOT NULL
	, phone_number varchar(10) NOT NULL
	, username varchar(80) NOT NULL
	, password varchar(250) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT users_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE accounts_receivable (
	id serial NOT NULL
	, sale_header_id integer NOT NULL
	, customer_id integer NOT NULL
	, status_id integer NOT NULL
	, installment integer NOT NULL
	, installments_number integer NOT NULL
	, value decimal(7,2) NOT NULL
	, receipt_forecast timestamp NOT NULL
	, receipt_date timestamp
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT accounts_receivable_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE product_groups (
	id serial NOT NULL
	, status_id integer NOT NULL
	, name varchar(80) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT product_groups_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE payment_forms (
	sale_header_id integer NOT NULL
	, method_id integer NOT NULL
	, value decimal(9,2) NOT NULL
	, installments_number integer NOT NULL
	, installment integer NOT NULL
	, authorization_number varchar(6) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, canceled_at timestamp
	, canceled_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT payment_form_pk PRIMARY KEY (sale_header_id, method_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE payment_methods (
	id serial NOT NULL
	, description varchar(50) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT payment_method_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE providers (
	id serial NOT NULL
	, status_id integer NOT NULL
	, name varchar(80) NOT NULL
	, document varchar(19) NOT NULL
	, email varchar(80) NOT NULL
	, address varchar(250) NOT NULL
	, address_number varchar(6) NOT NULL
	, district varchar(80) NOT NULL
	, city varchar(80) NOT NULL
	, state varchar(2) NOT NULL
	, zip_code varchar(9) NOT NULL
	, phone_ddi varchar(3) NOT NULL
	, phone_ddd varchar(2) NOT NULL
	, phone_number varchar(10) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT providers_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE accounts_payable (
	id serial NOT NULL
	, purchase_order_header_id integer NOT NULL
	, provider_id integer NOT NULL
	, status_id integer NOT NULL
	, installment integer NOT NULL
	, installments_number integer NOT NULL
	, value decimal(7,2) NOT NULL
	, payment_forecast timestamp NOT NULL
	, payment_date timestamp
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT accounts_payable_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE user_positions (
	id serial NOT NULL
	, status_id integer NOT NULL
	, position varchar(80) NOT NULL
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT user_position_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE purchase_orders_header (
	id serial NOT NULL
	, user_id integer NOT NULL
	, provider_id integer NOT NULL
	, status_id integer NOT NULL
	, total  decimal(9,2) NOT NULL
	, closing_date timestamp
	, receipt_date timestamp
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT purchase_orders_header_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE purchase_orders_items (
	purchase_order_header_id integer NOT NULL
	, product_id integer NOT NULL
	, status_id integer NOT NULL
	, unit_id integer NOT NULL
	, unit_price decimal(5,2) NOT NULL
	, amount decimal(7,2) NOT NULL
	, total decimal(9,2) NOT NULL
	, receipt_date timestamp
	, create_at timestamp DEFAULT now()
	, create_user integer
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT purchase_orders_items_pk PRIMARY KEY (purchase_order_header_id, product_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE status (
	id serial NOT NULL
	, description varchar(80) NOT NULL UNIQUE
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT status_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE units (
	id serial NOT NULL
	status_id NOT NULL
	, description varchar(80) NOT NULL UNIQUE
	, create_at timestamp DEFAULT now()
	, create_user integer NOT NULL
	, update_at timestamp
	, update_user integer
	, deleted_at timestamp
	, deleted_user integer
	, CONSTRAINT units_pk PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);



ALTER TABLE accounts_payable
	ADD CONSTRAINT provider_id_fk
	FOREIGN KEY (provider_id)
	REFERENCES providers(id);

ALTER TABLE accounts_payable
	ADD CONSTRAINT purchase_order_header_id_fk
	FOREIGN KEY (purchase_order_header_id)
	REFERENCES purchase_orders_header(id);

ALTER TABLE accounts_payable
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE accounts_receivable
	ADD CONSTRAINT customer_id_fk
	FOREIGN KEY (customer_id)
	REFERENCES customers(id);

ALTER TABLE accounts_receivable
	ADD CONSTRAINT sale_header_id_fk
	FOREIGN KEY (sale_header_id)
	REFERENCES sales_header(id);

ALTER TABLE accounts_receivable
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE customers
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE payment_forms
	ADD CONSTRAINT method_id_fk
	FOREIGN KEY (method_id)
	REFERENCES payment_methods(id);

ALTER TABLE payment_forms
	ADD CONSTRAINT sale_header_id_fk
	FOREIGN KEY (sale_header_id)
	REFERENCES sales_header(id);



ALTER TABLE products
	ADD CONSTRAINT product_group_id_fk
	FOREIGN KEY (product_group_id)
	REFERENCES product_groups(id);

ALTER TABLE products
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE products
	ADD CONSTRAINT units_id_fk
	FOREIGN KEY (unit_id)
	REFERENCES units(id);



ALTER TABLE product_groups
	ADD CONSTRAINT product_groups_status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE units
	ADD CONSTRAINT units_status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE products_stock
	ADD CONSTRAINT product_id_fk
	FOREIGN KEY (product_id)
	REFERENCES products(id);



ALTER TABLE providers
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);



ALTER TABLE purchase_orders_header
	ADD CONSTRAINT provider_id_fk
	FOREIGN KEY (provider_id)
	REFERENCES providers(id);

ALTER TABLE purchase_orders_header
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE purchase_orders_header
	ADD CONSTRAINT user_id_fk
	FOREIGN KEY (user_id)
	REFERENCES users(id);



ALTER TABLE purchase_orders_items
	ADD CONSTRAINT product_id_fk
	FOREIGN KEY (product_id)
	REFERENCES products(id);

ALTER TABLE purchase_orders_items
	ADD CONSTRAINT purchase_order_header_id_fk
	FOREIGN KEY (purchase_order_header_id)
	REFERENCES purchase_orders_header(id);

ALTER TABLE purchase_orders_items
	ADD CONSTRAINT purchase_order_items_status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE purchase_orders_items
	ADD CONSTRAINT purchase_order_items_unit_id_fk
	FOREIGN KEY (unit_id)
	REFERENCES units(id);



ALTER TABLE sales_header
	ADD CONSTRAINT customer_id_fk
	FOREIGN KEY (customer_id)
	REFERENCES customers(id);

ALTER TABLE sales_header
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE sales_header
	ADD CONSTRAINT user_id_fk
	FOREIGN KEY (user_id)
	REFERENCES users(id);



ALTER TABLE sales_items
	ADD CONSTRAINT product_id_fk
	FOREIGN KEY (product_id)
	REFERENCES products(id);

ALTER TABLE sales_items
	ADD CONSTRAINT sale_header_id_fk
	FOREIGN KEY (sale_header_id)
	REFERENCES sales_header(id);

ALTER TABLE sales_items
	ADD CONSTRAINT sale_header_status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE sales_items
	ADD CONSTRAINT sale_header_unit_id_fk
	FOREIGN KEY (unit_id)
	REFERENCES units(id);



ALTER TABLE users
	ADD CONSTRAINT status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);

ALTER TABLE users
	ADD CONSTRAINT user_position_id_fk
	FOREIGN KEY (user_position_id)
	REFERENCES user_positions(id);



ALTER TABLE user_positions
	ADD CONSTRAINT user_positions_status_id_fk
	FOREIGN KEY (status_id)
	REFERENCES status(id);
