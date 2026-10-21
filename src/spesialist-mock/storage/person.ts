import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v5 as uuidv5 } from 'uuid';

import { Person } from '@io/graphql';
import { ApiPerson } from '@io/rest/generated/spesialist.schemas';
import { UUID } from '@typer/spesialist-mock';

type PersonIdentifikatorer = {
    aktørId: string;
    fødselsnummer: string;
    personPseudoId: UUID;
};

export type Testpersonfil = {
    data: { person: Person };
    rest?: { person?: ApiPerson };
};

export function lesTestpersonfiler(): Testpersonfil[] {
    const url = path.join(cwd(), 'src/spesialist-mock/data/personer');
    const filenames = fs.readdirSync(url);
    return filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw) as Testpersonfil;
    });
}

const lesPersoner = (): Person[] => lesTestpersonfiler().map((fil) => fil.data.person);

const UUID_NAMESPACE = '0e4ec8b1-8fad-4003-b4a4-69d90be4eee0';

const mapTilPersonIdentifikatorer = lesPersoner().map((it) => ({
    aktørId: it.aktorId,
    fødselsnummer: it.fodselsnummer,
    personPseudoId: uuidv5(it.fodselsnummer, UUID_NAMESPACE),
}));

export class PersonMock {
    private static persons: PersonIdentifikatorer[] = [
        ...mapTilPersonIdentifikatorer,
        {
            aktørId: '1000000000003',
            fødselsnummer: '',
            personPseudoId: 'b99b7845-f892-484c-b1d8-e070d2821bb6',
        },
    ];

    static findFødselsnummerForPersonPseudoId = (personPseudoId: string): string | null => {
        return (
            PersonMock.persons.find((person) => {
                if (person.personPseudoId == personPseudoId) return person;
            })?.fødselsnummer ?? null
        );
    };

    static findPersonPseudoId = (searchTerm: string): string | null => {
        return (
            PersonMock.persons.find((person) => {
                if (person.aktørId == searchTerm || person.fødselsnummer == searchTerm) return person;
            })?.personPseudoId ?? null
        );
    };

    static finnApiPerson = (fødselsnummer: string): ApiPerson | null =>
        lesTestpersonfiler().find((fil) => fil.data.person.fodselsnummer === fødselsnummer)?.rest?.person ?? null;

    static findAktørIdForPersonPseudoId = (personPseudoId: string): string | null => {
        return (
            PersonMock.persons.find((person) => {
                if (person.personPseudoId == personPseudoId) return person;
            })?.aktørId ?? null
        );
    };
}

export const finnFødselsnummerForVedtaksperiodeId = (vedtaksperiodeId: string) =>
    lesPersoner().find((person) =>
        alleBehandlinger(person).some((behandling) =>
            behandling.perioder.some((periode) => periode.vedtaksperiodeId === vedtaksperiodeId),
        ),
    )?.['fodselsnummer'];

// Selvstendig næringsdrivende har ikke organisasjonsnummer, så spesialist bruker en egen nøkkel
export const SELVSTENDIG_NÆRING = 'SELVSTENDIG';

export const finnOrganisasjonsnummerForVedtaksperiodeId = (vedtaksperiodeId: string): string | undefined => {
    const harPerioden = (inntektsforhold: { behandlinger: { perioder: { vedtaksperiodeId: string }[] }[] }) =>
        inntektsforhold.behandlinger.some((behandling) =>
            behandling.perioder.some((periode) => periode.vedtaksperiodeId === vedtaksperiodeId),
        );
    for (const person of lesPersoner()) {
        const arbeidsgiver = person.arbeidsgivere.find(harPerioden);
        if (arbeidsgiver) return arbeidsgiver.organisasjonsnummer;
        if (person.selvstendigNaering && harPerioden(person.selvstendigNaering)) return SELVSTENDIG_NÆRING;
    }
    return undefined;
};

type Inntektsforhold<B> = { behandlinger: B[] };

// Generisk fordi både GraphQL-typene og mockens schemaTypes har samme struktur
export function alleInntektsforhold<B>(person: {
    arbeidsgivere: Inntektsforhold<B>[];
    selvstendigNaering?: Inntektsforhold<B> | null;
}): Inntektsforhold<B>[] {
    return [...person.arbeidsgivere, ...(person.selvstendigNaering ? [person.selvstendigNaering] : [])];
}

export function alleBehandlinger<B>(person: {
    arbeidsgivere: Inntektsforhold<B>[];
    selvstendigNaering?: Inntektsforhold<B> | null;
}): B[] {
    return alleInntektsforhold(person).flatMap((inntektsforhold) => inntektsforhold.behandlinger);
}
