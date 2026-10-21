import React, { PropsWithChildren, ReactElement } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { ApiInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { Kildetype } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { cn } from '@utils/tw';

import styles from './Kilde.module.scss';

interface KildeProps {
    type: KildeikonType;
    className?: string;
}

type KildeikonType = Kildetype | ApiInntektskilde | 'AINNTEKT' | 'VEDTAK' | undefined;

const finnCSSklasse = (type: KildeikonType) => {
    switch (type) {
        case 'AINNTEKT':
            return 'ainntekt';
        case 'VEDTAK':
            return 'melding om vedtak';
        case 'InntektHentetFraAordningen':
        case ApiInntektskilde.AORDNINGEN:
            return 'aordningen';
        case 'Sykmelding':
            return 'sykmelding';
        case 'Soknad':
            return 'søknad';
        case 'Inntektsmelding':
        case ApiInntektskilde.INNTEKTSMELDING:
            return 'inntektsmelding';
        case 'Saksbehandler':
        case ApiInntektskilde.SKJONNSMESSIG_FASTSATT:
            return 'saksbehandler';
        case 'Skatteetaten':
            return 'skatteetaten';
        default:
            return '';
    }
};

const getKildeTypeTooltip = (kilde: KildeikonType): string => {
    switch (kilde) {
        case ApiInntektskilde.INNTEKTSMELDING:
        case 'Inntektsmelding':
            return 'Inntektsmelding';
        case 'Soknad':
            return 'Søknad';
        case 'Sykmelding':
            return 'Sykmelding';
        case 'Saksbehandler':
            return 'Saksbehandler';
        case 'InntektHentetFraAordningen':
        case ApiInntektskilde.AORDNINGEN:
            return 'A-ordningen';
        case ApiInntektskilde.IKKE_RAPPORTERT:
            return 'Ikke rapportert';
        case ApiInntektskilde.SAKSBEHANDLER:
            return 'Saksbehandler';
        case 'AINNTEKT':
            return 'A-inntekt';
        case ApiInntektskilde.SKJONNSMESSIG_FASTSATT:
            return 'Skjønnsmessig fastsatt';
        case 'Skatteetaten':
            return 'Skatteetaten';
        default:
            return 'Ukjent';
    }
};

const erTekst = (kilde: KildeikonType): boolean =>
    kilde !== 'Saksbehandler' &&
    kilde !== ApiInntektskilde.SAKSBEHANDLER &&
    kilde !== ApiInntektskilde.SKJONNSMESSIG_FASTSATT;

export const Kilde = ({ type, children, className }: PropsWithChildren<KildeProps>): ReactElement => (
    <Tooltip content={getKildeTypeTooltip(type)}>
        <div className={cn(styles.kildeikon, styles[`kildeikon__${finnCSSklasse(type)}`], className)}>
            {erTekst(type) ? <div className={styles.tekst}>{children}</div> : children}
        </div>
    </Tooltip>
);
