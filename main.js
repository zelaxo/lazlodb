#!/usr/bin/env node

const lazlo = require('vorpal')();
const ejf = require('edit-json-file');
let config = ejf('./.config.json');
const {chalk} = lazlo;
const os = require('os');
const fs = require('fs');
const listcon = require('list-contents');
const path = require('path');
const functions = require('./functions');
const docfn = require('./doc-functions');
const sad = require('./slice&dice');

//Environment Variables
if(os.platform() === 'win32') {
    process.env.LAZLO_SOURCE = config.get("db_src.win32");
}
else if(os.platform() === 'darwin') {
    process.env.LAZLO_SOURCE = config.get("db_src.darwin");
}
else {
    process.env.LAZLO_SOURCE = config.get("db_src.linux");
}

//Global namespace
global.db = null;  //Stores db name being currently used
global.db_tracker = null;
global.cache = [];
global.current_doc = null;  //Stores doc name being currently stored in cache

//Reading db_tracker log
let text = fs.readFileSync('./db_tracker.txt').toString();
if (text === null) {} else {
    db_tracker = text.split("\n");
    db_tracker.pop();
}

lazlo
    .command('set source <src>', 'Set data source')
    .action(function(args,cb) {
        let src = args.src;
        functions.setsrc(src,function(msg) {
          lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('source','Displays the current data source')
    .action(function (args,cb) {
        lazlo.log(`Current data source : ${process.env.LAZLO_SOURCE}`);
        cb();
    });

lazlo
    .command('newdb <name>', 'Create new database')
    .alias('create db')
    .action(function(args,cb) {
        let name = args.name;
        functions.createDb(name,function(err,msg) {
            if (err) lazlo.log(err);
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('list db', 'Lists all the databases within the current data source')
    .action(function(args,cb) {
        if(db_tracker.length===0) {
            lazlo.log(chalk.red.bold('No databases found !'));
        }
        else {
            let dbname;
            let logCount = 0;
            for(let i=0;i<db_tracker.length;i++) {
                dbname = db_tracker[i];
                if(fs.existsSync(`${process.env.LAZLO_SOURCE}/${dbname}`)) {
                    lazlo.log(dbname);
                    logCount++;
                }
            }
            //Malicious deletion detect
            let d = db_tracker.length - logCount;
            if(d===0) {/* db count syncs with tracker */}
            else {lazlo.log(chalk.yellow.bgRed.bold(`BREACH DETECTED : ${d} databases have been manually or maliciously deleted`))}
        }
        cb();
    });

lazlo
    .command('db <dbname>', 'Select a database')
    .alias('select')
    .action(function(args,cb) {
        let dbname = args.dbname;
        functions.selectDb(dbname,function(msg) {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('track <dbname>', 'Track a database')
    .action(function(args,cb) {
        let dbname = args.dbname;
        functions.trackdb(dbname,function(msg) {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('untrack <dbname>', 'Untrack a database')
    .action(function(args,cb) {
        let dbname = args.dbname;
        functions.untrack(dbname,function (msg) {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('delete db <dbname>', 'Delete database')
    .alias('drop')
    .action(function(args,cb) {
        let dbname = args.dbname;
        functions.deldb(dbname,function(err,msg) {
            if (err) lazlo.log(err);
            lazlo.log(msg);
        });
        cb();
    });

//*********START OF DOCUMENT COMMANDS************//

lazlo
    .command('newdoc <docname>', 'Create new document')
    .alias('create doc')
    .action(function(args,cb) {
        let docname = args.docname;
        docfn.newdoc(docname,function(msg) {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('delete doc <docname>', 'Delete document')
    .alias('remove doc')
    .action(function (args,cb) {
        let docname = args.docname;
        docfn.deldoc(docname,function(msg) {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('list doc', 'List all documents in the database')
    .alias('docs')
    .action(function(args,cb) {
            let msg;
            if(db !== null) {
                let p = `${process.env.LAZLO_SOURCE}/${db}`;
                listcon(p,{depth:1, exclude:['buckets']},(o) => {
                    if (o.error) throw o.error;
                    let output = o.files;
                    if(output.length !== 0) {
                        for(let i=0;i<output.length;i++) {
                            msg = path.basename(output[i],'.laz');
                            lazlo.log(msg);
                        }
                    }
                    else {
                        msg = 'No documents found !';
                        lazlo.log(chalk.bold.red(msg));
                    }
                });
            }
            else {
                msg = `No database selected !`;
                lazlo.log(chalk.red.bold(msg));
            }
            cb();
        });

lazlo
    .command('insert into <docname> <object>', 'Insert single data into document')
    .action(function(args,cb) {
        let object = args.object;
        let docname = args.docname;
        docfn.inserts(docname,object,(msg) => {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('insert many into <docname> <array>', 'Insert multiple data into document')
    .action(function(args,cb) {
        let array = args.array;
        let docname = args.docname;
        docfn.insert(docname,array,(msg) => {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('show all from <docname>', 'Display data in the document')
    .action(function (args,cb) {
        let docname = args.docname;
        docfn.show(docname,(msg) => {
            lazlo.log(msg);
        });
        cb();
    });

lazlo
    .command('show from <docname> <where> <prop> <operator> <val>', 'Compare single property to single value')
    .action(function(args,cb) {
        let docname = args.docname;
        let where = args.where;
        let prop = args.prop;
        let operator = args.operator;
        let val = args.val;
        if(where === 'where') {
            sad.whereClause(docname,prop,operator,val,(msg) => {
                lazlo.log(msg);
            })
        } else {
            let msg = 'Synatactical error detected !';
            lazlo.log(msg);
        }
        cb();
    });

lazlo
    .command('pick from <docname> <where> <prop1> <operator1> <val1> <conjunction> <prop2> <operator2> <val2>', 'Compare dual properties to dual values')
    .action(function(args,cb) {
        let docname = args.docname;
        let where = args.where;
        let prop1 = args.prop1;
        let operator1 = args.operator1;
        let val1 = args.val1;
        let prop2 = args.prop2;
        let operator2 = args.operator2;
        let val2 = args.val2;
        let conjunction = args.conjunction;
        if(where === 'where') {
            sad.whereClause2(docname,prop1,operator1,val1,conjunction,prop2,operator2,val2,(msg) => {
                lazlo.log(msg);
            })
        } else {
            let msg = 'Synatactical error detected !';
            lazlo.log(msg);
        }
        cb();
    });

lazlo
    .command('update in <docname> <where> <ipar> <sign> <ivalue> <as> <par> <sign> <value>', 'Update a record')
    .action((args,cb) => {
        let docname = args.docname;
        let where = args.where;
        let ipar = args.ipar;
        let sign = args.sign;
        let ivalue = args.ivalue;
        let as = args.as;
        let par = args.par;
        let value = args.value;
        if(where === 'where' && sign === '=' && as === 'as') {
            docfn.updateDoc(docname,ipar,ivalue,par,value,(msg,output) => {
               lazlo.log(chalk.green.bold(msg));
               if (output) lazlo.log(output);
            });
        } else {
            let msg = 'Syntactical Error !';
            lazlo.log(chalk.red.bold(msg));
        }
        cb();
    });

lazlo
    .command('delete from <docname> <where> <par> <sign> <value>', 'Delete record')
    .action((args,cb) => {
        let docname = args.docname;
        let where = args.where;
        let par = args.par;
        let sign = args.sign;
        let value = args.value;
        if(where === 'where' && sign === '=') {
            docfn.delData(docname,par,value,(msg,output) => {
               lazlo.log(chalk.green.bold(msg));
               if (output) lazlo.log(output);
            });
        }
        else {
            let msg = 'Syntactical Error !';
            lazlo.log(chalk.red.bold(msg));
        }
       cb();
    });

lazlo
    .command('log','Prints the log')
    .action((args,cb) => {
        fs.readFile(config.get("logs.lazlo_log"),'utf8',(err, data) => {
            if (err) lazlo.log(chalk.red.bold('Log not found or is inaccessible !'));
            lazlo.log(data);
        });
        cb();
    });

lazlo
    .command('show records of <date> <from> <docname>', 'Show records by date')
    .action((args,cb) => {
        let date = args.date;
        let from = args.from;
        let docname = args.docname;
        if(from === 'from') {
            docfn.recordsByDate(date,docname,(msg,output) => {
                lazlo.log(chalk.green.bold(msg));
                if (output) lazlo.log(output);
            });
        } else {
            let msg = 'Syntactical Error !';
            lazlo.log(chalk.red.bold(msg));
        }
        cb();
    });

lazlo
    .command('identify from <docname> <where> <prop1> <operator> <prop2>', 'Compare two properties')
    .action(function(args,cb) {
        let docname = args.docname;
        let where = args.where;
        let prop1 = args.prop1;
        let operator = args.operator;
        let prop2 = args.prop2;
        if(where === 'where') {
            sad.propWhere(docname,prop1,operator,prop2,(msg) => {
                lazlo.log(msg);
            })
        } else {
            let msg = 'Synatactical error detected !';
            lazlo.log(chalk.red.bold(msg));
        }
        cb();
    });


lazlo
    .delimiter(chalk.magenta.bold('lazlo =>'))
    .log(chalk.red.bold(`ATTENTION : CURRENT DATA SOURCE IS ${process.env.LAZLO_SOURCE}`))
    .log(chalk.green.bold('Use "set source" command to change data source'))
    .show();