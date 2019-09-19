const weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
const weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

const sum = (birthNumber, factors) =>
    factors.map((f, i) => f * parseInt(birthNumber[i], 10)).reduce((acc, curr) => acc + curr, 0);

const checksum = (fødselsnumberNumeric, weigths) =>
    (11 - (sum(fødselsnumberNumeric, weigths) % 11)) % 11;

const isValidSsn = ssn => {
    if (ssn?.trim().length != 11) {
        return false;
    }

    const ssnNumeric = ssn.split('').map(parseToInt);

    if (checksum(ssnNumeric, weights1) != ssnNumeric[9]) {
        return false;
    }

    return checksum(ssnNumeric, weights2) == ssnNumeric[10];
};

const parseToInt = char => parseInt(char, 10);

module.exports = {
    isValidSsn
};
