import { oppgaveVedtaksperioder, oppgaver } from '@spesialist-mock/data/oppgaver';
import { fetchPersondata } from '@spesialist-mock/saksbilde';
import { BeregnetPeriode, Periode, Person } from '@spesialist-mock/schemaTypes';
import { PersonMock, alleInntektsforhold } from '@spesialist-mock/storage/person';

export type Periodeoppslag = {
    person: Person;
    personPseudoId: string;
    periode: BeregnetPeriode;
    erNyesteBehandling: boolean;
};

export type Oppgavereferanse = {
    personPseudoId: string;
    vedtaksperiodeId: string;
};

// Søker i persondataene etter at mockens lagrede endringer (behandling, varsler, historikk m.m.) er lagt på
export function finnPeriodeForBehandlingId(behandlingId: string): Periodeoppslag | null {
    return alleOppslag().find((oppslag) => oppslag.periode.behandlingId === behandlingId) ?? null;
}

export function finnPeriodeForOppgaveId(oppgaveId: string): Periodeoppslag | null {
    return (
        alleOppslag().find((oppslag) => oppslag.erNyesteBehandling && oppslag.periode.oppgave?.id === oppgaveId) ?? null
    );
}

// Oppgavelista har også oppgaver uten periode i testpersonene, så de slås opp i den statiske lista
export function finnOppgavereferanse(oppgaveId: string): Oppgavereferanse | null {
    const oppslag = finnPeriodeForOppgaveId(oppgaveId);
    if (oppslag) return { personPseudoId: oppslag.personPseudoId, vedtaksperiodeId: oppslag.periode.vedtaksperiodeId };

    const aktørId = oppgaver.find((oppgave) => oppgave.id === oppgaveId)?.aktorId;
    const personPseudoId = aktørId ? PersonMock.findPersonPseudoId(aktørId) : null;
    const vedtaksperiodeId = oppgaveVedtaksperioder.find((it) => it.id === oppgaveId)?.vedtaksperiodeId;
    return personPseudoId && vedtaksperiodeId ? { personPseudoId, vedtaksperiodeId } : null;
}

export function finnNyestePeriodeForVedtaksperiodeId(vedtaksperiodeId: string): Periodeoppslag | null {
    return (
        alleOppslag().find(
            (oppslag) => oppslag.erNyesteBehandling && oppslag.periode.vedtaksperiodeId === vedtaksperiodeId,
        ) ?? null
    );
}

export function finnPerioderMedOppgave(fødselsnummer: string): Periodeoppslag[] {
    return alleOppslag().filter(
        (oppslag) =>
            oppslag.person.fodselsnummer === fødselsnummer &&
            oppslag.erNyesteBehandling &&
            typeof oppslag.periode.oppgave?.id === 'string',
    );
}

export function harUvurderteVarsler(periode: BeregnetPeriode): boolean {
    return (periode.varsler ?? [])
        .filter((varsel) => !varsel.kode.startsWith('SB_BO_'))
        .some((varsel) => varsel.vurdering?.status !== 'VURDERT' && varsel.vurdering?.status !== 'GODKJENT');
}

function alleOppslag(): Periodeoppslag[] {
    const personer = new Set(Object.values(fetchPersondata()));
    return Array.from(personer).flatMap((person) => {
        const personPseudoId = PersonMock.findPersonPseudoId(person.fodselsnummer) ?? '';
        return alleInntektsforhold(person).flatMap((it) =>
            it.behandlinger.flatMap((behandling, index) =>
                behandling.perioder.filter(erBeregnetPeriode).map((periode) => ({
                    person,
                    personPseudoId,
                    periode,
                    erNyesteBehandling: index === 0,
                })),
            ),
        );
    });
}

function erBeregnetPeriode(periode: Periode): periode is BeregnetPeriode {
    return typeof (periode as BeregnetPeriode).utbetaling?.id === 'string';
}
