const fs = require("fs");
const path = require("path");

const errorRecord = (error) => {
    const content = {
        date: new Date().toISOString()
        , err: error.err.toString()
    };

    fs.writeFile(
        path.resolve(__dirname, "errors", `${new Date().getTime()}.json`)
        , JSON.stringify(content)
        , (err) => {
            if (err) console.log(err);
        });
};

module.exports = errorRecord;