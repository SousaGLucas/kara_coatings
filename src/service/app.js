const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(require("./routes"));
app.use(require("./routes/authentication.routes"));
app.use(require("./routes/user-positions.routes"));
app.use(require("./routes/users.routes"));
app.use(require("./routes/providers.routes"));
app.use(require("./routes/product-groups.routes"));
app.use(require("./routes/units.routes"));
app.use(require("./routes/products.routes"));
app.use(require("./routes/products_stock.routes"));
app.use(require("./routes/purchase-orders.routes"));

module.exports = app;
