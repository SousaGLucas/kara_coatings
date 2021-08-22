# kara_coatings
System for managing sales and purchase orders in the manufacture of ceramic tiles.

# status
Back-end to the purchase flux concluded

# pendencies
Back-end to the sales flux and front-end

# installation of dependencies
$ npm install express
$ npm install cookie-parser
$ npm install dotenv
$ npm install jsonwebtoken
$ npm install nodemon
$ npm install pg

# system boot
$ npm rum dev
$ npm rum start

# required environment variables
$ APP_PORT
$ DB_USER
$ DB_HOST
$ DB_DATABASE
$ DB_PASSWORD
$ DB_PORT
$ DB_TABLESPACE
$ SECRET

# path to the database scripts
$ ./files/database/scripts

# comments
For the system to work, it's necessary to insert default values in the "status" table. Insert scripts can be found in the "inserts" file, in the scripts folder of the database scripts path.

# technologies used
$ Node.js (https://nodejs.org/)
$ PostgreSQL (https://www.postgresql.org/)
