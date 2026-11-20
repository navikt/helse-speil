import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';

export type VarselstatusType = 'feil' | 'aktiv' | 'vurdert' | 'ferdig-behandlet';

export type Varselfarge = 'danger' | 'warning' | 'success';

export type Varseloppsummering = {
    måLøses: number;
    måVurderes: number;
    vurdert: number;
    farge: Varselfarge;
};

export function oppsummerVarsler(statuser: VarselstatusType[]): Varseloppsummering {
    const måLøses = statuser.filter((status) => status === 'feil').length;
    const måVurderes = statuser.filter((status) => status === 'aktiv').length;
    const vurdert = statuser.filter((status) => status === 'vurdert' || status === 'ferdig-behandlet').length;
    const farge: Varselfarge = måLøses > 0 ? 'danger' : måVurderes > 0 ? 'warning' : 'success';
    return { måLøses, måVurderes, vurdert, farge };
}

const varslerSomIkkeSkalVises = ['SB_EX_2'];

export function synligeVarsler(varsler: ApiVarselDTO[]): ApiVarselDTO[] {
    return varsler.filter((it) => !varslerSomIkkeSkalVises.includes(it.kode)).sort(byKode);
}

function byKode(a: ApiVarselDTO, b: ApiVarselDTO): number {
    if (a.kode > b.kode) return 1;
    if (a.kode < b.kode) return -1;
    return 0;
}

export type VisSomFeilRegler = {
    avviksvarsel: boolean;
    under20Sykdomsgradsvarsel: boolean;
    medlemskapsvarsel: boolean;
};

const avviksvarsel = 'RV_IV_2';
const under20Sykdomsgradsvarsel = 'RV_VV_4';
export const medlemskapsvarsel = 'RV_MV_1';

export function finnVarselstatus(varsel: ApiVarselDTO, visSomFeil: VisSomFeilRegler): VarselstatusType {
    const status = statusFraVurdering(varsel);
    if (varsel.forklaring == null || varsel.handling == null) return status;

    const skalViseSomFeil =
        (varsel.kode === avviksvarsel && visSomFeil.avviksvarsel) ||
        (varsel.kode === under20Sykdomsgradsvarsel &&
            visSomFeil.under20Sykdomsgradsvarsel &&
            status !== 'ferdig-behandlet') ||
        (varsel.kode === medlemskapsvarsel && visSomFeil.medlemskapsvarsel && status !== 'ferdig-behandlet');

    return skalViseSomFeil ? 'feil' : status;
}

function statusFraVurdering(varsel: ApiVarselDTO): VarselstatusType {
    switch (varsel.vurdering?.status) {
        case ApiSaksbildeVarselstatus.VURDERT:
            return 'vurdert';
        case ApiSaksbildeVarselstatus.GODKJENT:
            return 'ferdig-behandlet';
        default:
            return 'aktiv';
    }
}

export function venterPåMedlemskapsstatus(
    varsler: ApiVarselDTO[],
    visSomFeil: VisSomFeilRegler,
    henterMedlemskapsstatus: boolean,
): boolean {
    return (
        henterMedlemskapsstatus &&
        varsler.some((it) => it.kode === medlemskapsvarsel && finnVarselstatus(it, visSomFeil) !== 'ferdig-behandlet')
    );
}

export const statusetikett: Record<VarselstatusType, { tekst: string; farge: Varselfarge }> = {
    feil: { tekst: 'Må løses', farge: 'danger' },
    aktiv: { tekst: 'Må vurderes', farge: 'warning' },
    vurdert: { tekst: 'Vurdert', farge: 'success' },
    'ferdig-behandlet': { tekst: 'Vurdert', farge: 'success' },
};

export function oppsummeringstekst({ måLøses, måVurderes, vurdert }: Varseloppsummering): string {
    return [
        måLøses > 0 && `${måLøses} må løses`,
        måVurderes > 0 && `${måVurderes} må vurderes`,
        vurdert > 0 && `${vurdert} vurdert`,
    ]
        .filter(Boolean)
        .join(' · ');
}
