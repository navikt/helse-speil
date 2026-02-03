import dayjs from 'dayjs';

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

export class NotatMock {
    private static notater: Map<UUID, Notat[]> = new Map();
    private static notatCounter: number = 0;

    /**
     * @param id kan være vedtaksperiodeId eller notatId
     * @param notatProperties data for Notat
     */
    static addNotat = (id: string, notatProperties?: Partial<Notat>): Notat => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        const notat = NotatMock.getMockedNotat(vedtaksperiodeId, notatProperties);
        NotatMock.notater.set(vedtaksperiodeId, [...NotatMock.getNotater(vedtaksperiodeId), notat]);
        return notat;
    };

    static getNotatMedDialogId = (dialogId: number): Notat | undefined =>
        Array.from(NotatMock.notater.values())
            .flat()
            .find((n) => n.dialogRef === dialogId);

    static getKommentar = (id: number): Kommentar | undefined => {
        let _kommentar: Kommentar | undefined;
        NotatMock.notater.forEach((notater) =>
            notater.find((notat) => {
                _kommentar = notat.kommentarer.find((kommentar) => kommentar.id === id);
            }),
        );
        return _kommentar;
    };

    static getNotat = (id: number): Notat | undefined => {
        let _notat: Notat | undefined;
        NotatMock.notater.forEach((notater) => (_notat = notater.find((notat) => notat.id === id)));
        return _notat;
    };

    static feilregistrerKommentar = ({ id }: MutationFeilregistrerKommentarArgs): void => {
        NotatMock.notater.forEach((notater: Notat[], vedtaksperiodeId: UUID) => {
            const notat = notater.find((it) => it.kommentarer.find((it) => it.id === id));
            if (notat) {
                NotatMock.updateNotat(vedtaksperiodeId, notat.id, {
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
    static feilregistrerNotat = ({ id }: MutationFeilregistrerNotatArgs): void => {
        const notat = NotatMock.getNotat(id);
        if (notat) {
            NotatMock.updateNotat(notat.vedtaksperiodeId, notat.id, {
                feilregistrert: true,
                feilregistrert_tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT),
            });
        }
    };

    static getNotater = (id: UUID): Notat[] => {
        return NotatMock.notater.get(id) ?? [];
    };

    static updateNotat = (id: UUID, notatId: number, overrides: Partial<Notat>): void => {
        NotatMock.notater.set(
            id,
            NotatMock.getNotater(id).map((it) => (it.id === notatId ? { ...it, ...overrides } : it)),
        );
    };

    static getNotaterForPeriode = (periode: BeregnetPeriode): Notat[] => [
        ...NotatMock.getNotater(periode.vedtaksperiodeId),
        ...NotatMock.getNotater(periode.oppgave?.id ?? '-1'),
    ];

    private static getMockedNotat = (vedtaksperiodeId: string, overrides?: Partial<Notat>): Notat => ({
        id: NotatMock.notatCounter++,
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
