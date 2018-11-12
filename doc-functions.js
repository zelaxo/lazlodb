require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');
const msgpack = require('msgpack-lite');
const lodash = require('lodash');
const path = require('path');
const listcon = require('list-contents');

//Create doc
function newdoc(docname,callback) {
    let msg;
    if(db !== null) {
        let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
        fs.writeFileSync(p, '');
        msg = `Document ${docname} created !`;
        if(callback)
            callback(chalk.green.bold(msg))
    }
    else {
        msg = `No database selected !`;
        if(callback)
            callback(chalk.red.bold(msg))
    }
}
module.exports.newdoc = newdoc;