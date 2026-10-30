import { SparsomAktivitet } from '@io/rest/sparsom';

export type Hendelse = {
    meldingsreferanseId: string;
    type: string;
    opprettet: string;
    aktiviteter: SparsomAktivitet[];
    harFeil: boolean;
    harVarsel: boolean;
};

const hendelsetyperSomIkkeLagresISpleis = ['Påminnelse', 'Utbetalingshistorikk'];

export function erPåminnelse(hendelse: Hendelse): boolean {
    return hendelsetyperSomIkkeLagresISpleis.includes(hendelse.type);
}

export function erLagretISpleis(hendelse: Hendelse): boolean {
    return !hendelsetyperSomIkkeLagresISpleis.includes(hendelse.type);
}

export function grupperIHendelser(aktiviteter: SparsomAktivitet[]): Hendelse[] {
    return grupperPåMeldingsreferanse(aktiviteter)
        .map(({ meldingsreferanseId, type, aktiviteter }) => ({
            meldingsreferanseId,
            type,
            opprettet: aktiviteter[0]!.tidsstempel,
            aktiviteter,
            harFeil: aktiviteter.some((it) => it.nivå === 'FUNKSJONELL_FEIL' || it.nivå === 'LOGISK_FEIL'),
            harVarsel: aktiviteter.some((it) => it.nivå === 'VARSEL'),
        }))
        .filter((hendelse) => hendelse.aktiviteter.some((aktivitet) => !aktivitet.tekst.match(/Forsøker å gjenoppta/)));
}

type GruppertHendelse = {
    meldingsreferanseId: string;
    type: string;
    aktiviteter: SparsomAktivitet[];
};

// En aktivitet kan ha kontekster fra flere hendelser; den hører til hendelsen av samme type som først ga meldingsreferansen
function grupperPåMeldingsreferanse(aktiviteter: SparsomAktivitet[]): GruppertHendelse[] {
    const hendelser = new Map<string, GruppertHendelse>();
    const sorterteAktiviteter = [...aktiviteter].sort((a, b) => a.tidsstempel.localeCompare(b.tidsstempel));

    sorterteAktiviteter.forEach((aktivitet) =>
        Object.entries(aktivitet.kontekster).forEach(([type, kontekst]) => {
            const meldingsreferanseId = kontekst.meldingsreferanseId;
            if (!meldingsreferanseId) return;
            const hendelse = hendelser.get(meldingsreferanseId) ?? { meldingsreferanseId, type, aktiviteter: [] };
            if (hendelse.type !== type) return;
            hendelse.aktiviteter.push(aktivitet);
            hendelser.set(meldingsreferanseId, hendelse);
        }),
    );

    return [...hendelser.values()];
}
