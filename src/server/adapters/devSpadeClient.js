const fs = require('fs');

const behandlingerForPeriode = () => {
    const fromFile = fs.readFileSync('__mock-data__/behov.json', 'utf-8');
    const behov = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: behov
    });
};
module.exports = {
    behandlingerForPeriode
};
