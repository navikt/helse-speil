import { PersoninfoFraSparkel } from '../../types';
import { somDato } from './vedtaksperiode';
import { Kjønn, Person } from 'internal-types';
import { SpesialistPerson } from 'external-types';
import { mapInfotrygdutbetalinger } from './infotrygd';
import { mapArbeidsgivere } from './arbeidsgiver';

type PartialMappingResult = {
    unmapped: SpesialistPerson & {
        personinfoFraSparkel?: PersoninfoFraSparkel;
    };
    partial: Partial<Person>;
    problems: Error[];
};

const appendUnmappedData = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        enhet: unmapped.enhet,
        aktørId: unmapped.aktørId,
        tildeltTil: unmapped.tildeltTil ?? undefined,
        fødselsnummer: unmapped.fødselsnummer,
    },
    problems: problems,
});

const appendPersoninfo = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        personinfo: {
            fornavn: unmapped.personinfo.fornavn,
            mellomnavn: unmapped.personinfo.mellomnavn,
            etternavn: unmapped.personinfo.etternavn,
            fødselsdato: somDato(unmapped.personinfoFraSparkel?.fødselsdato ?? unmapped.personinfo.fødselsdato!),
            kjønn: (unmapped.personinfoFraSparkel?.kjønn ?? unmapped.personinfo.kjønn) as Kjønn,
            fnr: unmapped.personinfoFraSparkel?.fnr ?? unmapped.fødselsnummer,
        },
    },
    problems: problems,
});

const appendArbeidsgivere = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => {
    const { arbeidsgivere, problems: arbeidsgiverProblems } = await mapArbeidsgivere(unmapped.arbeidsgivere);
    return {
        unmapped,
        partial: {
            ...partial,
            arbeidsgivere: arbeidsgivere,
        },
        problems: [...problems, ...arbeidsgiverProblems],
    };
};

const appendInfotrygdutbetalinger = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        infotrygdutbetalinger: mapInfotrygdutbetalinger(unmapped),
    },
    problems: problems,
});

const finalize = (partialResult: PartialMappingResult): { person: Person; problems: Error[] } => ({
    person: partialResult.partial as Person,
    problems: partialResult.problems,
});

// Optional personinfo fra Sparkel kan fjernes når vi ikke lenger
// kan komme til å hente person fra Spesialist som mangler kjønn
// (og fødselsdato, som vi ikke bruker ennå)
export const mapPerson = async (
    person: SpesialistPerson,
    personinfoFraSparkel?: PersoninfoFraSparkel
): Promise<{ person: Person; problems: Error[] }> => {
    const unmapped = { ...person, personinfoFraSparkel };
    return appendUnmappedData({ unmapped: unmapped, partial: {}, problems: [] })
        .then(appendPersoninfo)
        .then(appendArbeidsgivere)
        .then(appendInfotrygdutbetalinger)
        .then(finalize);
};
