import { Events } from '@navikt/analytics-types';

import { Skjemanavn, sporHendelse, sporValideringsfeil } from '@observability/hendelser';

interface Skjemasporing {
    fullført: (egenskaper: Record<string, string | number | boolean | undefined>) => void;
    feilet: () => void;
    avbrutt: () => void;
    valideringsfeil: (feil: object) => void;
}

export function skjemasporing(skjemanavn: Skjemanavn): Skjemasporing {
    return {
        fullført: (egenskaper) =>
            sporHendelse({ name: Events.SKJEMA_FULLFORT, properties: { skjemanavn, ...egenskaper } }),
        feilet: () => sporHendelse({ name: Events.SKJEMA_INNSENDING_FEILET, properties: { skjemanavn } }),
        avbrutt: () => sporHendelse({ name: 'skjema avbrutt', properties: { skjemanavn } }),
        valideringsfeil: (feil) => sporValideringsfeil(skjemanavn, feil),
    };
}
