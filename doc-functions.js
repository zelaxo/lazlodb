require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');
const msgpack = require('msgpack-lite');
const lodash = require('lodash');

//File namespace
let cache = [];

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

//Insert single
function inserts(docname,input,callback) {
        let object;
        let msg;
        let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
        if(db !== null && fs.existsSync(p)) {
            try {
                object = JSON.parse(input);
            } catch (e) {
                msg = 'Syntactical error detected !';
                if(callback)
                    callback((chalk.red.bold(msg)));
            }
            if(fs.statSync(p).size !== 0) {
                let buffer = fs.readFileSync(p);
                cache = msgpack.decode(buffer);
            }
            cache.push(object);
            let buffer = msgpack.encode(cache);
            fs.writeFile(p,buffer,(err) => {
                if(err) throw err;
            });
            msg = 'Data inserted !';
            if(callback)
                callback((chalk.green.bold(msg)));
        }
        else {
            msg = 'No database selected or the document does not exist !';
            if(callback)
                callback((chalk.red.bold(msg)));
        }
}
module.exports.inserts = inserts;

//insert many
function insert(docname,input,callback) {
    let array = [];
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if(db !== null && fs.existsSync(p)) {
        try {
            array = JSON.parse(input);
        } catch (e) {
            msg = 'Syntactical error detected !';
            if(callback)
                callback((chalk.red.bold(msg)));
        }
        if(fs.statSync(p).size !== 0) {
            let buffer = fs.readFileSync(p);
            cache = msgpack.decode(buffer);
        }
        array.forEach((object) => {
            cache.push(object);
        });
        let buffer = msgpack.encode(cache);
        fs.writeFile(p,buffer,(err) => {
            if(err) throw err;
        });
        msg = 'Data inserted !';
        if(callback)
            callback((chalk.green.bold(msg)));
    }
    else {
        msg = 'No database selected or the document does not exist !';
        if(callback)
            callback((chalk.red.bold(msg)));
    }
}
module.exports.insert = insert;

//show all data
function show(docname,callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${db}/${docname}.laz`;
    if(db !== null && fs.existsSync(p)) {
        if(fs.statSync(p).size !== 0) {
            fs.readFile(p,(err,data) => {
               if(err) {
                   msg = 'Data seems to be corrupted !';
                   if(callback)
                       callback((chalk.red.bold(msg)));
               }
               else {
                   cache = msgpack.decode(data);
                   if(typeof cache === "object") {
                       cache.forEach((object) => {
                           if (callback)
                               callback(object);
                       })
                   } else {
                       msg = 'Data seems to be corrupted !';
                       if(callback)
                           callback((chalk.red.bold(msg)));
                   }
               }
            });
        }
        else {
            msg = 'Document is empty !';
            if(callback)
                callback((chalk.red.bold(msg)));
        }
    }
    else {
        msg = 'No database selected or the document does not exist !';
        if(callback)
            callback((chalk.red.bold(msg)));
    }
}
module.exports.show = show;