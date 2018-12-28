const fs = require('fs');
const chalk = require('chalk');
const msgpack = require('msgpack-lite');
const lodash = require('lodash');

const cfn = require('./common-functions');

//Create doc
function newdoc(docname, callback) {
    let msg;
    if (db !== null) {
        let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
        if (fs.existsSync(p)) {
            msg = `Document already exists !`;
            if (callback)
                callback(chalk.red.bold(msg))
        } else {
            fs.writeFileSync(p, '');
            msg = `Document ${docname} created !`;
            if (callback)
                callback(chalk.green.bold(msg));
            cfn.docCreationLog(docname,db);
        }
    } else {
        msg = `No database selected !`;
        if (callback)
            callback(chalk.red.bold(msg))
    }
}

module.exports.newdoc = newdoc;

//Delete Doc
function deldoc(docname, callback) {
    let msg;
    if (db !== null) {
        let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
            msg = 'Document deleted !';
            if (callback)
                callback(chalk.green.bold(msg));
            cfn.docDeletionLog(docname,db);
        } else {
            msg = 'Document does not exist !';
            if (callback)
                callback(chalk.red.bold(msg))
        }
    } else {
        msg = `No database selected !`;
        if (callback)
            callback(chalk.red.bold(msg))
    }
}

module.exports.deldoc = deldoc;

//Insert single
function inserts(docname, input, callback) {
    let object;
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        try {
            object = JSON.parse(input);
        } catch (e) {
            msg = 'Syntactical error detected !';
            if (callback)
                callback((chalk.red.bold(msg)));
        }
        if (cache.length !== 0 && current_doc === docname) {
            //Using preloaded cache data for fast insertion
            object._id = cfn.idgen();
            cache.push(object);
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Record inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
            cfn.docEntryLog(1,docname,true);
        } else {
            //Normal Insertion
            if (fs.statSync(p).size !== 0) {
                let buffer = fs.readFileSync(p);
                cache = msgpack.decode(buffer);
            }
            current_doc = docname;
            object._id = cfn.idgen();
            cache.push(object);
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Record inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
            cfn.docEntryLog(1,docname,true);
        }
    } else {
        msg = 'No database selected or the document does not exist !';
        if (callback)
            callback((chalk.red.bold(msg)));
    }
}

module.exports.inserts = inserts;

//insert many
function insert(docname, input, callback) {
    let array = [];
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        try {
            array = JSON.parse(input);
        } catch (e) {
            msg = 'Syntactical error detected !';
            if (callback)
                callback((chalk.red.bold(msg)));
        }
        if (cache.length !== 0 && current_doc === docname) {
            //Using preloaded cache data for fast insertion
            array.forEach((object) => {
                object._id = cfn.idgen();
                cache.push(object);
            });
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = `${array.length} records inserted !`;
            if (callback)
                callback((chalk.green.bold(msg)));
            cfn.docEntryLog(array.length,docname,true);
        } else {
            //Normal Insertion
            if (fs.statSync(p).size !== 0) {
                let buffer = fs.readFileSync(p);
                cache = msgpack.decode(buffer);
            }
            current_doc = docname;
            array.forEach((object) => {
                object._id = cfn.idgen();
                cache.push(object);
            });
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = `${array.length} records inserted !`;
            if (callback)
                callback((chalk.green.bold(msg)));
            cfn.docEntryLog(array.length,docname,true);
        }
    } else {
        msg = 'No database selected or the document does not exist !';
        if (callback)
            callback((chalk.red.bold(msg)));
    }
}

module.exports.insert = insert;

//show all data
function show(docname, callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //Fast retrieval using cache
            if(callback)
                callback(cache)
        } else {
            //Normal retrieval
            if (fs.statSync(p).size !== 0) {
                fs.readFile(p, (err, data) => {
                    if (err) {
                        msg = 'Data seems to be corrupted !';
                        if (callback)
                            callback((chalk.red.bold(msg)));
                    } else {
                        cache = msgpack.decode(data);
                        if (typeof cache === "object") {
                            current_doc = docname;
                            if(callback)
                                callback(cache)
                        } else {
                            current_doc = null;
                            msg = 'Data seems to be corrupted !';
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
module.exports.show = show;

//update data (update in doc where ipar = ivalue as par = value)
function updateDoc(docname,ipar,ivalue,par,value,callback) {
    let msg;
    let output = [];
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast updation using cache
            cache.forEach((obj) => {
                if(obj[ipar] === ivalue) {
                    obj[par] = value;
                    output.push(obj);
                    cfn.docUpdateLog(obj._id,docname);
                }
            });
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            if(output.length === 0) {msg = 'No record with matching key-value pair found !'}
            else {msg = `${output.length} records updated !`}
            if(callback)
                callback(msg,output)
        } else {
            //normal updation
            if (fs.statSync(p).size !== 0) {
                fs.readFile(p, (err, data) => {
                    if (err) {
                        msg = 'Data seems to be corrupted !';
                        if (callback)
                            callback((chalk.red.bold(msg)));
                    } else {
                        cache = msgpack.decode(data);
                        current_doc = docname;
                        cache.forEach((obj) => {
                            if(obj[ipar] === ivalue) {
                                obj[par] = value;
                                output.push(obj);
                                cfn.docUpdateLog(obj._id,docname);
                            }
                        });
                        let buffer = msgpack.encode(cache);
                        fs.writeFile(p, buffer, (err) => {
                            if (err) throw err;
                        });
                        if(output.length === 0) {msg = 'No record with matching key-value pair found !'}
                        else {msg = `${output.length} records updated !`}
                        if(callback)
                            callback(msg,output)
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
module.exports.updateDoc = updateDoc;

//delete data (delete from doc where par = value)
function delData(docname,par,value,callback) {
    let msg;
    let output = [];
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast deletion using cache
            output = lodash.remove(cache, (obj) => {
                return obj[par] === value;
            });
            if(output.length === 0) {
                msg = 'No record with matching key-value pair found !'
            }
            else {
                let buffer = msgpack.encode(cache);
                fs.writeFile(p, buffer, (err) => {
                    if (err) throw err;
                });
                msg = `${output.length} records deleted !`;
                cfn.docEntryLog(output.length,docname,false);
            }
            if(callback)
                callback(msg,output)
        } else {
            //normal deletion
            if (fs.statSync(p).size !== 0) {
                fs.readFile(p, (err, data) => {
                    if (err) {
                        msg = 'Data seems to be corrupted !';
                        if (callback)
                            callback((chalk.red.bold(msg)));
                    } else {
                        cache = msgpack.decode(data);
                        current_doc = docname;
                        output = lodash.remove(cache, (obj) => {
                            return obj[par] === value;
                        });
                        if(output.length === 0) {
                            msg = 'No record with matching key-value pair found !'
                        }
                        else {
                            let buffer = msgpack.encode(cache);
                            fs.writeFile(p, buffer, (err) => {
                                if (err) throw err;
                            });
                            msg = `${output.length} records deleted !`;
                            cfn.docEntryLog(output.length,docname,false);
                        }
                        if(callback)
                            callback(msg,output)
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
module.exports.delData = delData;

//records by date (show records of date from doc)
function recordsByDate(date,docname,callback) {
    let msg;
    let output = [];
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if (db !== null && fs.existsSync(p)) {
        if (cache.length !== 0 && current_doc === docname) {
            //fast retrieval using cache
            cache.forEach((obj) => {
                if((obj._id).includes(date)) {
                    output.push(obj);
                }
            });
            msg = `Found ${output.length} records !`;
            if (callback)
                callback(msg,output)
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
                        cache.forEach((obj) => {
                            if((obj._id).includes(date)) {
                                output.push(obj);
                            }
                        });
                        msg = `Found ${output.length} records !`;
                        if (callback)
                            callback(msg,output)
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
module.exports.recordsByDate = recordsByDate;

//check if a property exists in atleast one record in a doc
function propExists(prop) {
    let exists = false;
    cache.forEach((obj) => {
        if(obj.hasOwnProperty(prop))
            return exists = true;
    });
    return exists;
}
module.exports.propExists = propExists;