import dayjs from 'dayjs';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiEndringsgruppe,
    ApiEndringsrad,
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
    ApiGraderteAndreYtelserEndretDag,
    ApiGraderteAndreYtelserEvent,
    ApiSaksbehandlerhandlingVisningResponse,
    ApiVisningsfelttype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

// Speiler GraderteAndreYtelserApi, GraderteAndreYtelser og GraderteAndreYtelserValidator i sp-andre-ytelser

export type GraderteAndreYtelserFeilkode =
    | 'MANGLER_ENDRINGER'
    | 'GRAD_UTENFOR_GRENSER'
    | 'SUM_ER_IKKE_100'
    | 'ARBEIDSGRAD_OKER'
    | 'YTELSER_MANGLER_TREKK'
    | 'MANGLER_BEGRUNNELSE'
    | 'UTDATERT_TILSTAND';

export const feiltitler: Record<GraderteAndreYtelserFeilkode, string> = {
    MANGLER_ENDRINGER: 'Mangler endringer',
    GRAD_UTENFOR_GRENSER: 'En grad er utenfor tillatte grenser',
    SUM_ER_IKKE_100: 'Sykdomsgrad, arbeidsgrad og andre ytelser må til sammen bli 100',
    ARBEIDSGRAD_OKER: 'Arbeidsgraden kan ikke øke ved fordeling av andre ytelser',
    YTELSER_MANGLER_TREKK: 'Sykdomsgraden må være uendret når dagen ikke har andre ytelser',
    MANGLER_BEGRUNNELSE: 'Hver dag må ha en begrunnelse',
    UTDATERT_TILSTAND: 'Graderte andre ytelser er endret siden de ble hentet',
};

type Resultat =
    | { type: 'LAGRET'; versjon: string; event: ApiGraderteAndreYtelserEvent | null }
    | { type: 'FEIL'; code: GraderteAndreYtelserFeilkode };

type Yrkesaktivitet = Pick<ApiGraderteAndreYtelser, 'yrkesaktivitet' | 'organisasjonsnummer'>;

// Rekkefølgen og navnene til GraderteAndreYtelserType i sp-andre-ytelser
const ytelsesnavn: Record<string, string> = {
    FORELDREPENGER: 'Foreldrepenger',
    SVANGERSKAPSPENGER: 'Svangerskapspenger',
    OMSORGSPENGER: 'Omsorgspenger',
    PLEIEPENGER: 'Pleiepenger',
    OPPLARINGSPENGER: 'Opplæringspenger',
};
const ytelsesrekkefølge = Object.keys(ytelsesnavn);

const graderteAndreYtelserPerPerson = new Map<string, ApiGraderteAndreYtelser[]>();

export function personFinnes(personPseudoId: string): boolean {
    return PersonMock.findFødselsnummerForPersonPseudoId(personPseudoId) !== null;
}

export function nullstillGraderteAndreYtelser(): void {
    graderteAndreYtelserPerPerson.clear();
}

export function hentGraderteAndreYtelser(personPseudoId: string): ApiGraderteAndreYtelser[] {
    return [...(graderteAndreYtelserPerPerson.get(personPseudoId) ?? [])].sort((a, b) =>
        førsteDato(a).localeCompare(førsteDato(b)),
    );
}

export function endreGraderteAndreYtelser(
    personPseudoId: string,
    request: ApiEndreGraderteAndreYtelserRequest,
): Resultat {
    const valideringsfeil = validerDager(request.dager);
    if (valideringsfeil) return { type: 'FEIL', code: valideringsfeil };

    const alle = graderteAndreYtelserPerPerson.get(personPseudoId) ?? [];
    const eksisterende = alle.find((it) => gjelderSammeYrkesaktivitet(it, request));
    if ((request.versjon ?? null) !== (eksisterende?.versjon ?? null))
        return { type: 'FEIL', code: 'UTDATERT_TILSTAND' };

    const nåværendeDager = new Map(eksisterende?.dager.map((dag) => [dag.dato, dag]));
    const dagerMedEndring = request.dager.filter((dag) => !erLike(dag, nåværendeDager.get(dag.dato)));
    if (eksisterende && dagerMedEndring.length === 0) {
        return { type: 'LAGRET', versjon: eksisterende.versjon, event: null };
    }

    const event: ApiGraderteAndreYtelserEvent = {
        versjon: crypto.randomUUID(),
        tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        utfortAvSaksbehandlerIdent: 'S123456',
        dager: dagerMedEndring.map((dag) => endretFra(dag, nåværendeDager.get(dag.dato))),
    };
    dagerMedEndring.forEach((dag) => nåværendeDager.set(dag.dato, dag));

    const oppdatert: ApiGraderteAndreYtelser = {
        yrkesaktivitet: request.yrkesaktivitet,
        organisasjonsnummer: request.organisasjonsnummer ?? null,
        versjon: event.versjon,
        dager: [...nåværendeDager.values()].sort((a, b) => a.dato.localeCompare(b.dato)),
        events: [...(eksisterende?.events ?? []), event],
    };
    graderteAndreYtelserPerPerson.set(personPseudoId, [...alle.filter((it) => it !== eksisterende), oppdatert]);

    return { type: 'LAGRET', versjon: event.versjon, event };
}

export function hentVisning(
    personPseudoId: string,
    handlingId: string,
): ApiSaksbehandlerhandlingVisningResponse | undefined {
    // handlingId i saksbehandlerhandlingen er versjonen til hendelsen
    const event = (graderteAndreYtelserPerPerson.get(personPseudoId) ?? [])
        .flatMap((it) => it.events)
        .find((it) => it.versjon === handlingId);
    if (!event) return undefined;

    return {
        felter: [
            {
                type: ApiVisningsfelttype.ENDRINGER,
                tittel: 'Dager endret',
                grupper: grupperLikeDager(event.dager).map(tilEndringsgruppe),
            },
        ],
    };
}

function validerDager(dager: ApiGraderteAndreYtelserDag[]): GraderteAndreYtelserFeilkode | null {
    if (dager.length === 0) return 'MANGLER_ENDRINGER';
    for (const dag of dager) {
        const feil = validerDag(dag);
        if (feil) return feil;
    }
    return null;
}

function validerDag(dag: ApiGraderteAndreYtelserDag): GraderteAndreYtelserFeilkode | null {
    const førFordeling = dag.sykdomsgradFørFordeling;
    const ytelser = Object.values(dag.andreYtelserGrader);
    const sumYtelser = ytelser.reduce((sum, grad) => sum + grad, 0);
    if (dag.begrunnelse.trim() === '') return 'MANGLER_BEGRUNNELSE';
    if (
        !erMellom(førFordeling, 1, 100) ||
        ytelser.some((grad) => !erMellom(grad, 1, 99)) ||
        !erMellom(dag.sykdomsgrad, 1, førFordeling) ||
        dag.arbeidsgrad < 0
    ) {
        return 'GRAD_UTENFOR_GRENSER';
    }
    if (dag.sykdomsgrad + dag.arbeidsgrad + sumYtelser !== 100) return 'SUM_ER_IKKE_100';
    if (ytelser.length === 0 && dag.sykdomsgrad !== førFordeling) return 'YTELSER_MANGLER_TREKK';
    if (dag.arbeidsgrad > 100 - førFordeling) return 'ARBEIDSGRAD_OKER';
    return null;
}

function erMellom(grad: number, min: number, maks: number): boolean {
    return Number.isInteger(grad) && grad >= min && grad <= maks;
}

function førsteDato(graderteAndreYtelser: ApiGraderteAndreYtelser): string {
    return graderteAndreYtelser.dager.map((dag) => dag.dato).sort()[0] ?? '';
}

function gjelderSammeYrkesaktivitet(a: Yrkesaktivitet, b: Yrkesaktivitet): boolean {
    return a.yrkesaktivitet === b.yrkesaktivitet && (a.organisasjonsnummer ?? null) === (b.organisasjonsnummer ?? null);
}

function erLikeGrader(a: Record<string, number> | null | undefined, b: Record<string, number> | null | undefined) {
    if (a == null || b == null) return a == b;
    const ytelser = Object.keys(a);
    return ytelser.length === Object.keys(b).length && ytelser.every((ytelse) => a[ytelse] === b[ytelse]);
}

function erLike(dag: ApiGraderteAndreYtelserDag, annen: ApiGraderteAndreYtelserDag | undefined): boolean {
    return (
        annen !== undefined &&
        dag.sykdomsgrad === annen.sykdomsgrad &&
        dag.arbeidsgrad === annen.arbeidsgrad &&
        dag.sykdomsgradFørFordeling === annen.sykdomsgradFørFordeling &&
        dag.begrunnelse === annen.begrunnelse &&
        erLikeGrader(dag.andreYtelserGrader, annen.andreYtelserGrader)
    );
}

function endretFra(
    dag: ApiGraderteAndreYtelserDag,
    fra: ApiGraderteAndreYtelserDag | undefined,
): ApiGraderteAndreYtelserEndretDag {
    return {
        dato: dag.dato,
        andreYtelserGrader: dag.andreYtelserGrader,
        sykdomsgrad: dag.sykdomsgrad,
        arbeidsgrad: dag.arbeidsgrad,
        sykdomsgradFørFordeling: dag.sykdomsgradFørFordeling,
        begrunnelse: dag.begrunnelse,
        fraAndreYtelserGrader: fra?.andreYtelserGrader ?? null,
        fraSykdomsgrad: fra?.sykdomsgrad ?? null,
        fraArbeidsgrad: fra?.arbeidsgrad ?? null,
        fraSykdomsgradFørFordeling: fra?.sykdomsgradFørFordeling ?? null,
    };
}

type Periode = { fom: string; tom: string };
type SammenhengendeDager = Periode & { endring: ApiGraderteAndreYtelserEndretDag };
type Daggruppe = { perioder: Periode[]; endring: ApiGraderteAndreYtelserEndretDag };

function erLikEndring(a: ApiGraderteAndreYtelserEndretDag, b: ApiGraderteAndreYtelserEndretDag): boolean {
    return (
        erLike(a, b) &&
        a.fraSykdomsgrad === b.fraSykdomsgrad &&
        a.fraArbeidsgrad === b.fraArbeidsgrad &&
        a.fraSykdomsgradFørFordeling === b.fraSykdomsgradFørFordeling &&
        erLikeGrader(a.fraAndreYtelserGrader, b.fraAndreYtelserGrader)
    );
}

function grupperLikeDager(dager: ApiGraderteAndreYtelserEndretDag[]): Daggruppe[] {
    return grupperSammenhengendeLikeDager(dager).reduce<Daggruppe[]>((grupper, { fom, tom, endring }) => {
        const lik = grupper.find((gruppe) => erLikEndring(gruppe.endring, endring));
        if (lik) {
            lik.perioder.push({ fom, tom });
            return grupper;
        }
        return [...grupper, { perioder: [{ fom, tom }], endring }];
    }, []);
}

function grupperSammenhengendeLikeDager(dager: ApiGraderteAndreYtelserEndretDag[]): SammenhengendeDager[] {
    return [...dager]
        .sort((a, b) => a.dato.localeCompare(b.dato))
        .reduce<SammenhengendeDager[]>((grupper, dag) => {
            const forrige = grupper.at(-1);
            if (
                forrige &&
                dayjs(forrige.tom).add(1, 'day').format('YYYY-MM-DD') === dag.dato &&
                erLikEndring(forrige.endring, dag)
            ) {
                return [...grupper.slice(0, -1), { ...forrige, tom: dag.dato }];
            }
            return [...grupper, { fom: dag.dato, tom: dag.dato, endring: dag }];
        }, []);
}

function tilEndringsgruppe({ perioder, endring }: Daggruppe): ApiEndringsgruppe {
    const datotekst = perioder
        .map(({ fom, tom }) => (fom === tom ? tilDatotekst(fom) : `${tilDatotekst(fom)} - ${tilDatotekst(tom)}`))
        .join(', ');
    // Uten tidligere fordeling vises dagen slik den var før fordeling, som for andre tidslinjeoverstyringer
    const fraYtelser = endring.fraAndreYtelserGrader ?? {};
    const fraSykdomsgrad = endring.fraSykdomsgrad ?? endring.sykdomsgradFørFordeling;
    const fraArbeidsgrad = endring.fraArbeidsgrad ?? 100 - endring.sykdomsgradFørFordeling;
    const ytelsestyper = [...new Set([...Object.keys(endring.andreYtelserGrader), ...Object.keys(fraYtelser)])].sort(
        (a, b) => ytelsesrekkefølge.indexOf(a) - ytelsesrekkefølge.indexOf(b),
    );
    return {
        rader: [
            { navn: 'Dato', fra: null, til: datotekst },
            ...ytelsestyper.map((type) =>
                endringsrad(ytelsesnavn[type] ?? type, fraYtelser[type] ?? 0, endring.andreYtelserGrader[type] ?? 0),
            ),
            endringsrad('Sykdomsgrad', fraSykdomsgrad, endring.sykdomsgrad),
            endringsrad('Arbeidsgrad', fraArbeidsgrad, endring.arbeidsgrad),
            { navn: 'Begrunnelse', fra: null, til: endring.begrunnelse },
        ],
    };
}

function endringsrad(navn: string, fra: number, til: number): ApiEndringsrad {
    return { navn, fra: fra !== til ? prosent(fra) : null, til: prosent(til) };
}

function tilDatotekst(dato: string): string {
    return dayjs(dato).format('DD.MM.YYYY');
}

function prosent(grad: number): string {
    return `${grad} %`;
}
