import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

import { BeregnetPeriode, Notat, NotatType } from '../schemaTypes';

export class NotatMock {
    private static notater: Map<UUID, Array<Notat>> = new Map();
    private static counter: number = 0;

    static addNotat = (id: UUID, notatProperties?: Partial<Notat>): void => {
        const notat = NotatMock.getMockedNotat(notatProperties);
        NotatMock.notater.set(id, [...NotatMock.getNotater(id), notat]);
    };

    static getNotater = (id: UUID): Array<Notat> => {
        return NotatMock.notater.get(id) ?? [];
    };

    static updateNotat = (id: UUID, notatId: number, overrides: Partial<Notat>): void => {
        NotatMock.notater.set(
            id,
            NotatMock.getNotater(id).map((it) => (it.id === notatId ? { ...it, ...overrides } : it))
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

    private static getMockedNotat = (overrides?: Partial<Notat>): Notat => {
        return {
            id: NotatMock.counter++,
            tekst: 'Revidert utgave 2',
            opprettet: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            saksbehandlerOid: 'uuid',
            saksbehandlerNavn: 'Bernt Bjelle',
            saksbehandlerEpost: 'bernt.bjelle@nav.no',
            saksbehandlerIdent: 'E123456',
            vedtaksperiodeId: nanoid(),
            feilregistrert: false,
            feilregistrert_tidspunkt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            kommentarer: [],
            type: NotatType.PaaVent,
            ...overrides,
        };
    };
}
