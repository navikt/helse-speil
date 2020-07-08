import { PersoninfoFraSparkel, UnmappedPersoninfo } from '../../types';

const map = (person: UnmappedPersoninfo & { fnr: string }): PersoninfoFraSparkel => {
    return {
        kjønn: person.kjønn,
        fnr: person.fnr,
        fødselsdato: person.fdato,
    };
};

export default { map };
