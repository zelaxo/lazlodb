function whereComp(prop,operator,val)  //operator comparison for where clause
{
    let output = [];

    if(operator === '=') {
        cache.forEach((obj) => {
            if(obj[prop] == val) {
                output.push(obj);
            }
        });
    }
    else if(operator === '!=') {
        cache.forEach((obj) => {
            if(obj[prop] != val) {
                output.push(obj);
            }
        });
    }
    else if(operator === '>') {
        cache.forEach((obj) => {
            if(obj[prop] > val) {
                output.push(obj);
            }
        });
    }
    else if(operator === '<') {
        cache.forEach((obj) => {
            if(obj[prop] < val) {
                output.push(obj);
            }
        });
    }
    else if(operator === '>=') {
        cache.forEach((obj) => {
            if(obj[prop] > val || obj[prop] == val) {
                output.push(obj);
            }
        });
    }
    else if(operator === '<=') {
        cache.forEach((obj) => {
            if(obj[prop] < val || obj[prop] == val) {
                output.push(obj);
            }
        });
    }
    return output;
}
module.exports.whereComp = whereComp;