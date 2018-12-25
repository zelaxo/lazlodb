const ejf = require('edit-json-file');
let config = ejf('./.config.json');
const uniqid = require('uniqid');
const log = require('simple-node-logger').createSimpleFileLogger(config.get("logs.lazlo_log"));

//operator comparison for where clause
function whereComp(prop, operator, val) {
    let output = [];

    if (operator === '=') {
        cache.forEach((obj) => {
            if (obj[prop] == val) {
                output.push(obj);
            }
        });
    } else if (operator === '!=') {
        cache.forEach((obj) => {
            if (obj[prop] != val) {
                output.push(obj);
            }
        });
    } else if (operator === '>') {
        cache.forEach((obj) => {
            if (obj[prop] > val) {
                output.push(obj);
            }
        });
    } else if (operator === '<') {
        cache.forEach((obj) => {
            if (obj[prop] < val) {
                output.push(obj);
            }
        });
    } else if (operator === '>=') {
        cache.forEach((obj) => {
            if (obj[prop] > val || obj[prop] == val) {
                output.push(obj);
            }
        });
    } else if (operator === '<=') {
        cache.forEach((obj) => {
            if (obj[prop] < val || obj[prop] == val) {
                output.push(obj);
            }
        });
    } else {
        output = null;
    }
    return output;
}

module.exports.whereComp = whereComp;

//id generator
function idgen() {
    let prefix = new Date().toISOString().substr(0, 10);
    return id = uniqid(`${prefix}@`);
}

module.exports.idgen = idgen;

//log generators
function docEntryLog(count, docname, op) {
    if (op === true) {
        log.info(`DE : ${count} entries added to ${docname} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
    } else {
        log.warn(`DR : ${count} entries removed from ${docname} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
    }
}

module.exports.docEntryLog = docEntryLog;

function docCreationLog(docname, db) {
    log.info(`DC : ${docname} created in ${db} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
}

module.exports.docCreationLog = docCreationLog;

function docDeletionLog(docname, db) {
    log.warn(`DD : ${docname} deleted from ${db} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
}

module.exports.docDeletionLog = docDeletionLog;

function dbLog(dbname,op) {
    if (op === true) {
        log.info(`DBC : ${dbname} created in ${process.env.LAZLO_SOURCE} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
    } else {
        log.warn(`DBD : ${dbname} deleted from ${process.env.LAZLO_SOURCE} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
    }
}

module.exports.dbLog = dbLog;

function docUpdateLog(id, docname) {
    log.info(`DU : Entry(id : ${id}) updated in ${docname} on `, new Date().toISOString().replace('T', '@').substr(0, 16));
}

module.exports.docUpdateLog = docUpdateLog;