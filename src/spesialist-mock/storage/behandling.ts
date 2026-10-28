import {
    ApiAnnullering,
    ApiBeregnetPeriode,
    ApiEgenskap,
    ApiKategori,
    ApiOppgaveegenskap,
    ApiPeriodetilstand,
    ApiTotrinnsvurdering,
    ApiUtbetalingstatus,
    ApiVurdering,
} from '@io/rest/generated/spesialist.schemas';

export type Behandlingsendring = {
    periodetilstand?: ApiPeriodetilstand;
    utbetalingstatus?: ApiUtbetalingstatus;
    utbetalingsvurdering?: ApiVurdering;
    oppgaveFerdigstilt?: boolean;
    vedtakFattet?: boolean;
    erForkastet?: boolean;
    totrinnsvurdering?: ApiTotrinnsvurdering | null;
    annullering?: ApiAnnullering;
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
        totrinnsvurdering: ApiTotrinnsvurdering | null,
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
    static getTotrinnsvurderingForOppgave = (oppgaveId: string): ApiTotrinnsvurdering | null | undefined =>
        BehandlingMock.endringForOppgave(oppgaveId)?.totrinnsvurdering;

    static leggTilBehandletOppgave = (oppgave: BehandletOppgave): void => {
        BehandlingMock.behandledeOppgaver.push(oppgave);
    };

    static getBehandledeOppgaver = (): BehandletOppgave[] => [...BehandlingMock.behandledeOppgaver];

    static leggPåEndringer = (periode: ApiBeregnetPeriode): void => {
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
        if (endring.erForkastet) periode.erForkastet = true;
        if (endring.totrinnsvurdering !== undefined) {
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

// Felles for persondata og oppgavelista
export function totrinnsegenskap(
    totrinnsvurdering: ApiTotrinnsvurdering | null,
): typeof ApiEgenskap.BESLUTTER | typeof ApiEgenskap.RETUR | null {
    if (totrinnsvurdering?.erBeslutteroppgave) return ApiEgenskap.BESLUTTER;
    if (totrinnsvurdering?.erRetur) return ApiEgenskap.RETUR;
    return null;
}

export function erTotrinnsegenskap(egenskap: string): boolean {
    return egenskap === ApiEgenskap.BESLUTTER || egenskap === ApiEgenskap.RETUR;
}

function medTotrinnsegenskaper(
    egenskaper: ApiOppgaveegenskap[],
    totrinnsvurdering: ApiTotrinnsvurdering | null,
): ApiOppgaveegenskap[] {
    const utenTotrinnsegenskaper = egenskaper.filter(({ egenskap }) => !erTotrinnsegenskap(egenskap));
    const egenskap = totrinnsegenskap(totrinnsvurdering);
    return egenskap ? [...utenTotrinnsegenskaper, { kategori: ApiKategori.Status, egenskap }] : utenTotrinnsegenskaper;
}
