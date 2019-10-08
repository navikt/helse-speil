'use strict';

const map = person => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: person.kjønn,
        fnr: person.fnr
    };
};

module.exports = {
    map: map
};
