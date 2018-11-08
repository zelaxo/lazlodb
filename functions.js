require('dotenv').config();
const mkdir = require('mkdirp');
const fs = require('fs');
const chalk = require('chalk');
const array = require('lodash/array');

//Global namespace
global.db = null;
global.db_tracker = null;

//Set Data Source
function setsrc(src,callback) {
    let msg;
    if(fs.existsSync(src)) {
        process.env.LAZLO_SOURCE = src;
        fs.writeFileSync('.env',`LAZLO_SOURCE=${src}`);
        msg = `Data source set to ${process.env.LAZLO_SOURCE}`;
        if (callback)
            callback(chalk.green.bold(msg))
    }
    else {
        msg = 'Not a valid path';
        if (callback)
            callback(chalk.red.bold(msg))
    }
}
module.exports.setsrc = setsrc;

//Database Creation
function createDb(dbname,callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${dbname}`;
    if(fs.existsSync(p)) {
        msg = `Database ${dbname} already exists in the current location !`;
        if (callback)
            callback(null, chalk.red.bold(msg));
    }
    else {
        msg = `Database ${dbname} created !`;
        mkdir(p, function(err) {
            if (callback) {
                callback(err?err : null, err?null : chalk.green.bold(msg));
            }
            if(!err) {
                fs.appendFileSync('db_tracker.txt',dbname+'\n');
                let text = fs.readFileSync('./db_tracker.txt').toString();
                if (text === null) {} else  {
                        db_tracker = text.split("\n");
                        db_tracker.pop();
                }
            }
        });
    }
}
module.exports.createDb = createDb;

//Select/Switch DB
function selectDb(dbname,callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${dbname}`;
    if(fs.existsSync(p)) {
        db = dbname;
        msg = `Accessing database ${db}`;
        if(callback)
            callback(chalk.green.bold(msg))
    }
    else {
        msg = `Database ${dbname} does not exist`;
        if(callback)
            callback(chalk.red.bold(msg))
    }
}
module.exports.selectDb = selectDb;