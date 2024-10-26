const { pascalCase } = require('change-case-all');

module.exports = (typeName) => {
    switch (typeName) {
        case 'Person':
            return 'MainQueryPerson';
        case 'personFragment':
            return 'Person';
        default:
            return pascalCase(typeName);
    }
};
