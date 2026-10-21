import dayjs from 'dayjs';
import { v4 } from 'uuid';

import { lokalSaksbehandlerIdent, lokalSaksbehandlerNavn } from '@spesialist-mock/constants';
import {
    Arbeidsforholdoverstyring,
    Dagoverstyring,
    Inntektoverstyring,
    Overstyring,
    Sykepengegrunnlagskjonnsfastsetting,
} from '@spesialist-mock/schemaTypes';

type MockOverstyring =
    | Omit<Dagoverstyring, FellesFelter>
    | Omit<Inntektoverstyring, FellesFelter>
    | Omit<Arbeidsforholdoverstyring, FellesFelter>
    | Omit<Sykepengegrunnlagskjonnsfastsetting, FellesFelter>;

type FellesFelter = 'hendelseId' | 'timestamp' | 'saksbehandler' | 'ferdigstilt';

type LagretOverstyring = {
    organisasjonsnummer: string;
    overstyring: Overstyring;
};

// Spesialist viser lagrede overstyringer som historikk og som kontrollpunkter for beslutter
export class OverstyringMock {
    private static overstyringer: Map<string, LagretOverstyring[]> = new Map();

    static leggTil = (fødselsnummer: string, organisasjonsnummer: string, overstyring: MockOverstyring): void => {
        const lagret: LagretOverstyring = {
            organisasjonsnummer,
            overstyring: {
                ...overstyring,
                hendelseId: v4(),
                timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
                saksbehandler: { navn: lokalSaksbehandlerNavn, ident: lokalSaksbehandlerIdent },
                ferdigstilt: false,
            } as Overstyring,
        };
        OverstyringMock.overstyringer.set(fødselsnummer, [
            ...(OverstyringMock.overstyringer.get(fødselsnummer) ?? []),
            lagret,
        ]);
    };

    static hentFor = (fødselsnummer: string, organisasjonsnummer: string): Overstyring[] =>
        (OverstyringMock.overstyringer.get(fødselsnummer) ?? [])
            .filter((it) => it.organisasjonsnummer === organisasjonsnummer)
            .map((it) => it.overstyring);

    // Totrinnsvurdering.ferdigstill() i spesialist ferdigstiller alle overstyringene i totrinnsvurderingen
    static ferdigstillForPerson = (fødselsnummer: string): void => {
        OverstyringMock.overstyringer.set(
            fødselsnummer,
            (OverstyringMock.overstyringer.get(fødselsnummer) ?? []).map((it) => ({
                ...it,
                overstyring: { ...it.overstyring, ferdigstilt: true },
            })),
        );
    };

    static nullstill = (): void => {
        OverstyringMock.overstyringer.clear();
    };
}
