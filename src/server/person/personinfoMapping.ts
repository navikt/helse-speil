import { Personinfo, UnmappedPersoninfo } from '../../types';

const map = (person: UnmappedPersoninfo & { fnr: string }): Personinfo => {
    return {
        kjønn: person.kjønn,
        fnr: person.fnr,
        fødselsdato: person.fdato,
    };
};

export default { map };
