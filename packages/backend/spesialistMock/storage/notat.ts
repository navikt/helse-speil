import dayjs from 'dayjs';

import { oppgaver } from '../data/oppgaver';
import {
    BeregnetPeriode,
    Kommentar,
    MutationFeilregistrerKommentarArgs,
    MutationFeilregistrerNotatArgs,
    MutationLeggTilKommentarArgs,
    Notat,
    NotatType,
} from '../schemaTypes';

const ISO_TIDSPUNKTFORMAT = 'YYYY-MM-DDTHH:mm:ss';

const findVedtaksperiodeId = (id: string): UUID | undefined => {
    return oppgaver.find((it) => it['id'] === id)?.['vedtaksperiodeId'];
};

export class NotatMock {
    private static notater: Map<UUID, Array<Notat>> = new Map();
    private static notatCounter: number = 0;
    private static kommentarCounter: number = 0;

    static addNotat = (id: string, notatProperties?: Partial<Notat>): Notat => {
        const vedtaksperiodeId = findVedtaksperiodeId(id) ?? id;
        const notat = NotatMock.getMockedNotat(vedtaksperiodeId, notatProperties);
        NotatMock.notater.set(vedtaksperiodeId, [...NotatMock.getNotater(vedtaksperiodeId), notat]);
        return notat;
    };

    static addKommentar = ({ tekst, notatId, saksbehandlerident }: MutationLeggTilKommentarArgs): Kommentar => {
        const nyKommentar: Kommentar = {
            id: NotatMock.kommentarCounter++,
            opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
            tekst,
            saksbehandlerident,
        };

        NotatMock.notater.forEach((notater: Array<Notat>, vedtaksperiodeId: UUID) => {
            const gamleKommentarer = notater.find((it) => it.id === notatId)?.kommentarer;
            if (gamleKommentarer) {
                NotatMock.updateNotat(vedtaksperiodeId, notatId, { kommentarer: [...gamleKommentarer, nyKommentar] });
            }
        });

        return nyKommentar;
    };

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
        NotatMock.notater.forEach((notater: Array<Notat>, vedtaksperiodeId: UUID) => {
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

    static getNotater = (id: UUID): Array<Notat> => {
        return NotatMock.notater.get(id) ?? [];
    };

    static updateNotat = (id: UUID, notatId: number, overrides: Partial<Notat>): void => {
        NotatMock.notater.set(
            id,
            NotatMock.getNotater(id).map((it) => (it.id === notatId ? { ...it, ...overrides } : it)),
        );
    };

    static getNotaterForPeriode = (periode: BeregnetPeriode): Array<Notat> => {
        const notaterFraPeriode = periode.notater ?? [];
        const notaterPåVedtaksperiodeId = periode.vedtaksperiodeId
            ? NotatMock.getNotater(periode.vedtaksperiodeId)
            : [];
        const notaterPåOppgavereferanse = periode.oppgavereferanse
            ? NotatMock.getNotater(periode.oppgavereferanse)
            : [];

        return [...notaterFraPeriode, ...notaterPåVedtaksperiodeId, ...notaterPåOppgavereferanse];
    };

    private static getMockedNotat = (vedtaksperiodeId: string, overrides?: Partial<Notat>): Notat => {
        return {
            id: NotatMock.notatCounter++,
            tekst: 'Revidert utgave 2',
            opprettet: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            saksbehandlerOid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
            saksbehandlerNavn: 'Bernt Bjelle',
            saksbehandlerEpost: 'bernt.bjelle@nav.no',
            saksbehandlerIdent: 'E123456',
            vedtaksperiodeId: vedtaksperiodeId,
            feilregistrert: false,
            feilregistrert_tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            type: NotatType.PaaVent,
            kommentarer: [],
            ...overrides,
        };
    };
}
