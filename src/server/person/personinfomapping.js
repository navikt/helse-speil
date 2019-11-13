'use strict';

const map = person => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: person.kjønn,
        fnr: person.fnr,
        fødselsdato: person.fdato
    };
};

module.exports = {
    map: map
};
