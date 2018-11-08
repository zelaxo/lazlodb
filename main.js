require('dotenv').config();
const lazlo = require('vorpal')();
const {chalk} = lazlo;
const listcon = require('list-contents');
const fs = require('fs');
const functions = require('./functions');

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
        for(let i=0;i<db_tracker.length;i++)
            lazlo.log(db_tracker[i]);
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
    .delimiter(chalk.magenta.bold('lazlo =>'))
    .log(chalk.red.bold(`ATTENTION : CURRENT DATA SOURCE IS ${process.env.LAZLO_SOURCE}`))
    .log(chalk.green.bold('Use "set source" command to change data source'))
    .show();