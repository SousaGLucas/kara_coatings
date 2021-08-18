const app = require("./src/service/app");
require("dotenv/config");

const port = process.env.APP_PORT;

app.listen(port, () => {
    console.log(`Aplicação sendo executada na porta ${port}`);
});