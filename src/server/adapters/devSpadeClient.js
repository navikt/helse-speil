const fs = require('fs');

const behandlingerForPerson = () => {
    const fromFile = fs.readFileSync('__mock-data__/tidslinjeperson.json', 'utf-8');
    const person = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: { person }
    });
};
const behandlingerForPeriode = () => {
    const fromFile = fs.readFileSync('__mock-data__/behov.json', 'utf-8');
    const behov = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: behov
    });
};
module.exports = {
    behandlingerForPerson,
    behandlingerForPeriode
};
