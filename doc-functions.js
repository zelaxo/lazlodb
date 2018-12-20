const fs = require('fs');
const chalk = require('chalk');
const msgpack = require('msgpack-lite');

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
                callback(chalk.green.bold(msg))
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
                callback(chalk.green.bold(msg))
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
            cache.push(object);
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Data inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
        } else {
            //Normal Insertion
            if (fs.statSync(p).size !== 0) {
                let buffer = fs.readFileSync(p);
                cache = msgpack.decode(buffer);
            }
            current_doc = docname;
            cache.push(object);
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Data inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
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
                cache.push(object);
            });
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Data inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
        } else {
            //Normal Insertion
            if (fs.statSync(p).size !== 0) {
                let buffer = fs.readFileSync(p);
                cache = msgpack.decode(buffer);
            }
            current_doc = docname;
            array.forEach((object) => {
                cache.push(object);
            });
            let buffer = msgpack.encode(cache);
            fs.writeFile(p, buffer, (err) => {
                if (err) throw err;
            });
            msg = 'Data inserted !';
            if (callback)
                callback((chalk.green.bold(msg)));
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
            cache.forEach((object) => {
                if (callback)
                    callback(object);
            })
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
                            cache.forEach((object) => {
                                if (callback)
                                    callback(object);
                            })
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