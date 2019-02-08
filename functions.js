const os = require('os');
const ejf = require('edit-json-file');
let config = ejf(`${__dirname}/bin/.config.json`);
const mkdir = require('mkdirp');
const rimraf = require('rimraf');
const fs = require('fs');
const chalk = require('chalk');
const lodash = require('lodash');
const cfn = require('./common-functions');

//Set Data Source
function setsrc(src,callback) {
    let msg;
    if(fs.existsSync(src) && src!==process.env.LAZLO_SOURCE) {
        config.set(`db_src.${os.platform()}`,src);
        config.save();
        process.env.LAZLO_SOURCE = src;
        fs.writeFileSync(`${__dirname}/db_tracker.txt`,'');
        db_tracker = [];
        msg = `Data source set to ${process.env.LAZLO_SOURCE}`;
        if (callback)
            callback(chalk.green.bold(msg))
    }
    else if(src===process.env.LAZLO_SOURCE) {
        msg = 'You are currently accessing the same data source';
        if (callback)
            callback(chalk.red.bold(msg))
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
        msg = `Database ${dbname} already exists in the current location ! If its not listed then use track to track the database !`;
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
                fs.appendFileSync(`${__dirname}/bin/db_tracker.txt`,dbname+'\n');
                let text = fs.readFileSync(`${__dirname}/bin/db_tracker.txt`).toString();
                if (text === null) {} else  {
                        db_tracker = text.split("\n");
                        db_tracker.pop();
                }
                cfn.dbLog(dbname,true);
            }
        });
    }
}
module.exports.createDb = createDb;

//Select/Switch DB
function selectDb(dbname,callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${dbname}`;
    if(fs.existsSync(p) && lodash.includes(db_tracker,dbname)) {
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

//Track DB
function trackdb(dbname,callback) {
    let msg;
    let p = `${process.env.LAZLO_SOURCE}/${dbname}`;
    if(fs.existsSync(p)) {
        let beingTracked = false;
        db_tracker.forEach((entry) => {
            if(entry === dbname) {
                beingTracked = true;
                msg = `Database ${dbname} is already being tracked`;
                if(callback)
                    callback(chalk.red.bold(msg))
            }
        });

        if(beingTracked === false) {
            msg = `Database ${dbname} is being tracked`;
            fs.appendFileSync(`${__dirname}/bin/db_tracker.txt`,dbname+'\n');
            let text = fs.readFileSync(`${__dirname}/bin/db_tracker.txt`).toString();
            if (text === null) {} else  {
                db_tracker = text.split("\n");
                db_tracker.pop();
            }
            if(callback)
                callback(chalk.green.bold(msg))
        }

    }
    else {
        msg = `Database ${dbname} does not exist in the current data source`;
        if(callback)
            callback(chalk.red.bold(msg))
    }
}
module.exports.trackdb = trackdb;

//Untrack DB
function untrack(dbname,callback) {
    let msg;
    if(lodash.includes(db_tracker,dbname)) {
       lodash.remove(db_tracker,function (element) {
           return element === dbname;
       });
        if(db_tracker.length !== 0) {
            fs.truncateSync(`${__dirname}/bin/db_tracker.txt`);
            for(let i=0;i<db_tracker.length;i++) {
                fs.appendFileSync(`${__dirname}/bin/db_tracker.txt`,db_tracker[i] + "\n");
            }
        }
        else {
            fs.truncateSync(`${__dirname}/bin/db_tracker.txt`);
        }
        msg = `Stopped tracking ${dbname}`;
        if (callback)
            callback(chalk.green.bold(msg))
    }
    else {
        msg = `${dbname} was not being tracked`;
        if (callback)
            callback(chalk.red.bold(msg))
    }
}
module.exports.untrack = untrack;

//Delete DB
function deldb(dbname,callback) {
    let msg;
    if (fs.existsSync(`${process.env.LAZLO_SOURCE}/${dbname}`) && lodash.includes(db_tracker, dbname)) {
        let p = `${process.env.LAZLO_SOURCE}/${dbname}`;
        msg = `Database ${dbname} has been deleted`;
        rimraf(p,function (err) {
           if (callback)
               callback(err?err : null, err?null : chalk.green.bold(msg));
            if (!err) {
                db = null;
                lodash.remove(db_tracker,function (element) {
                    return element === dbname;
                });
                if(db_tracker.length !== 0) {
                    fs.truncateSync(`${__dirname}/bin/db_tracker.txt`);
                    for(let i=0;i<db_tracker.length;i++) {
                        fs.appendFileSync(`${__dirname}/bin/db_tracker.txt`,db_tracker[i] + "\n");
                    }
                }
                else {
                    fs.truncateSync(`${__dirname}/bin/db_tracker.txt`);
                }
                cfn.dbLog(dbname,false);
            }
        });
    }
    else {
        msg = `Database ${dbname} does not exist`;
        if (callback)
            callback(null, chalk.red.bold(msg))
    }
}
module.exports.deldb = deldb;