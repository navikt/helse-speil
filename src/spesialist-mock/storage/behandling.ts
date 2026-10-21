import {
    Annullering,
    BeregnetPeriode,
    Egenskap,
    Kategori,
    Oppgaveegenskap,
    Periodetilstand,
    Totrinnsvurdering,
    Utbetalingstatus,
    Vurdering,
} from '@spesialist-mock/schemaTypes';

export type Behandlingsendring = {
    periodetilstand?: Periodetilstand;
    utbetalingstatus?: Utbetalingstatus;
    utbetalingsvurdering?: Vurdering;
    oppgaveFerdigstilt?: boolean;
    vedtakFattet?: boolean;
    erForkastet?: boolean;
    totrinnsvurdering?: Totrinnsvurdering | null;
    annullering?: Annullering;
};

type Oppgaveendring = 'oppgaveFerdigstilt' | 'totrinnsvurdering';

export type BehandletOppgave = {
    oppgaveId: string;
    personPseudoId: string;
    ferdigstiltTidspunkt: string;
    saksbehandler: string | null;
    beslutter: string | null;
};

// Runtime-endringer på behandlinger, siden testpersonene er statisk JSON som leses på nytt ved hver request
export class BehandlingMock {
    private static endringer: Map<string, Behandlingsendring> = new Map();
    // Oppgavelista slår opp på oppgaveId, så endringer som gjelder oppgaven må knyttes til den
    private static behandlingForOppgave: Map<string, string> = new Map();
    private static behandledeOppgaver: BehandletOppgave[] = [];

    static getEndring = (behandlingId: string): Behandlingsendring | undefined =>
        BehandlingMock.endringer.get(behandlingId);

    static oppdater = (behandlingId: string, endring: Omit<Behandlingsendring, Oppgaveendring>): void =>
        BehandlingMock.lagre(behandlingId, endring);

    static settTotrinnsvurdering = (
        behandlingId: string,
        oppgaveId: string,
        totrinnsvurdering: Totrinnsvurdering | null,
    ): void => {
        BehandlingMock.behandlingForOppgave.set(oppgaveId, behandlingId);
        BehandlingMock.lagre(behandlingId, { totrinnsvurdering });
    };

    static ferdigstillOppgave = (behandlingId: string, oppgaveId: string): void => {
        BehandlingMock.behandlingForOppgave.set(oppgaveId, behandlingId);
        BehandlingMock.lagre(behandlingId, { oppgaveFerdigstilt: true });
    };

    static erOppgaveFerdigstilt = (oppgaveId: string): boolean =>
        BehandlingMock.endringForOppgave(oppgaveId)?.oppgaveFerdigstilt === true;

    // undefined betyr at mocken ikke har endret totrinnsvurderingen for oppgaven
    static getTotrinnsvurderingForOppgave = (oppgaveId: string): Totrinnsvurdering | null | undefined =>
        BehandlingMock.endringForOppgave(oppgaveId)?.totrinnsvurdering;

    static leggTilBehandletOppgave = (oppgave: BehandletOppgave): void => {
        BehandlingMock.behandledeOppgaver.push(oppgave);
    };

    static getBehandledeOppgaver = (): BehandletOppgave[] => [...BehandlingMock.behandledeOppgaver];

    static leggPåEndringer = (periode: BeregnetPeriode): void => {
        const endring = BehandlingMock.endringer.get(periode.behandlingId);
        if (!endring) return;

        if (endring.periodetilstand) periode.periodetilstand = endring.periodetilstand;
        if (endring.utbetalingstatus && periode.utbetaling) {
            periode.utbetaling = {
                ...periode.utbetaling,
                status: endring.utbetalingstatus,
                vurdering: endring.utbetalingsvurdering ?? periode.utbetaling.vurdering,
            };
        }
        if (endring.oppgaveFerdigstilt) periode.oppgave = null;
        if (endring.erForkastet) periode.erForkastet = true;
        if (endring.totrinnsvurdering !== undefined) {
            periode.totrinnsvurdering = endring.totrinnsvurdering;
            periode.egenskaper = medTotrinnsegenskaper(periode.egenskaper, endring.totrinnsvurdering);
        }
        if (endring.annullering) periode.annullering = endring.annullering;
    };

    static nullstill = (): void => {
        BehandlingMock.endringer.clear();
        BehandlingMock.behandlingForOppgave.clear();
        BehandlingMock.behandledeOppgaver = [];
    };

    private static lagre = (behandlingId: string, endring: Behandlingsendring): void => {
        BehandlingMock.endringer.set(behandlingId, { ...BehandlingMock.endringer.get(behandlingId), ...endring });
    };

    private static endringForOppgave = (oppgaveId: string): Behandlingsendring | undefined => {
        const behandlingId = BehandlingMock.behandlingForOppgave.get(oppgaveId);
        return behandlingId ? BehandlingMock.endringer.get(behandlingId) : undefined;
    };
}

// Felles for persondata og oppgavelista, som bruker hver sin egenskap-enum med samme verdier
export function totrinnsegenskap(
    totrinnsvurdering: Totrinnsvurdering | null,
): Egenskap.Beslutter | Egenskap.Retur | null {
    if (totrinnsvurdering?.erBeslutteroppgave) return Egenskap.Beslutter;
    if (totrinnsvurdering?.erRetur) return Egenskap.Retur;
    return null;
}

export function erTotrinnsegenskap(egenskap: string): boolean {
    return egenskap === Egenskap.Beslutter || egenskap === Egenskap.Retur;
}

function medTotrinnsegenskaper(
    egenskaper: Oppgaveegenskap[],
    totrinnsvurdering: Totrinnsvurdering | null,
): Oppgaveegenskap[] {
    const utenTotrinnsegenskaper = egenskaper.filter(({ egenskap }) => !erTotrinnsegenskap(egenskap));
    const egenskap = totrinnsegenskap(totrinnsvurdering);
    return egenskap ? [...utenTotrinnsegenskaper, { kategori: Kategori.Status, egenskap }] : utenTotrinnsegenskaper;
}
