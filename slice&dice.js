// ****** This file contains all 'where' clause operations ****** //

const fs = require('fs');
const msgpack = require('msgpack-lite');
const chalk = require('chalk');
const lodash = require('lodash');

const cfn = require('./common-functions');

//simple where clause (Compare single property with single value)
function whereClause(docname, prop, operator, val, callback) {
    let msg;
    let output;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast retrieval using cache
            output = cfn.whereComp(prop, operator, val);
            if (output !== null) {
                if (callback)
                    callback(output)
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
                        output = cfn.whereComp(prop, operator, val);
                        if (output !== null) {
                            if (callback)
                                callback(output)
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

//adv where clause (Compare dual properties with dual values)
function whereClause2(docname, prop1, operator1, val1, conjunction, prop2, operator2, val2, callback) {
    let msg;
    let output1;
    let output2;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast retrieval using cache
            output1 = cfn.whereComp(prop1, operator1, val1);
            output2 = cfn.whereComp(prop2, operator2, val2);
            if(output1 === null || output2 === null) {
                msg = 'Operator not recognized !';
                if (callback)
                    callback((chalk.red.bold(msg)));
            } else {
                if(conjunction === 'and') {
                    let result = lodash.intersection(output1,output2);
                    if(callback)
                        callback(result)
                }
                else if(conjunction === 'or') {
                    let result = lodash.union(output1,output2);
                    if(callback)
                        callback(result)
                }
                else {
                    msg = 'Conjunction not recognized !';
                    if (callback)
                        callback((chalk.red.bold(msg)));
                }
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
                        output1 = cfn.whereComp(prop1, operator1, val1);
                        output2 = cfn.whereComp(prop2, operator2, val2);
                        if(output1 === null || output2 === null) {
                            msg = 'Operator not recognized !';
                            if (callback)
                                callback((chalk.red.bold(msg)));
                        } else {
                            if(conjunction === 'and') {
                                let result = lodash.intersection(output1,output2);
                                if(callback)
                                    callback(result)
                            }
                            else if(conjunction === 'or') {
                                let result = lodash.union(output1,output2);
                                if(callback)
                                    callback(result)
                            }
                            else {
                                msg = 'Conjunction not recognized !';
                                if (callback)
                                    callback((chalk.red.bold(msg)));
                            }
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
module.exports.whereClause2 = whereClause2;