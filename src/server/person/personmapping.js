'use strict';

const map = person => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: person.kjønn
    };
};

module.exports = {
    map: map
};
