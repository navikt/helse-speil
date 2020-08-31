import { PersoninfoFraSparkel } from '../../../types';
import { somDato } from './vedtaksperiode';
import { Kjønn, Person, Vedtaksperiode } from '../types.internal';
import { SpesialistPerson } from './types.external';
import { tilInfotrygdutbetalinger } from './infotrygd';
import { tilArbeidsgivere } from './arbeidsgiver';

type PartialMappingResult = {
    unmapped: SpesialistPerson & {
        personinfoFraSparkel?: PersoninfoFraSparkel;
    };
    partial: Partial<Person>;
};

const appendUnmappedData = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            enhet: unmapped.enhet,
            aktørId: unmapped.aktørId,
            tildeltTil: unmapped.tildeltTil ?? undefined,
            fødselsnummer: unmapped.fødselsnummer,
        },
    });

const appendPersoninfo = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
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
    });

const appendArbeidsgivere = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            arbeidsgivere: await tilArbeidsgivere(unmapped),
        },
    });

const appendInfotrygdutbetalinger = async ({
    unmapped,
    partial,
}: PartialMappingResult): Promise<PartialMappingResult> =>
    Promise.resolve({
        unmapped,
        partial: {
            ...partial,
            infotrygdutbetalinger: tilInfotrygdutbetalinger(unmapped),
        },
    });

const finalize = (partialResult: PartialMappingResult): Person => partialResult.partial as Person;

// Optional personinfo fra Sparkel kan fjernes når vi ikke lenger
// kan komme til å hente person fra Spesialist som mangler kjønn
// (og fødselsdato, som vi ikke bruker ennå)
export const mapPerson = async (
    person: SpesialistPerson,
    personinfoFraSparkel?: PersoninfoFraSparkel
): Promise<Person> => {
    const unmapped = { ...person, personinfoFraSparkel };
    return appendUnmappedData({ unmapped, partial: {} })
        .then(appendPersoninfo)
        .then(appendArbeidsgivere)
        .then(appendInfotrygdutbetalinger)
        .then(finalize);
};
