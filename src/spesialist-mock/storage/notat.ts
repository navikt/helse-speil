import dayjs from 'dayjs';
import { nextleton } from 'nextleton';

import { ApiNotat } from '@io/rest/generated/spesialist.schemas';
import { UUID } from '@typer/spesialist-mock';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { oppgaveVedtaksperioder } from '../data/oppgaver';
import {
    BeregnetPeriode,
    Kommentar,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    Notat,
    NotatType,
} from '../schemaTypes';

export const findVedtaksperiodeId = (id: string): UUID | undefined => {
    return oppgaveVedtaksperioder.find((it) => it.id === id)?.vedtaksperiodeId;
};

class NotatMock {
    private notater: Map<UUID, Notat[]> = new Map();
    private notatCounter: number = 0;

    /**
     * @param id kan være vedtaksperiodeId eller notatId
     * @param notatProperties data for Notat
     */
    addNotat = (id: string, notatProperties?: Partial<Notat>): Notat => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        const notat = this.getMockedNotat(vedtaksperiodeId, notatProperties);
        this.notater.set(vedtaksperiodeId, [...this.getNotater(vedtaksperiodeId), notat]);
        return notat;
    };

    getNotatMedDialogId = (dialogId: number): Notat | undefined =>
        Array.from(this.notater.values())
            .flat()
            .find((n) => n.dialogRef === dialogId);

    getKommentar = (id: number): Kommentar | undefined => {
        let _kommentar: Kommentar | undefined;
        this.notater.forEach((notater) =>
            notater.find((notat) => {
                _kommentar = notat.kommentarer.find((kommentar) => kommentar.id === id);
            }),
        );
        return _kommentar;
    };

    getNotat = (id: number): Notat | undefined => {
        let _notat: Notat | undefined;
        this.notater.forEach((notater) => (_notat = notater.find((notat) => notat.id === id)));
        return _notat;
    };

    feilregistrerKommentar = ({ id }: MutationFeilregistrerKommentarArgs): void => {
        this.notater.forEach((notater: Notat[], vedtaksperiodeId: UUID) => {
            const notat = notater.find((it) => it.kommentarer.find((it) => it.id === id));
            if (notat) {
                this.updateNotat(vedtaksperiodeId, notat.id, {
                    kommentarer: [
                        ...notat.kommentarer.map((it) =>
                            it.id === id
                                ? { ...it, feilregistrert_tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT) }
                                : it,
                        ),
                    ],
                });
            }
        });
    };
    feilregistrerNotat = ({ id }: MutationFeilregistrerNotatArgs): void => {
        const notat = this.getNotat(id);
        if (notat) {
            this.updateNotat(notat.vedtaksperiodeId, notat.id, {
                feilregistrert: true,
                feilregistrert_tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT),
            });
        }
    };

    getNotater = (id: UUID): Notat[] => {
        return this.notater.get(id) ?? [];
    };

    updateNotat = (id: UUID, notatId: number, overrides: Partial<Notat>): void => {
        this.notater.set(
            id,
            this.getNotater(id).map((it) => (it.id === notatId ? { ...it, ...overrides } : it)),
        );
    };

    getNotaterForPeriode = (periode: BeregnetPeriode): Notat[] => [
        ...this.getNotater(periode.vedtaksperiodeId),
        ...this.getNotater(periode.oppgave?.id ?? '-1'),
    ];

    getNotaterForVedtaksperiode = (vedtaksperiodeId: string): ApiNotat[] => {
        return this.getNotater(vedtaksperiodeId).map((notat) => ({
            id: notat.id,
            vedtaksperiodeId: notat.vedtaksperiodeId,
            kommentarer: notat.kommentarer.map((kommentar) => ({
                id: kommentar.id,
                saksbehandlerident: kommentar.saksbehandlerident,
                tekst: kommentar.tekst,
                feilregistrert_tidspunkt: kommentar.feilregistrert_tidspunkt,
                opprettet: kommentar.opprettet,
            })),
            dialogRef: notat.dialogRef,
            feilregistrert_tidspunkt: notat.feilregistrert_tidspunkt,
            opprettet: notat.opprettet,
            feilregistrert: notat.feilregistrert,
            type: notat.type == NotatType.OpphevStans ? 'OpphevStans' : 'Generelt',
            tekst: notat.tekst,
            saksbehandlerOid: notat.saksbehandlerOid,
            saksbehandlerEpost: notat.saksbehandlerEpost,
            saksbehandlerIdent: notat.saksbehandlerIdent,
            saksbehandlerNavn: notat.saksbehandlerNavn,
        }));
    };

    private getMockedNotat = (vedtaksperiodeId: string, overrides?: Partial<Notat>): Notat => ({
        id: this.notatCounter++,
        dialogRef: Math.floor(1000000 + Math.random() * 9000000),
        tekst: 'Revidert utgave 2',
        opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
        saksbehandlerOid: '11111111-2222-3333-4444-555555555555',
        saksbehandlerNavn: 'Utvikler, Lokal',
        saksbehandlerEpost: 'epost@nav.no',
        saksbehandlerIdent: 'A123456',
        vedtaksperiodeId: vedtaksperiodeId,
        feilregistrert: false,
        feilregistrert_tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT),
        type: NotatType.PaaVent,
        kommentarer: [],
        ...overrides,
    });
}

const mock = nextleton('notatMock', () => new NotatMock());

export { mock as NotatMock };
