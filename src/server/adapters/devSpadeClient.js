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
    const fromFile = fs.readFileSync('__mock-data__/behandlingsummaries.json', 'utf-8');
    const behandlinger = JSON.parse(fromFile).behandlinger;
    return Promise.resolve({
        statusCode: 200,
        body: { behandlinger }
    });
};
module.exports = {
    behandlingerForPerson,
    behandlingerForPeriode
};
