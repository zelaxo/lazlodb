const uniqid = require('uniqid');
const log = require('simple-node-logger').createSimpleFileLogger(`${__dirname}/bin/logs/lazlo.log`);

//operator comparison for simple where clause
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

function dbLog(dbname, op) {
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

// operator comparison for propWhere
function propComp(prop1, operator, prop2) {
    let output = [];

    if (operator === '=') {
        cache.forEach((obj) => {
            if (obj[prop1] === obj[prop2]) {
                output.push(obj);
            }
        });
    } else if (operator === '!=') {
        cache.forEach((obj) => {
            if (obj[prop1] !== obj[prop2]) {
                output.push(obj);
            }
        });
    } else if (operator === '>') {
        cache.forEach((obj) => {
            if (obj[prop1] > obj[prop2]) {
                output.push(obj);
            }
        });
    } else if (operator === '<') {
        cache.forEach((obj) => {
            if (obj[prop1] < obj[prop2]) {
                output.push(obj);
            }
        });
    } else if (operator === '>=') {
        cache.forEach((obj) => {
            if (obj[prop1] > obj[prop2] || obj[prop1] === obj[prop2]) {
                output.push(obj);
            }
        });
    } else if (operator === '<=') {
        cache.forEach((obj) => {
            if (obj[prop1] < obj[prop2] || obj[prop1] === obj[prop2]) {
                output.push(obj);
            }
        });
    } else {
        output = null;
    }
    return output;
}

module.exports.propComp = propComp;