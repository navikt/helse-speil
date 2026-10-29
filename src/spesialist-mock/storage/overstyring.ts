import dayjs from 'dayjs';
import { v4 } from 'uuid';

import {
    ApiArbeidsforholdoverstyring,
    ApiDagoverstyring,
    ApiInntektoverstyring,
    ApiOverstyring,
    ApiSykepengegrunnlagskjonnsfastsetting,
} from '@io/rest/generated/spesialist.schemas';
import { lokalSaksbehandlerIdent, lokalSaksbehandlerNavn } from '@spesialist-mock/constants';

type MockOverstyring =
    | Omit<ApiDagoverstyring, FellesFelter>
    | Omit<ApiInntektoverstyring, FellesFelter>
    | Omit<ApiArbeidsforholdoverstyring, FellesFelter>
    | Omit<ApiSykepengegrunnlagskjonnsfastsetting, FellesFelter>;

type FellesFelter = 'hendelseId' | 'timestamp' | 'saksbehandler' | 'ferdigstilt' | 'organisasjonsnummer';

// Spesialist viser lagrede overstyringer som historikk og som kontrollpunkter for beslutter
export class OverstyringMock {
    private static overstyringer: Map<string, ApiOverstyring[]> = new Map();

    static leggTil = (fødselsnummer: string, organisasjonsnummer: string, overstyring: MockOverstyring): void => {
        const lagret = {
            ...overstyring,
            hendelseId: v4(),
            timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS'),
            saksbehandler: { navn: lokalSaksbehandlerNavn, ident: lokalSaksbehandlerIdent },
            ferdigstilt: false,
            organisasjonsnummer,
        } as ApiOverstyring;
        OverstyringMock.overstyringer.set(fødselsnummer, [
            ...(OverstyringMock.overstyringer.get(fødselsnummer) ?? []),
            lagret,
        ]);
    };

    static hentFor = (fødselsnummer: string, organisasjonsnummer: string): ApiOverstyring[] =>
        OverstyringMock.hentForPerson(fødselsnummer).filter((it) => it.organisasjonsnummer === organisasjonsnummer);

    static hentForPerson = (fødselsnummer: string): ApiOverstyring[] =>
        OverstyringMock.overstyringer.get(fødselsnummer) ?? [];

    // Totrinnsvurdering.ferdigstill() i spesialist ferdigstiller alle overstyringene i totrinnsvurderingen
    static ferdigstillForPerson = (fødselsnummer: string): void => {
        OverstyringMock.overstyringer.set(
            fødselsnummer,
            (OverstyringMock.overstyringer.get(fødselsnummer) ?? []).map((it) => ({ ...it, ferdigstilt: true })),
        );
    };

    static nullstill = (): void => {
        OverstyringMock.overstyringer.clear();
    };
}
