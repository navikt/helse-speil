import { Personinfo, UnmappedPersoninfo } from '../../types';

const map = (person: UnmappedPersoninfo & { fnr: string }): Personinfo => {
    return {
        navn: `${person.fornavn} ${person.etternavn}`,
        kjønn: person.kjønn,
        fnr: person.fnr,
        fødselsdato: person.fdato
    };
};

export default { map };
