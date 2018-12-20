// ****** This file contains all 'where' clause operations ****** //

const fs = require('fs');
const msgpack = require('msgpack-lite');
const chalk = require('chalk');

const cfn = require('./common-functions');

//simple where clause (Compare single property with single value)
function whereClause(docname, prop, operator, val, callback) {
    let msg;
    let output;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast retrieval using cache
            if (operator === '=' || operator === '!=' || operator === '>' || operator === '<' || operator === '>=' || operator === '<=') {
                output = cfn.whereComp(prop, operator, val);
                output.forEach((obj) => {
                    if (callback)
                        callback(obj)
                })
            } else {
                msg = 'Operator not recognized !';
                if (callback)
                    callback((chalk.red.bold(msg)));
            }
        } else {
            //normal retrieval
            if (fs.statSync(p).size !== 0) {
                fs.readFile(p, (err, data) => {
                    if (err) {
                        msg = 'Data seems to be corrupted !';
                        if (callback)
                            callback((chalk.red.bold(msg)));
                    } else {
                        cache = msgpack.decode(data);
                        current_doc = docname;
                        if (operator === '=' || operator === '!=' || operator === '>' || operator === '<' || operator === '>=' || operator === '<=') {
                            output = cfn.whereComp(prop, operator, val);
                            output.forEach((obj) => {
                                if (callback)
                                    callback(obj)
                            })
                        } else {
                            msg = 'Operator not recognized !';
                            if (callback)
                                callback((chalk.red.bold(msg)));
                        }
                    }
                });
            } else {
                msg = 'Document is empty !';
                if (callback)
                    callback((chalk.red.bold(msg)));
            }
        }
    } else {
        msg = 'No database selected or the document does not exist !';
        if (callback)
            callback((chalk.red.bold(msg)));
    }
}

module.exports.whereClause = whereClause;